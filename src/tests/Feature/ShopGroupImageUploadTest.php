<?php

namespace Tests\Feature;

use App\Models\Module;
use App\Models\ShopGroup;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ShopGroupImageUploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_category_image_is_converted_to_webp_stored_and_replaced(): void
    {
        Storage::fake('public');
        $group = ShopGroup::query()->create(['name' => 'Backpacks', 'slug' => 'backpacks']);
        $this->authenticateWithProductsAccess();

        $response = $this->post('/api/product-categories/'.$group->id.'/image', [
            'image' => UploadedFile::fake()->image('first.jpg', 80, 60),
        ], ['Accept' => 'application/json']);

        $path = 'shop/categories/'.$group->id.'/original.webp';
        $url = Storage::disk('public')->url($path);
        $response
            ->assertOk()
            ->assertJsonPath('data.path', $path)
            ->assertJsonPath('data.url', fn (string $value): bool => str_starts_with($value, $url.'?v='));
        $this->assertSame($path, $group->fresh()->image);
        Storage::disk('public')->assertExists($path);
        $this->assertSame('image/webp', (new \finfo(FILEINFO_MIME_TYPE))->buffer(
            Storage::disk('public')->get($path),
        ));
        $firstImage = Storage::disk('public')->get($path);

        $this->post('/api/product-categories/'.$group->id.'/image', [
            'image' => UploadedFile::fake()->image('replacement.png', 120, 90),
        ], ['Accept' => 'application/json'])->assertOk();

        $this->assertNotSame($firstImage, Storage::disk('public')->get($path));
        $this->getJson('/api/product-categories')
            ->assertOk()
            ->assertJsonPath('data.0.image_url', fn (string $value): bool => str_starts_with($value, $url.'?v='));
    }

    public function test_category_image_is_validated(): void
    {
        Storage::fake('public');
        $group = ShopGroup::query()->create(['name' => 'Backpacks', 'slug' => 'backpacks']);
        $this->authenticateWithProductsAccess();

        $this->postJson('/api/product-categories/'.$group->id.'/image')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('image');
        $this->post('/api/product-categories/'.$group->id.'/image', [
            'image' => UploadedFile::fake()->create('document.pdf', 100, 'application/pdf'),
        ], ['Accept' => 'application/json'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('image');
        $this->post('/api/product-categories/'.$group->id.'/image', [
            'image' => UploadedFile::fake()->image('large.jpg')->size(5121),
        ], ['Accept' => 'application/json'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('image');
    }

    public function test_category_image_can_be_deleted(): void
    {
        Storage::fake('public');
        $group = ShopGroup::query()->create(['name' => 'Backpacks', 'slug' => 'backpacks']);
        $path = 'shop/categories/'.$group->id.'/original.webp';
        $group->update(['image' => $path]);
        Storage::disk('public')->put($path, 'image contents');
        $this->authenticateWithProductsAccess();

        $this->deleteJson('/api/product-categories/'.$group->id.'/image')->assertNoContent();

        Storage::disk('public')->assertMissing($path);
        $this->assertNull($group->fresh()->image);
        $this->getJson('/api/product-categories')
            ->assertOk()
            ->assertJsonMissingPath('data.0.image_url');
    }

    public function test_category_image_changes_require_product_access(): void
    {
        $group = ShopGroup::query()->create(['name' => 'Backpacks', 'slug' => 'backpacks']);

        $this->postJson('/api/product-categories/'.$group->id.'/image')->assertUnauthorized();
        $this->deleteJson('/api/product-categories/'.$group->id.'/image')->assertUnauthorized();
        $this->actingAs(User::factory()->create(['is_active' => true]), 'sanctum')
            ->postJson('/api/product-categories/'.$group->id.'/image')
            ->assertForbidden();
        $this->deleteJson('/api/product-categories/'.$group->id.'/image')->assertForbidden();
    }

    private function authenticateWithProductsAccess(): void
    {
        $admin = User::factory()->create(['is_active' => true]);
        $module = Module::query()->create([
            'code' => 'products',
            'show_in_menu' => true,
            'is_required' => false,
        ]);
        $admin->modules()->attach($module);
        $this->actingAs($admin, 'sanctum');
    }
}
