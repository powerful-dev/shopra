<?php

namespace Tests\Feature;

use Tests\TestCase;

class ShopHomePageTest extends TestCase
{
    public function test_home_page_uses_the_shop_blade_view(): void
    {
        $response = $this->get('/');

        $response
            ->assertOk()
            ->assertViewIs('sites.shop.home')
            ->assertSee('Собрано для города.', false)
            ->assertSee('rel="stylesheet"', false)
            ->assertSee('type="module"', false)
            ->assertSee('/build/assets/uikit-', false)
            ->assertSee('/build/assets/gymshark-', false);
    }
}

