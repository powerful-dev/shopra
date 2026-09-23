<?php

namespace Tests\Unit;

use App\Enums\ImageVariant;
use App\Services\ShopImageStorageService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ShopImageStorageServiceTest extends TestCase
{
    public function test_it_builds_category_image_paths_and_urls(): void
    {
        Storage::fake('public');
        $service = app(ShopImageStorageService::class);

        $this->assertSame('shop/categories/42', $service->directory('categories', 42));
        $this->assertSame([
            'original' => 'shop/categories/42/original.webp',
            'small' => 'shop/categories/42/small.webp',
            'large' => 'shop/categories/42/large.webp',
        ], $service->paths('categories', 42));
        $this->assertSame(
            Storage::disk('public')->url('shop/categories/42/large.webp'),
            $service->url('categories', 42, ImageVariant::Large),
        );
    }

    public function test_it_stores_only_the_original_image(): void
    {
        Storage::fake('public');
        $service = app(ShopImageStorageService::class);

        $path = $service->storeOriginal(
            'categories',
            42,
            UploadedFile::fake()->image('source.png', 40, 30),
        );

        $this->assertSame('shop/categories/42/original.webp', $path);
        Storage::disk('public')->assertExists($path);
        $this->assertSame('image/webp', (new \finfo(FILEINFO_MIME_TYPE))->buffer(
            Storage::disk('public')->get($path),
        ));
        Storage::disk('public')->assertMissing('shop/categories/42/small.webp');
        Storage::disk('public')->assertMissing('shop/categories/42/large.webp');
    }
}
