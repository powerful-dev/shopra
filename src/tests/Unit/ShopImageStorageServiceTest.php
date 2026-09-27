<?php

namespace Tests\Unit;

use App\Enums\ImageVariant;
use App\Services\ShopImageStorageService;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\EncodedImage;
use Intervention\Image\Interfaces\EncodedImageInterface;
use Mockery;
use RuntimeException;
use Tests\TestCase;

class ShopImageStorageServiceTest extends TestCase
{
    public function test_it_builds_category_image_paths_and_urls(): void
    {
        Storage::fake('public');
        $service = app(ShopImageStorageService::class);

        $this->assertSame('shop/categories/42', $service->directory('categories', 42));
        $this->assertSame([
            'small' => 'shop/categories/42/small.webp',
            'large' => 'shop/categories/42/large.webp',
        ], $service->paths('categories', 42));
        $this->assertSame(
            Storage::disk('public')->url('shop/categories/42/large.webp'),
            $service->url('categories', 42, ImageVariant::Large),
        );
    }

    public function test_it_atomically_replaces_processed_images_without_storing_the_original(): void
    {
        Storage::fake('public');
        $service = app(ShopImageStorageService::class);
        $directory = 'shop/categories/42';
        Storage::disk('public')->put($directory.'/original.jpg', 'old original');
        Storage::disk('public')->put($directory.'/small.webp', 'old small');
        Storage::disk('public')->put($directory.'/large.webp', 'old large');

        $paths = $service->replace(
            'categories',
            42,
            new EncodedImage('new small', 'image/png'),
            new EncodedImage('new large', 'image/png'),
            function (array $paths): void {
                $this->assertSame('new small', Storage::disk('public')->get($paths['small']));
                $this->assertSame('new large', Storage::disk('public')->get($paths['large']));
            },
        );

        $this->assertSame([
            'small' => $directory.'/small.png',
            'large' => $directory.'/large.png',
        ], $paths);
        $this->assertSame('new small', Storage::disk('public')->get($paths['small']));
        $this->assertSame('new large', Storage::disk('public')->get($paths['large']));
        $this->assertSame([$paths['large'], $paths['small']], Storage::disk('public')->files($directory));
    }

    public function test_it_restores_previous_images_when_activation_fails(): void
    {
        Storage::fake('public');
        $service = app(ShopImageStorageService::class);
        $directory = 'shop/categories/42';
        Storage::disk('public')->put($directory.'/small.webp', 'old small');
        Storage::disk('public')->put($directory.'/large.webp', 'old large');

        try {
            $service->replace(
                'categories',
                42,
                new EncodedImage('new small', 'image/webp'),
                new EncodedImage('new large', 'image/webp'),
                fn () => throw new RuntimeException('Category update failed.'),
            );

            $this->fail('The replacement should have failed.');
        } catch (RuntimeException $exception) {
            $this->assertSame('Category update failed.', $exception->getMessage());
        }

        $this->assertSame('old small', Storage::disk('public')->get($directory.'/small.webp'));
        $this->assertSame('old large', Storage::disk('public')->get($directory.'/large.webp'));
        $this->assertSame([
            $directory.'/large.webp',
            $directory.'/small.webp',
        ], Storage::disk('public')->files($directory));
    }

    public function test_it_removes_temporary_files_when_storing_a_new_version_fails(): void
    {
        Storage::fake('public');
        $service = app(ShopImageStorageService::class);
        $directory = 'shop/categories/42';
        Storage::disk('public')->put($directory.'/small.webp', 'old small');
        Storage::disk('public')->put($directory.'/large.webp', 'old large');
        $large = Mockery::mock(EncodedImageInterface::class);
        $large->shouldReceive('mediaType')->once()->andReturn('image/webp');
        $large->shouldReceive('toString')->once()->andThrow(new RuntimeException('Encoding failed.'));

        try {
            $service->replace(
                'categories',
                42,
                new EncodedImage('new small', 'image/webp'),
                $large,
                fn () => $this->fail('The category must not be updated.'),
            );

            $this->fail('The replacement should have failed.');
        } catch (RuntimeException $exception) {
            $this->assertSame('Encoding failed.', $exception->getMessage());
        }

        $this->assertSame('old small', Storage::disk('public')->get($directory.'/small.webp'));
        $this->assertSame('old large', Storage::disk('public')->get($directory.'/large.webp'));
        $this->assertSame([
            $directory.'/large.webp',
            $directory.'/small.webp',
        ], Storage::disk('public')->files($directory));
    }
}
