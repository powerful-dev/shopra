<?php

namespace App\Services;

use App\Enums\ImageVariant;
use Illuminate\Filesystem\FilesystemManager;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Intervention\Image\Interfaces\EncodedImageInterface;
use RuntimeException;
use Throwable;

class ShopItemImageStorageService
{
    private const RESOURCE = 'products';

    public function __construct(
        private readonly ShopImageStorageService $images,
        private readonly FilesystemManager $filesystems,
    ) {}

    public function directory(int $shopItemId): string
    {
        return $this->images->directory(self::RESOURCE, $shopItemId);
    }

    public function imagePath(int $shopItemId, ImageVariant $variant, string $filename): string
    {
        return $this->directory($shopItemId).'/'.$variant->value.'/'.$filename;
    }

    public function videoPath(int $shopItemId, string $filename): string
    {
        return $this->directory($shopItemId).'/'.$filename;
    }

    public function imageUrl(int $shopItemId, ImageVariant $variant, string $filename): string
    {
        return $this->images->urlForPath($this->imagePath($shopItemId, $variant, $filename));
    }

    public function videoUrl(int $shopItemId, string $filename): string
    {
        return $this->images->urlForPath($this->videoPath($shopItemId, $filename));
    }

    public function deleteImageVariants(int $shopItemId, string $filename): void
    {
        $this->images->deletePaths([
            $this->imagePath($shopItemId, ImageVariant::Small, $filename),
            $this->imagePath($shopItemId, ImageVariant::Large, $filename),
        ]);
    }

    public function deleteVideo(int $shopItemId, string $filename): void
    {
        $this->images->deletePaths([$this->videoPath($shopItemId, $filename)]);
    }

    /**
     * @param  callable(string): void  $activate
     * @return array{filename: string, small: string, large: string}
     */
    public function storeImageVariants(
        int $shopItemId,
        EncodedImageInterface $small,
        EncodedImageInterface $large,
        callable $activate,
    ): array {
        return $this->images->storeVariants(
            self::RESOURCE,
            $shopItemId,
            $small,
            $large,
            $activate,
        );
    }

    /** @param callable(string): void $activate */
    public function storeVideo(int $shopItemId, UploadedFile $video, callable $activate): string
    {
        $filename = Str::uuid()->toString().'.'.strtolower($video->extension());
        $path = $this->videoPath($shopItemId, $filename);
        $disk = $this->filesystems->disk('public');

        if (! $disk->putFileAs($this->directory($shopItemId), $video, $filename)) {
            throw new RuntimeException('Unable to store product video.');
        }

        try {
            $activate($filename);
        } catch (Throwable $exception) {
            $disk->delete($path);

            throw $exception;
        }

        return $filename;
    }
}
