<?php

namespace Tests\Unit;

use App\Enums\ImageFit;
use App\Enums\ImageFormat;
use App\Services\ImageProcessingService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Interfaces\EncodedImageInterface;
use InvalidArgumentException;
use Tests\TestCase;

class ImageProcessingServiceTest extends TestCase
{
    public function test_contain_scales_proportionally_without_upscaling(): void
    {
        $service = app(ImageProcessingService::class);

        $scaled = $service->process(
            UploadedFile::fake()->image('source.png', 400, 200),
            100,
            100,
            ImageFit::Contain,
            ImageFormat::Webp,
        );
        $notUpscaled = $service->process(
            UploadedFile::fake()->image('source.png', 400, 200),
            800,
            800,
            ImageFit::Contain,
            ImageFormat::Webp,
        );

        $this->assertImageSize($scaled, 100, 50);
        $this->assertImageSize($notUpscaled, 400, 200);
    }

    public function test_cover_scales_and_crops_to_the_requested_dimensions(): void
    {
        $processed = app(ImageProcessingService::class)->process(
            UploadedFile::fake()->image('source.jpg', 400, 200),
            100,
            100,
            ImageFit::Cover,
            ImageFormat::Webp,
        );

        $this->assertImageSize($processed, 100, 100);
    }

    public function test_nullable_dimensions_preserve_aspect_ratio(): void
    {
        $service = app(ImageProcessingService::class);

        $widthOnly = $service->process(
            UploadedFile::fake()->image('source.png', 400, 200),
            100,
            null,
            ImageFit::Cover,
            ImageFormat::Webp,
        );
        $heightOnly = $service->process(
            UploadedFile::fake()->image('source.png', 400, 200),
            null,
            50,
            ImageFit::Contain,
            ImageFormat::Webp,
        );
        $withoutDimensions = $service->process(
            UploadedFile::fake()->image('source.png', 400, 200),
            null,
            null,
            ImageFit::Contain,
            ImageFormat::Webp,
        );

        $this->assertImageSize($widthOnly, 100, 50);
        $this->assertImageSize($heightOnly, 100, 50);
        $this->assertImageSize($withoutDimensions, 400, 200);
    }

    public function test_it_preserves_the_original_format_or_converts_to_webp(): void
    {
        $service = app(ImageProcessingService::class);

        $png = $service->process(
            UploadedFile::fake()->image('source.png', 40, 30),
            null,
            null,
            ImageFit::Contain,
            ImageFormat::Original,
        );
        $jpeg = $service->process(
            UploadedFile::fake()->image('source.jpg', 40, 30),
            null,
            null,
            ImageFit::Contain,
            ImageFormat::Original,
        );
        $webp = $service->process(
            UploadedFile::fake()->image('source.png', 40, 30),
            null,
            null,
            ImageFit::Contain,
            ImageFormat::Webp,
        );

        $this->assertSame('image/png', $png->mediaType());
        $this->assertSame('image/jpeg', $jpeg->mediaType());
        $this->assertSame('image/webp', $webp->mediaType());
    }

    public function test_result_can_be_saved_with_laravel_storage(): void
    {
        Storage::fake('public');
        $processed = app(ImageProcessingService::class)->process(
            UploadedFile::fake()->image('source.png', 40, 30),
            20,
            20,
            ImageFit::Contain,
            ImageFormat::Webp,
        );

        $this->assertTrue(Storage::disk('public')->put('processed.webp', $processed->toStream()));
        Storage::disk('public')->assertExists('processed.webp');
    }

    public function test_dimensions_must_be_positive_when_provided(): void
    {
        $this->expectException(InvalidArgumentException::class);

        app(ImageProcessingService::class)->process(
            UploadedFile::fake()->image('source.png', 40, 30),
            0,
            null,
            ImageFit::Contain,
            ImageFormat::Webp,
        );
    }

    private function assertImageSize(EncodedImageInterface $image, int $width, int $height): void
    {
        $decoded = app(ImageManager::class)->decodeBinary($image->toString());

        $this->assertSame($width, $decoded->width());
        $this->assertSame($height, $decoded->height());
    }
}
