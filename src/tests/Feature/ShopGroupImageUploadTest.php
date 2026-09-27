<?php

namespace Tests\Feature;

use App\Enums\ImageFit;
use App\Enums\ImageFormat;
use App\Models\Module;
use App\Models\Shop;
use App\Models\ShopGroup;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Tests\TestCase;

class ShopGroupImageUploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_category_image_variants_are_stored_and_replaced(): void
    {
        Storage::fake('public');
        $shop = Shop::query()->create([
            'group_small_image_max_width' => 40,
            'group_small_image_max_height' => 40,
            'group_small_image_fit' => ImageFit::Contain,
            'group_large_image_max_width' => 50,
            'group_large_image_max_height' => 50,
            'group_large_image_fit' => ImageFit::Cover,
            'group_image_format' => ImageFormat::Webp,
        ]);
        $group = ShopGroup::query()->create(['name' => 'Backpacks', 'slug' => 'backpacks']);
        $this->authenticateWithProductsAccess();
        $firstUpload = UploadedFile::fake()->image('first.jpg', 80, 60);
        $response = $this->post('/api/product-categories/'.$group->id.'/image', [
            'image' => $firstUpload,
        ], ['Accept' => 'application/json']);

        $directory = 'shop/categories/'.$group->id;
        $smallPath = $directory.'/small.webp';
        $largePath = $directory.'/large.webp';
        $url = Storage::disk('public')->url($smallPath);
        $largeUrl = Storage::disk('public')->url($largePath);
        $response
            ->assertOk()
            ->assertJsonPath('data.path', $smallPath)
            ->assertJsonPath('data.url', fn (string $value): bool => str_starts_with($value, $url.'?v='))
            ->assertJsonPath('data.large_url', fn (string $value): bool => str_starts_with($value, $largeUrl.'?v='));
        $this->assertSame($smallPath, $group->fresh()->image);
        Storage::disk('public')->assertExists($smallPath);
        Storage::disk('public')->assertExists($largePath);
        Storage::disk('public')->assertCount($directory, 2);
        $this->assertStoredImage($smallPath, 40, 30, 'image/webp');
        $this->assertStoredImage($largePath, 50, 50, 'image/webp');

        $shop->update(['group_image_format' => ImageFormat::Original]);
        $replacement = UploadedFile::fake()->image('replacement.png', 120, 90);
        $this->post('/api/product-categories/'.$group->id.'/image', [
            'image' => $replacement,
        ], ['Accept' => 'application/json'])
            ->assertOk()
            ->assertJsonPath('data.path', $directory.'/small.png');

        $this->assertSame($directory.'/small.png', $group->fresh()->image);
        $this->assertStoredImage($directory.'/small.png', 40, 30, 'image/png');
        $this->assertStoredImage($directory.'/large.png', 50, 50, 'image/png');
        Storage::disk('public')->assertMissing($smallPath);
        Storage::disk('public')->assertMissing($largePath);
        Storage::disk('public')->assertCount($directory, 2);
        $this->getJson('/api/product-categories')
            ->assertOk()
            ->assertJsonPath(
                'data.0.image_url',
                fn (string $value): bool => str_starts_with(
                    $value,
                    Storage::disk('public')->url($directory.'/small.png').'?v=',
                ),
            )
            ->assertJsonPath(
                'data.0.image_large_url',
                fn (string $value): bool => str_starts_with(
                    $value,
                    Storage::disk('public')->url($directory.'/large.png').'?v=',
                ),
            );
    }

    public function test_category_image_is_validated(): void
    {
        Storage::fake('public');
        $group = ShopGroup::query()->create(['name' => 'Backpacks', 'slug' => 'backpacks']);
        $this->authenticateWithProductsAccess();

        $this->postJson('/api/product-categories/'.$group->id.'/image')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('image');
        $this->post('/api/product-categories/'.$group->id.'/image', [
            'image' => UploadedFile::fake()->create('document.pdf', 100, 'application/pdf'),
        ], ['Accept' => 'application/json'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('image');
        $this->post('/api/product-categories/'.$group->id.'/image', [
            'image' => UploadedFile::fake()->image('large.jpg')->size(config('images.category_upload_max_kilobytes') + 1),
        ], ['Accept' => 'application/json'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('image');
    }

    public function test_admin_app_exposes_the_category_image_upload_limit(): void
    {
        $this->get('/admin/products')
            ->assertOk()
            ->assertSee(
                '<meta name="category-image-upload-max-bytes" content="'.(config('images.category_upload_max_kilobytes') * 1024).'">',
                false,
            );
    }

    public function test_category_image_can_be_deleted(): void
    {
        Storage::fake('public');
        $group = ShopGroup::query()->create(['name' => 'Backpacks', 'slug' => 'backpacks']);
        $directory = 'shop/categories/'.$group->id;
        $group->update(['image' => $directory.'/small.webp']);
        Storage::disk('public')->put($directory.'/original.jpg', 'original image contents');
        Storage::disk('public')->put($directory.'/small.webp', 'small image contents');
        Storage::disk('public')->put($directory.'/large.webp', 'large image contents');
        $this->authenticateWithProductsAccess();

        $this->deleteJson('/api/product-categories/'.$group->id.'/image')->assertNoContent();

        Storage::disk('public')->assertDirectoryEmpty($directory);
        $this->assertNull($group->fresh()->image);
        $this->getJson('/api/product-categories')
            ->assertOk()
            ->assertJsonMissingPath('data.0.image_url')
            ->assertJsonMissingPath('data.0.image_large_url');
    }

    public function test_category_image_changes_require_product_access(): void
    {
        $group = ShopGroup::query()->create(['name' => 'Backpacks', 'slug' => 'backpacks']);

        $this->postJson('/api/product-categories/'.$group->id.'/image')->assertUnauthorized();
        $this->deleteJson('/api/product-categories/'.$group->id.'/image')->assertUnauthorized();
        $this->actingAs(User::factory()->create(['is_active' => true]), 'sanctum')
            ->postJson('/api/product-categories/'.$group->id.'/image')
            ->assertForbidden();
        $this->deleteJson('/api/product-categories/'.$group->id.'/image')->assertForbidden();
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

    private function assertStoredImage(string $path, int $width, int $height, string $mediaType): void
    {
        $contents = Storage::disk('public')->get($path);
        $image = app(ImageManager::class)->decodeBinary($contents);

        $this->assertSame($mediaType, (new \finfo(FILEINFO_MIME_TYPE))->buffer($contents));
        $this->assertSame($width, $image->width());
        $this->assertSame($height, $image->height());
    }
}
