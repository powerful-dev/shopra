<?php

namespace Tests\Feature;

use App\Enums\ImageFit;
use App\Enums\ImageFormat;
use App\Models\Shop;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShopImageSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_image_settings_have_defaults_and_are_cast_to_shared_enums(): void
    {
        $shop = Shop::query()->create();
        $shop->refresh();

        $this->assertNull($shop->group_small_image_max_width);
        $this->assertNull($shop->group_small_image_max_height);
        $this->assertSame(ImageFit::Contain, $shop->group_small_image_fit);
        $this->assertNull($shop->group_large_image_max_width);
        $this->assertNull($shop->group_large_image_max_height);
        $this->assertSame(ImageFit::Contain, $shop->group_large_image_fit);
        $this->assertSame(ImageFormat::Webp, $shop->group_image_format);
        $this->assertNull($shop->product_small_image_max_width);
        $this->assertNull($shop->product_small_image_max_height);
        $this->assertSame(ImageFit::Contain, $shop->product_small_image_fit);
        $this->assertNull($shop->product_large_image_max_width);
        $this->assertNull($shop->product_large_image_max_height);
        $this->assertSame(ImageFit::Contain, $shop->product_large_image_fit);
        $this->assertSame(ImageFormat::Webp, $shop->product_image_format);
    }

    public function test_image_settings_can_be_mass_assigned(): void
    {
        $shop = Shop::query()->create([
            'group_small_image_max_width' => 400,
            'group_small_image_max_height' => 300,
            'group_small_image_fit' => ImageFit::Contain,
            'group_large_image_max_width' => 1200,
            'group_large_image_max_height' => 800,
            'group_large_image_fit' => ImageFit::Cover,
            'group_image_format' => ImageFormat::Original,
            'product_small_image_max_width' => 500,
            'product_small_image_max_height' => 400,
            'product_small_image_fit' => ImageFit::Cover,
            'product_large_image_max_width' => 1600,
            'product_large_image_max_height' => 1200,
            'product_large_image_fit' => ImageFit::Contain,
            'product_image_format' => ImageFormat::Original,
        ]);

        $this->assertSame(400, $shop->group_small_image_max_width);
        $this->assertSame(300, $shop->group_small_image_max_height);
        $this->assertSame(ImageFit::Contain, $shop->group_small_image_fit);
        $this->assertSame(1200, $shop->group_large_image_max_width);
        $this->assertSame(800, $shop->group_large_image_max_height);
        $this->assertSame(ImageFit::Cover, $shop->group_large_image_fit);
        $this->assertSame(ImageFormat::Original, $shop->group_image_format);
        $this->assertSame(500, $shop->product_small_image_max_width);
        $this->assertSame(400, $shop->product_small_image_max_height);
        $this->assertSame(ImageFit::Cover, $shop->product_small_image_fit);
        $this->assertSame(1600, $shop->product_large_image_max_width);
        $this->assertSame(1200, $shop->product_large_image_max_height);
        $this->assertSame(ImageFit::Contain, $shop->product_large_image_fit);
        $this->assertSame(ImageFormat::Original, $shop->product_image_format);
    }
}
