<?php

namespace App\Services;

use App\Enums\ImageVariant;
use Illuminate\Filesystem\FilesystemManager;
use Intervention\Image\ImageManager;
use RuntimeException;
use Symfony\Component\HttpFoundation\File\File;

class ShopImageStorageService
{
    public function __construct(
        private readonly FilesystemManager $filesystems,
        private readonly ImageManager $images,
    ) {}

    public function directory(string $resource, int $resourceId): string
    {
        return 'shop/'.trim($resource, '/').'/'.$resourceId;
    }

    public function path(string $resource, int $resourceId, ImageVariant $variant): string
    {
        return $this->directory($resource, $resourceId).'/'.$variant->value.'.webp';
    }

    /** @return array<string, string> */
    public function paths(string $resource, int $resourceId): array
    {
        return $this->mapVariants(
            fn (ImageVariant $variant): string => $this->path($resource, $resourceId, $variant),
        );
    }

    public function url(string $resource, int $resourceId, ImageVariant $variant): string
    {
        return $this->filesystems->disk('public')->url(
            $this->path($resource, $resourceId, $variant),
        );
    }

    /** @return array<string, string> */
    public function urls(string $resource, int $resourceId): array
    {
        return $this->mapVariants(
            fn (ImageVariant $variant): string => $this->url($resource, $resourceId, $variant),
        );
    }

    public function storeOriginal(string $resource, int $resourceId, File $image): string
    {
        $path = $this->path($resource, $resourceId, ImageVariant::Original);
        $encodedImage = $this->images->read($image->getPathname())->toWebp();
        $stored = $this->filesystems->disk('public')->put($path, (string) $encodedImage);

        if (! $stored) {
            throw new RuntimeException('Unable to store shop image.');
        }

        return $path;
    }

    public function delete(string $resource, int $resourceId, ImageVariant $variant): void
    {
        $deleted = $this->filesystems->disk('public')->delete(
            $this->path($resource, $resourceId, $variant),
        );

        if (! $deleted) {
            throw new RuntimeException('Unable to delete shop image.');
        }
    }

    /** @return array<string, string> */
    private function mapVariants(callable $callback): array
    {
        $variants = [];

        foreach (ImageVariant::cases() as $variant) {
            $variants[$variant->value] = $callback($variant);
        }

        return $variants;
    }
}
