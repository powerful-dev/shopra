<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ShopCreationTest extends TestCase
{
    use RefreshDatabase;

    public function test_shop_logo_is_stored_on_public_disk(): void
    {
        Storage::fake('public');
        $this->actingAs(User::factory()->create(), 'web');

        $response = $this->post('/api/shops', [
            'name' => 'Уютный дом',
            'theme' => 'home',
            'logo' => UploadedFile::fake()->create('logo.png', 100, 'image/png'),
        ], ['Accept' => 'application/json']);

        $response->assertCreated();

        $logoPath = $response->json('data.logo');

        Storage::disk('public')->assertExists($logoPath);
        $this->assertDatabaseHas('shops', [
            'name' => 'Уютный дом',
            'logo' => $logoPath,
            'theme' => 'home',
        ]);
    }

    public function test_administrative_shop_api_requires_authentication(): void
    {
        $this->postJson('/api/shops', [])->assertUnauthorized();
    }
}
