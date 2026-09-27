<?php

namespace App\Services;

use App\Enums\ImageVariant;
use Illuminate\Filesystem\FilesystemManager;
use Illuminate\Support\Str;
use Intervention\Image\Interfaces\EncodedImageInterface;
use RuntimeException;
use Throwable;

class ShopImageStorageService
{
    public function __construct(
        private readonly FilesystemManager $filesystems,
    ) {}

    public function directory(string $resource, int $resourceId): string
    {
        return 'shop/'.trim($resource, '/').'/'.$resourceId;
    }

    public function path(
        string $resource,
        int $resourceId,
        ImageVariant $variant,
        string $extension = 'webp',
    ): string {
        return $this->directory($resource, $resourceId).'/'.$variant->value.'.'.$extension;
    }

    /** @return array<string, string> */
    public function paths(string $resource, int $resourceId, string $extension = 'webp'): array
    {
        return $this->mapVariants(
            fn (ImageVariant $variant): string => $this->path($resource, $resourceId, $variant, $extension),
        );
    }

    public function url(
        string $resource,
        int $resourceId,
        ImageVariant $variant,
        string $extension = 'webp',
    ): string {
        return $this->filesystems->disk('public')->url(
            $this->path($resource, $resourceId, $variant, $extension),
        );
    }

    public function urlForPath(string $path): string
    {
        return $this->filesystems->disk('public')->url($path);
    }

    /** @return array<string, string> */
    public function urls(string $resource, int $resourceId, string $extension = 'webp'): array
    {
        return $this->mapVariants(
            fn (ImageVariant $variant): string => $this->url($resource, $resourceId, $variant, $extension),
        );
    }

    /**
     * @param  callable(array{small: string, large: string}): void  $activate
     * @return array{small: string, large: string}
     */
    public function replace(
        string $resource,
        int $resourceId,
        EncodedImageInterface $small,
        EncodedImageInterface $large,
        callable $activate,
    ): array {
        $disk = $this->filesystems->disk('public');
        $directory = $this->directory($resource, $resourceId);
        $token = Str::uuid()->toString();
        $paths = [
            ImageVariant::Small->value => $this->path(
                $resource,
                $resourceId,
                ImageVariant::Small,
                $this->extension($small),
            ),
            ImageVariant::Large->value => $this->path(
                $resource,
                $resourceId,
                ImageVariant::Large,
                $this->extension($large),
            ),
        ];
        $temporaryPaths = [
            ImageVariant::Small->value => $directory.'/.new-'.$token.'-'.basename($paths[ImageVariant::Small->value]),
            ImageVariant::Large->value => $directory.'/.new-'.$token.'-'.basename($paths[ImageVariant::Large->value]),
        ];
        $previousPaths = $disk->directoryExists($directory) ? $disk->files($directory) : [];
        $backupPaths = [];
        $promotedPaths = [];

        try {
            $this->store($temporaryPaths[ImageVariant::Small->value], $small->toString());
            $this->store($temporaryPaths[ImageVariant::Large->value], $large->toString());

            foreach ($previousPaths as $previousPath) {
                $backupPath = $directory.'/.old-'.$token.'-'.basename($previousPath);
                $this->move($previousPath, $backupPath);
                $backupPaths[$previousPath] = $backupPath;
            }

            $this->move($temporaryPaths[ImageVariant::Small->value], $paths[ImageVariant::Small->value]);
            $promotedPaths[] = $paths[ImageVariant::Small->value];
            $this->move($temporaryPaths[ImageVariant::Large->value], $paths[ImageVariant::Large->value]);
            $promotedPaths[] = $paths[ImageVariant::Large->value];

            $activate($paths);
            $this->deletePaths(array_values($backupPaths));
        } catch (Throwable $exception) {
            $this->deletePaths($promotedPaths, false);

            foreach ($backupPaths as $previousPath => $backupPath) {
                if ($disk->exists($backupPath)) {
                    $this->move($backupPath, $previousPath);
                }
            }

            $this->deletePaths(array_values($temporaryPaths), false);
            $this->deletePaths(array_values($backupPaths), false);

            throw $exception;
        }

        return $paths;
    }

    public function deleteAll(string $resource, int $resourceId): void
    {
        $disk = $this->filesystems->disk('public');
        $directory = $this->directory($resource, $resourceId);

        if ($disk->directoryExists($directory) && ! $disk->deleteDirectory($directory)) {
            throw new RuntimeException('Unable to delete shop images.');
        }
    }

    private function store(string $path, string|false $contents): void
    {
        if ($contents === false) {
            throw new RuntimeException('Unable to read shop image.');
        }

        $stored = $this->filesystems->disk('public')->put($path, $contents);

        if (! $stored) {
            throw new RuntimeException('Unable to store shop image.');
        }
    }

    private function move(string $from, string $to): void
    {
        if (! $this->filesystems->disk('public')->move($from, $to)) {
            throw new RuntimeException('Unable to move shop image.');
        }
    }

    /** @param list<string> $paths */
    private function deletePaths(array $paths, bool $throw = true): void
    {
        if ($paths === []) {
            return;
        }

        $disk = $this->filesystems->disk('public');
        $existingPaths = array_values(array_filter($paths, $disk->exists(...)));

        if ($existingPaths !== [] && ! $disk->delete($existingPaths) && $throw) {
            throw new RuntimeException('Unable to delete shop images.');
        }
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

        foreach ([ImageVariant::Small, ImageVariant::Large] as $variant) {
            $variants[$variant->value] = $callback($variant);
        }

        return $variants;
    }

    private function extension(EncodedImageInterface $image): string
    {
        return match ($image->mediaType()) {
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            default => throw new RuntimeException('Unsupported processed shop image type.'),
        };
    }
}
