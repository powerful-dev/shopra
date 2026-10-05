<?php

namespace Tests\Feature;

use App\Enums\ShopAttributeType;
use App\Models\Module;
use App\Models\ShopAttribute;
use App\Models\ShopItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShopAttributeApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_attributes_require_authentication_and_product_module_access(): void
    {
        $this->getJson('/api/product-attributes')->assertUnauthorized();
        $this->postJson('/api/product-attributes', [])->assertUnauthorized();
        $this->putJson('/api/product-attributes/1', [])->assertUnauthorized();
        $this->deleteJson('/api/product-attributes/1')->assertUnauthorized();
        $this->postJson('/api/product-attributes/1/options', [])->assertUnauthorized();

        $this->actingAs(User::factory()->create(['is_active' => true]), 'sanctum')
            ->getJson('/api/product-attributes')
            ->assertForbidden();
    }

    public function test_attributes_can_be_created_listed_updated_and_deleted(): void
    {
        $this->authenticateProductAdmin();

        $numberId = $this->postJson('/api/product-attributes', [
            'name' => 'Weight',
            'type' => 'number',
            'unit' => 'kg',
            'is_visible' => false,
            'is_filterable' => true,
            'sort_order' => 2,
        ])->assertCreated()
            ->assertJsonPath('data.type', 'number')
            ->assertJsonPath('data.unit', 'kg')
            ->assertJsonPath('data.options', [])
            ->json('data.id');

        $textId = $this->postJson('/api/product-attributes', [
            'name' => 'Description',
            'type' => 'text',
        ])->assertCreated()
            ->assertJsonPath('data.is_visible', true)
            ->assertJsonPath('data.is_filterable', false)
            ->assertJsonPath('data.sort_order', 0)
            ->json('data.id');

        $this->getJson('/api/product-attributes')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.id', $textId)
            ->assertJsonPath('data.1.id', $numberId);

        $this->patchJson("/api/product-attributes/{$numberId}", [
            'name' => 'Package weight',
            'sort_order' => -1,
        ])->assertOk()
            ->assertJsonPath('data.name', 'Package weight')
            ->assertJsonPath('data.unit', 'kg')
            ->assertJsonPath('data.sort_order', -1);

        $this->deleteJson("/api/product-attributes/{$textId}")->assertNoContent();
        $this->assertDatabaseMissing('shop_attributes', ['id' => $textId]);
    }

    public function test_attribute_validation_enforces_enum_and_number_units(): void
    {
        $this->authenticateProductAdmin();

        $this->postJson('/api/product-attributes', [
            'name' => 'Invalid',
            'type' => 'unsupported',
        ])->assertUnprocessable()->assertJsonValidationErrors('type');

        $this->postJson('/api/product-attributes', [
            'name' => 'Material',
            'type' => 'text',
            'unit' => 'kg',
        ])->assertUnprocessable()->assertJsonValidationErrors('unit');

        $attribute = ShopAttribute::query()->create([
            'name' => 'Weight',
            'type' => ShopAttributeType::Number,
            'unit' => 'kg',
        ]);

        $this->patchJson("/api/product-attributes/{$attribute->id}", ['type' => 'boolean'])
            ->assertOk()
            ->assertJsonPath('data.unit', null);

        $this->assertDatabaseHas('shop_attributes', [
            'id' => $attribute->id,
            'type' => 'boolean',
            'unit' => null,
        ]);
    }

    public function test_type_cannot_change_after_attribute_is_used_by_an_item(): void
    {
        $this->authenticateProductAdmin();

        $attribute = ShopAttribute::query()->create([
            'name' => 'Material',
            'type' => ShopAttributeType::Text,
        ]);
        $item = ShopItem::query()->create([
            'name' => 'T-shirt',
            'url' => 't-shirt',
            'price' => 25,
        ]);
        $item->itemAttributes()->create([
            'attribute_id' => $attribute->id,
            'text_value' => 'Cotton',
        ]);

        $this->patchJson("/api/product-attributes/{$attribute->id}", ['type' => 'select'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('type');

        $this->assertSame(ShopAttributeType::Text, $attribute->refresh()->type);
    }

    public function test_options_can_only_be_managed_for_their_list_attribute(): void
    {
        $this->authenticateProductAdmin();

        $attribute = ShopAttribute::query()->create([
            'name' => 'Color',
            'type' => ShopAttributeType::Select,
        ]);
        $otherAttribute = ShopAttribute::query()->create([
            'name' => 'Size',
            'type' => ShopAttributeType::Multiselect,
        ]);
        $textAttribute = ShopAttribute::query()->create([
            'name' => 'Material',
            'type' => ShopAttributeType::Text,
        ]);

        $blueId = $this->postJson("/api/product-attributes/{$attribute->id}/options", [
            'value' => 'Blue',
            'sort_order' => 2,
        ])->assertCreated()->json('data.id');
        $redId = $this->postJson("/api/product-attributes/{$attribute->id}/options", [
            'value' => 'Red',
        ])->assertCreated()->json('data.id');

        $this->patchJson("/api/product-attributes/{$attribute->id}/options/{$blueId}", [
            'sort_order' => -1,
        ])->assertOk()
            ->assertJsonPath('data.value', 'Blue')
            ->assertJsonPath('data.sort_order', -1);

        $this->getJson('/api/product-attributes')
            ->assertOk()
            ->assertJsonPath('data.0.options.0.id', $blueId)
            ->assertJsonPath('data.0.options.1.id', $redId);

        $this->patchJson("/api/product-attributes/{$otherAttribute->id}/options/{$blueId}", [
            'value' => 'Green',
        ])->assertNotFound();

        $this->postJson("/api/product-attributes/{$textAttribute->id}/options", [
            'value' => 'Cotton',
        ])->assertUnprocessable()->assertJsonValidationErrors('attribute');

        $this->deleteJson("/api/product-attributes/{$attribute->id}/options/{$redId}")
            ->assertNoContent();
        $this->assertDatabaseMissing('shop_attribute_options', ['id' => $redId]);

        $this->patchJson("/api/product-attributes/{$attribute->id}", ['type' => 'text'])
            ->assertOk()
            ->assertJsonPath('data.options', []);
        $this->assertDatabaseMissing('shop_attribute_options', ['id' => $blueId]);
    }

    public function test_deleting_an_attribute_cascades_to_options_and_item_values(): void
    {
        $this->authenticateProductAdmin();

        $attribute = ShopAttribute::query()->create([
            'name' => 'Color',
            'type' => ShopAttributeType::Select,
        ]);
        $option = $attribute->options()->create(['value' => 'Black']);
        $item = ShopItem::query()->create([
            'name' => 'T-shirt',
            'url' => 't-shirt',
            'price' => 25,
        ]);
        $itemAttribute = $item->itemAttributes()->create(['attribute_id' => $attribute->id]);
        $itemAttribute->options()->attach($option);

        $this->deleteJson("/api/product-attributes/{$attribute->id}")->assertNoContent();

        $this->assertDatabaseMissing('shop_attribute_options', ['id' => $option->id]);
        $this->assertDatabaseMissing('shop_item_attributes', ['id' => $itemAttribute->id]);
        $this->assertDatabaseCount('shop_item_attribute_options', 0);
    }

    private function authenticateProductAdmin(): User
    {
        $admin = User::factory()->create(['is_active' => true]);
        $module = Module::query()->create([
            'code' => 'products',
            'show_in_menu' => true,
            'is_required' => false,
        ]);
        $admin->modules()->attach($module);
        $this->actingAs($admin, 'sanctum');

        return $admin;
    }
}
