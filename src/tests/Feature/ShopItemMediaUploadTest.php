<?php

namespace Tests\Feature;

use App\Enums\ImageFit;
use App\Enums\ImageFormat;
use App\Models\Module;
use App\Models\Shop;
use App\Models\ShopItem;
use App\Models\ShopItemMedia;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Tests\TestCase;

class ShopItemMediaUploadTest extends TestCase
{
    use RefreshDatabase;

    // Real 32x32 HEIC/HEVC fixture kept inline so the API test has no filesystem or network dependency.
    // Source: https://www.sampleyogi.com/samples/heic/heic-icon-32x32.heic
    private const HEIC_FIXTURE_BASE64 = 'AAAAJGZ0eXBoZWljAAAAAG1pZjFNaVBybWlhZk1pSEJoZWljAAABw21ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAHBpY3QAAAAAAAAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAAADnBpdG0AAAAAAAEAAAA4aWluZgAAAAAAAgAAABVpbmZlAgAAAAABAABodmMxAAAAABVpbmZlAgAAAQACAABFeGlmAAAAABppcmVmAAAAAAAAAA5jZHNjAAIAAQABAAAA5mlwcnAAAADFaXBjbwAAABNjb2xybmNseAACAAIABoAAAAAMY2xsaQDLAEAAAAAUaXNwZQAAAAAAAAAgAAAAIAAAAAlpcm90AAAAABBwaXhpAAAAAAMICAgAAABxaHZjQwEDcAAAALAAAAAAAB7wAPz9+PgAAAsDoAABABdAAQwB//8DcAAAAwCwAAADAAADAB5wJKEAAQAjQgEBA3AAAAMAsAAAAwAAAwAeoBQgQcCDCOIe5FlU3AgIGAKiAAEACUQBwGFyyERTZAAAABlpcG1hAAAAAAAAAAEAAQaBAgOEBYYAAAAsaWxvYwAAAABEAAACAAEAAAABAAACQwAAASUAAgAAAAEAAAH3AAAATAAAAAFtZGF0AAAAAAAAAYEAAAAGRXhpZgAATU0AKgAAAAgAAwEaAAUAAAABAAAAMgEbAAUAAAABAAAAOgEoAAMAAAABAAIAAAAAAAAAAABIAAAAAQAAAEgAAAABAAABISgBr6EweBpevf2B6w/1nOwiONX+GL1La38RmevzWUzT9D3r7jA0VRtjL4XO8t/RWfdSXs1Y8qGo9zOew8U21mU4VppsYqv7u7Pyz1zyoc0MYzcg3DAd+yEhUz03NAi9tIff8iVKuN/L5XoLNlDPGG9CRGr4uR/uaNPfkF8E7KNRqb4Pub6swSBh7qqL18uiysXUnvkir/4ZbqYEHsNZH8XuMWSnT/fWqV50CKvZLU6QbzID/liEFognBSF790OBXGnPnQhzlUEM/Lj14jITusV/fUkQvf//9yhSv/90eImpFAEZQ3EL/cn/jaSQHcJD9FBRHe3/f50F7IU7hw1BGZHr/EI//olcDRU1DsjwgDRa5kXv+f+OuhZtu28zyz6KUmg=';

    public function test_media_config_is_exposed_from_the_application_configuration(): void
    {
        $this->authenticateWithProductsAccess();

        $this->getJson('/api/products/media-config')
            ->assertOk()
            ->assertExactJson([
                'data' => [
                    'image' => [
                        'extensions' => config('media.products.image_extensions'),
                        'mime_types' => config('media.products.image_mime_types'),
                        'max_kilobytes' => config('media.image_max_kilobytes'),
                        'max_count' => config('media.products.max_images'),
                    ],
                    'video' => [
                        'extensions' => config('media.products.video_extensions'),
                        'mime_types' => config('media.products.video_mime_types'),
                        'max_kilobytes' => config('media.video_max_kilobytes'),
                        'max_count' => config('media.products.max_videos'),
                    ],
                ],
            ]);
    }

    public function test_images_are_processed_and_the_first_image_is_main(): void
    {
        Storage::fake('public');
        $this->createShopWithImageSettings();
        $item = $this->createItem();
        $this->authenticateWithProductsAccess();

        $firstResponse = $this->post('/api/products/'.$item->id.'/media', [
            'type' => ShopItemMedia::TYPE_IMAGE,
            'file' => UploadedFile::fake()->image('first.jpg', 120, 80),
        ], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonPath('data.type', ShopItemMedia::TYPE_IMAGE)
            ->assertJsonPath('data.sort_order', 0)
            ->assertJsonPath('data.is_main', true)
            ->assertJsonPath('data.small_url', fn (string $url): bool => str_contains($url, "/shop/products/{$item->id}/small/"))
            ->assertJsonPath('data.large_url', fn (string $url): bool => str_contains($url, "/shop/products/{$item->id}/large/"));

        $firstFilename = $firstResponse->json('data.filename');
        $this->assertStoredImage(
            "shop/products/{$item->id}/small/{$firstFilename}",
            40,
            27,
        );
        $this->assertStoredImage(
            "shop/products/{$item->id}/large/{$firstFilename}",
            50,
            50,
        );

        $secondResponse = $this->post('/api/products/'.$item->id.'/media', [
            'type' => ShopItemMedia::TYPE_IMAGE,
            'file' => UploadedFile::fake()->image('second.png', 90, 120),
        ], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonPath('data.sort_order', 1)
            ->assertJsonPath('data.is_main', false);

        $secondFilename = $secondResponse->json('data.filename');
        Storage::disk('public')->assertExists("shop/products/{$item->id}/small/{$secondFilename}");
        Storage::disk('public')->assertExists("shop/products/{$item->id}/large/{$secondFilename}");
        $this->assertSame(1, $item->media()->where('type', ShopItemMedia::TYPE_IMAGE)->where('is_main', true)->count());
    }

    public function test_heic_and_heif_images_are_accepted_case_insensitively_and_stored_as_webp_variants(): void
    {
        Storage::fake('public');
        $this->createShopWithImageSettings();
        $this->authenticateWithProductsAccess();

        foreach (['photo.HEIC', 'photo.HeIf'] as $filename) {
            $item = $this->createItem();
            $response = $this->post('/api/products/'.$item->id.'/media', [
                'type' => ShopItemMedia::TYPE_IMAGE,
                'file' => UploadedFile::fake()->createWithContent(
                    $filename,
                    base64_decode(self::HEIC_FIXTURE_BASE64, true),
                ),
            ], ['Accept' => 'application/json'])
                ->assertCreated()
                ->assertJsonPath('data.type', ShopItemMedia::TYPE_IMAGE)
                ->assertJsonPath('data.is_main', true)
                ->assertJsonPath('data.small_url', fn (string $url): bool => str_contains($url, "/shop/products/{$item->id}/small/"))
                ->assertJsonPath('data.large_url', fn (string $url): bool => str_contains($url, "/shop/products/{$item->id}/large/"));

            $storedFilename = $response->json('data.filename');

            $this->assertStringEndsWith('.webp', $storedFilename);
            $this->assertStoredImage("shop/products/{$item->id}/small/{$storedFilename}", 32, 32);
            $this->assertStoredImage("shop/products/{$item->id}/large/{$storedFilename}", 50, 50);
        }
    }

    public function test_video_is_stored_directly_and_is_never_main(): void
    {
        Storage::fake('public');
        $item = $this->createItem();
        $this->authenticateWithProductsAccess();

        $response = $this->post('/api/products/'.$item->id.'/media', [
            'type' => ShopItemMedia::TYPE_VIDEO,
            'file' => UploadedFile::fake()->create('demo.mp4', 100, 'video/mp4'),
        ], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonPath('data.type', ShopItemMedia::TYPE_VIDEO)
            ->assertJsonPath('data.sort_order', 0)
            ->assertJsonPath('data.is_main', false)
            ->assertJsonPath('data.url', fn (string $url): bool => str_contains($url, "/shop/products/{$item->id}/"));

        $filename = $response->json('data.filename');
        Storage::disk('public')->assertExists("shop/products/{$item->id}/{$filename}");
        Storage::disk('public')->assertMissing("shop/products/{$item->id}/small/{$filename}");
        Storage::disk('public')->assertMissing("shop/products/{$item->id}/large/{$filename}");
    }

    public function test_media_limits_are_configured_and_enforced(): void
    {
        Storage::fake('public');
        $this->createShopWithImageSettings();
        $item = $this->createItem();
        $this->authenticateWithProductsAccess();

        $this->assertSame(20, config('media.products.max_images'));
        $this->assertSame(2, config('media.products.max_videos'));

        foreach (range(0, 19) as $sortOrder) {
            $item->media()->create([
                'type' => ShopItemMedia::TYPE_IMAGE,
                'filename' => "image-{$sortOrder}.webp",
                'sort_order' => $sortOrder,
                'is_main' => $sortOrder === 0,
            ]);
        }

        foreach (range(20, 21) as $sortOrder) {
            $item->media()->create([
                'type' => ShopItemMedia::TYPE_VIDEO,
                'filename' => "video-{$sortOrder}.mp4",
                'sort_order' => $sortOrder,
                'is_main' => false,
            ]);
        }

        $this->post('/api/products/'.$item->id.'/media', [
            'type' => ShopItemMedia::TYPE_IMAGE,
            'file' => UploadedFile::fake()->image('extra.jpg'),
        ], ['Accept' => 'application/json'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('file');

        $this->post('/api/products/'.$item->id.'/media', [
            'type' => ShopItemMedia::TYPE_VIDEO,
            'file' => UploadedFile::fake()->create('extra.mp4', 100, 'video/mp4'),
        ], ['Accept' => 'application/json'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('file');

        $this->assertSame(22, $item->media()->count());
    }

    public function test_product_returns_saved_media_in_sort_order(): void
    {
        $item = $this->createItem();
        $item->media()->createMany([
            [
                'type' => ShopItemMedia::TYPE_VIDEO,
                'filename' => 'video.mp4',
                'sort_order' => 2,
                'is_main' => false,
            ],
            [
                'type' => ShopItemMedia::TYPE_IMAGE,
                'filename' => 'main.webp',
                'sort_order' => 0,
                'is_main' => true,
            ],
        ]);
        $this->authenticateWithProductsAccess();

        $this->getJson('/api/products/'.$item->id)
            ->assertOk()
            ->assertJsonPath('data.media.0.filename', 'main.webp')
            ->assertJsonPath('data.media.0.small_url', fn (string $url): bool => str_ends_with($url, "/shop/products/{$item->id}/small/main.webp"))
            ->assertJsonPath('data.media.0.large_url', fn (string $url): bool => str_ends_with($url, "/shop/products/{$item->id}/large/main.webp"))
            ->assertJsonMissingPath('data.media.0.url')
            ->assertJsonPath('data.media.1.filename', 'video.mp4')
            ->assertJsonPath('data.media.1.url', fn (string $url): bool => str_ends_with($url, "/shop/products/{$item->id}/video.mp4"))
            ->assertJsonMissingPath('data.media.1.small_url');
    }

    public function test_product_media_can_be_reordered_and_the_first_image_becomes_main(): void
    {
        $item = $this->createItem();
        $firstImage = $item->media()->create([
            'type' => ShopItemMedia::TYPE_IMAGE,
            'filename' => 'first.webp',
            'sort_order' => 0,
            'is_main' => true,
        ]);
        $video = $item->media()->create([
            'type' => ShopItemMedia::TYPE_VIDEO,
            'filename' => 'video.mp4',
            'sort_order' => 1,
            'is_main' => false,
        ]);
        $secondImage = $item->media()->create([
            'type' => ShopItemMedia::TYPE_IMAGE,
            'filename' => 'second.webp',
            'sort_order' => 2,
            'is_main' => false,
        ]);
        $this->authenticateWithProductsAccess();

        $this->putJson('/api/products/'.$item->id.'/media/order', [
            'ids' => [$video->id, $secondImage->id, $firstImage->id],
        ])
            ->assertOk()
            ->assertJsonPath('data.0.id', $video->id)
            ->assertJsonPath('data.0.sort_order', 0)
            ->assertJsonPath('data.0.is_main', false)
            ->assertJsonPath('data.1.id', $secondImage->id)
            ->assertJsonPath('data.1.sort_order', 1)
            ->assertJsonPath('data.1.is_main', true)
            ->assertJsonPath('data.2.id', $firstImage->id)
            ->assertJsonPath('data.2.sort_order', 2)
            ->assertJsonPath('data.2.is_main', false);

        $this->getJson('/api/products/'.$item->id)
            ->assertOk()
            ->assertJsonPath('data.media.0.id', $video->id)
            ->assertJsonPath('data.media.1.id', $secondImage->id)
            ->assertJsonPath('data.media.1.is_main', true)
            ->assertJsonPath('data.media.2.id', $firstImage->id);
    }

    public function test_media_order_must_contain_each_product_media_item_once(): void
    {
        $item = $this->createItem();
        $media = $item->media()->createMany([
            [
                'type' => ShopItemMedia::TYPE_IMAGE,
                'filename' => 'first.webp',
                'sort_order' => 0,
                'is_main' => true,
            ],
            [
                'type' => ShopItemMedia::TYPE_VIDEO,
                'filename' => 'video.mp4',
                'sort_order' => 1,
                'is_main' => false,
            ],
        ]);
        $otherItemMedia = $this->createItem()->media()->create([
            'type' => ShopItemMedia::TYPE_IMAGE,
            'filename' => 'other.webp',
            'sort_order' => 0,
            'is_main' => true,
        ]);
        $this->authenticateWithProductsAccess();

        $this->putJson('/api/products/'.$item->id.'/media/order', [
            'ids' => [$media[0]->id],
        ])->assertUnprocessable()->assertJsonValidationErrors('ids');

        $this->putJson('/api/products/'.$item->id.'/media/order', [
            'ids' => [$media[0]->id, $media[0]->id],
        ])->assertUnprocessable()->assertJsonValidationErrors('ids.1');

        $this->putJson('/api/products/'.$item->id.'/media/order', [
            'ids' => [$media[0]->id, $otherItemMedia->id],
        ])->assertUnprocessable()->assertJsonValidationErrors('ids.1');

        $this->assertDatabaseHas('shop_item_media', [
            'id' => $media[0]->id,
            'sort_order' => 0,
            'is_main' => true,
        ]);
        $this->assertDatabaseHas('shop_item_media', [
            'id' => $media[1]->id,
            'sort_order' => 1,
            'is_main' => false,
        ]);
    }

    public function test_media_can_be_deleted_with_its_files_and_the_remaining_order_is_normalized(): void
    {
        Storage::fake('public');
        config()->set('media.products.max_images', 2);
        $this->createShopWithImageSettings();
        $item = $this->createItem();
        $video = $item->media()->create([
            'type' => ShopItemMedia::TYPE_VIDEO,
            'filename' => 'video.mp4',
            'sort_order' => 0,
            'is_main' => false,
        ]);
        $mainImage = $item->media()->create([
            'type' => ShopItemMedia::TYPE_IMAGE,
            'filename' => 'main.webp',
            'sort_order' => 3,
            'is_main' => true,
        ]);
        $remainingImage = $item->media()->create([
            'type' => ShopItemMedia::TYPE_IMAGE,
            'filename' => 'remaining.webp',
            'sort_order' => 8,
            'is_main' => false,
        ]);
        $directory = "shop/products/{$item->id}";
        Storage::disk('public')->put("{$directory}/video.mp4", 'video');
        Storage::disk('public')->put("{$directory}/small/main.webp", 'small main');
        Storage::disk('public')->put("{$directory}/large/main.webp", 'large main');
        Storage::disk('public')->put("{$directory}/small/remaining.webp", 'small remaining');
        Storage::disk('public')->put("{$directory}/large/remaining.webp", 'large remaining');
        $this->authenticateWithProductsAccess();

        $this->deleteJson("/api/products/{$item->id}/media/{$mainImage->id}")
            ->assertOk()
            ->assertJsonPath('data.0.id', $video->id)
            ->assertJsonPath('data.0.sort_order', 0)
            ->assertJsonPath('data.0.is_main', false)
            ->assertJsonPath('data.1.id', $remainingImage->id)
            ->assertJsonPath('data.1.sort_order', 1)
            ->assertJsonPath('data.1.is_main', true);

        $this->assertDatabaseMissing('shop_item_media', ['id' => $mainImage->id]);
        Storage::disk('public')->assertMissing("{$directory}/small/main.webp");
        Storage::disk('public')->assertMissing("{$directory}/large/main.webp");
        Storage::disk('public')->assertExists("{$directory}/small/remaining.webp");

        $this->deleteJson("/api/products/{$item->id}/media/{$video->id}")
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $remainingImage->id)
            ->assertJsonPath('data.0.sort_order', 0)
            ->assertJsonPath('data.0.is_main', true);

        Storage::disk('public')->assertMissing("{$directory}/video.mp4");

        $this->post('/api/products/'.$item->id.'/media', [
            'type' => ShopItemMedia::TYPE_IMAGE,
            'file' => UploadedFile::fake()->image('replacement.jpg'),
        ], ['Accept' => 'application/json'])->assertCreated();

        $this->assertSame(2, $item->media()->where('type', ShopItemMedia::TYPE_IMAGE)->count());
    }

    public function test_media_type_format_and_size_are_validated(): void
    {
        Storage::fake('public');
        $item = $this->createItem();
        $this->authenticateWithProductsAccess();

        $this->postJson('/api/products/'.$item->id.'/media', [
            'type' => 'document',
        ])->assertUnprocessable()->assertJsonValidationErrors(['type', 'file']);

        $this->post('/api/products/'.$item->id.'/media', [
            'type' => ShopItemMedia::TYPE_IMAGE,
            'file' => UploadedFile::fake()->create('document.pdf', 100, 'application/pdf'),
        ], ['Accept' => 'application/json'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('file');

        $this->post('/api/products/'.$item->id.'/media', [
            'type' => ShopItemMedia::TYPE_VIDEO,
            'file' => UploadedFile::fake()->create('document.pdf', 100, 'application/pdf'),
        ], ['Accept' => 'application/json'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('file');

        $this->post('/api/products/'.$item->id.'/media', [
            'type' => ShopItemMedia::TYPE_VIDEO,
            'file' => UploadedFile::fake()->create(
                'large.mp4',
                config('media.video_max_kilobytes') + 1,
                'video/mp4',
            ),
        ], ['Accept' => 'application/json'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('file');
    }

    public function test_media_upload_requires_product_access(): void
    {
        $item = $this->createItem();

        $this->postJson('/api/products/'.$item->id.'/media')->assertUnauthorized();

        $this->actingAs(User::factory()->create(['is_active' => true]), 'sanctum')
            ->postJson('/api/products/'.$item->id.'/media')
            ->assertForbidden();
    }

    public function test_shop_item_name_can_be_null(): void
    {
        $item = ShopItem::query()->create([
            'name' => null,
            'url' => 'empty-draft',
            'price' => 0,
        ]);

        $this->assertNull($item->fresh()->name);
    }

    private function createShopWithImageSettings(): Shop
    {
        return Shop::query()->create([
            'product_small_image_max_width' => 40,
            'product_small_image_max_height' => 40,
            'product_small_image_fit' => ImageFit::Contain,
            'product_large_image_max_width' => 50,
            'product_large_image_max_height' => 50,
            'product_large_image_fit' => ImageFit::Cover,
            'product_image_format' => ImageFormat::Webp,
        ]);
    }

    private function createItem(): ShopItem
    {
        return ShopItem::query()->create([
            'name' => 'Test product',
            'url' => 'test-product-'.fake()->unique()->numerify('######'),
            'price' => 1000,
        ]);
    }

    private function authenticateWithProductsAccess(): void
    {
        $admin = User::factory()->create(['is_active' => true]);
        $module = Module::query()->create([
            'code' => 'products',
            'show_in_menu' => true,
            'is_required' => false,
        ]);
        $admin->modules()->attach($module);
        $this->actingAs($admin, 'sanctum');
    }

    private function assertStoredImage(string $path, int $width, int $height): void
    {
        $contents = Storage::disk('public')->get($path);
        $image = app(ImageManager::class)->decodeBinary($contents);

        $this->assertSame('image/webp', (new \finfo(FILEINFO_MIME_TYPE))->buffer($contents));
        $this->assertSame($width, $image->width());
        $this->assertSame($height, $image->height());
    }
}
