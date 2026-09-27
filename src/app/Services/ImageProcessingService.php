<?php

namespace App\Services;

use App\Enums\ImageFit;
use App\Enums\ImageFormat;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\ImageManager;
use Intervention\Image\Interfaces\EncodedImageInterface;
use Intervention\Image\Interfaces\ImageInterface;
use InvalidArgumentException;

class ImageProcessingService
{
    public function __construct(private readonly ImageManager $images) {}

    public function process(
        mixed $source,
        ?int $maxWidth,
        ?int $maxHeight,
        ImageFit $fit,
        ImageFormat $format,
    ): EncodedImageInterface {
        $this->validateDimension($maxWidth, 'Maximum width');
        $this->validateDimension($maxHeight, 'Maximum height');

        $image = $this->images->decode($source);

        if ($maxWidth !== null || $maxHeight !== null) {
            $image = $this->resize($image, $maxWidth, $maxHeight, $fit);
        }

        return match ($format) {
            ImageFormat::Original => $image->encode(),
            ImageFormat::Webp => $image->encode(new WebpEncoder),
        };
    }

    private function resize(
        ImageInterface $image,
        ?int $maxWidth,
        ?int $maxHeight,
        ImageFit $fit,
    ): ImageInterface {
        if ($fit === ImageFit::Cover && $maxWidth !== null && $maxHeight !== null) {
            return $image->cover($maxWidth, $maxHeight);
        }

        return $image->scaleDown(width: $maxWidth, height: $maxHeight);
    }

    private function validateDimension(?int $dimension, string $name): void
    {
        if ($dimension !== null && $dimension < 1) {
            throw new InvalidArgumentException($name.' must be greater than zero.');
        }
    }
}
