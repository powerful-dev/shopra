<?php

namespace Tests\Feature;

use App\Enums\ShopAttributeType;
use App\Models\Module;
use App\Models\ShopAttribute;
use App\Models\ShopItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class ShopItemAttributeApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_all_attribute_types_can_be_loaded_and_synchronized(): void
    {
        $this->authenticateProductAdmin();
        $item = $this->createItem();
        $color = $this->createAttribute('Color', ShopAttributeType::Select, 1);
        $red = $color->options()->create(['value' => 'Red', 'sort_order' => 1]);
        $blue = $color->options()->create(['value' => 'Blue', 'sort_order' => 2]);
        $features = $this->createAttribute('Features', ShopAttributeType::Multiselect, 2);
        $waterproof = $features->options()->create(['value' => 'Waterproof']);
        $lightweight = $features->options()->create(['value' => 'Lightweight', 'sort_order' => 1]);
        $material = $this->createAttribute('Material', ShopAttributeType::Text, 3);
        $weight = $this->createAttribute('Weight', ShopAttributeType::Number, 4, 'kg');
        $available = $this->createAttribute('Available', ShopAttributeType::Boolean, 5);

        $payload = ['attributes' => [
            ['attribute_id' => $color->id, 'value' => $red->id, 'sort_order' => 0],
            ['attribute_id' => $features->id, 'value' => [$lightweight->id, $waterproof->id], 'sort_order' => 1],
            ['attribute_id' => $material->id, 'value' => 'Leather', 'sort_order' => 2],
            ['attribute_id' => $weight->id, 'value' => '1.25', 'sort_order' => 3],
            ['attribute_id' => $available->id, 'value' => true, 'sort_order' => 4],
        ]];

        $this->putJson("/api/products/{$item->id}/attributes", $payload)
            ->assertOk()
            ->assertJsonCount(5, 'data')
            ->assertJsonPath('data.0.attribute_id', $color->id)
            ->assertJsonPath('data.0.sort_order', 0)
            ->assertJsonPath('data.0.value', $red->id)
            ->assertJsonPath('data.0.attribute.options.0.value', 'Red')
            ->assertJsonPath('data.1.value', [$waterproof->id, $lightweight->id])
            ->assertJsonPath('data.2.value', 'Leather')
            ->assertJsonPath('data.3.value', '1.250000')
            ->assertJsonPath('data.4.value', true);

        $this->getJson("/api/products/{$item->id}/attributes")
            ->assertOk()
            ->assertJsonPath('data.0.value', $red->id)
            ->assertJsonPath('data.1.value', [$waterproof->id, $lightweight->id]);

        $this->putJson("/api/products/{$item->id}/attributes", ['attributes' => [
            ['attribute_id' => $color->id, 'value' => $blue->id, 'sort_order' => 1],
            ['attribute_id' => $material->id, 'value' => 'Cotton', 'sort_order' => 0],
        ]])->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.attribute_id', $material->id)
            ->assertJsonPath('data.0.sort_order', 0)
            ->assertJsonPath('data.1.attribute_id', $color->id)
            ->assertJsonPath('data.1.sort_order', 1);

        $this->assertDatabaseCount('shop_item_attributes', 2);
        $this->assertDatabaseHas('shop_item_attributes', [
            'shop_item_id' => $item->id,
            'attribute_id' => $material->id,
            'text_value' => 'Cotton',
            'number_value' => null,
            'boolean_value' => null,
        ]);
        $this->assertDatabaseHas('shop_item_attribute_options', ['option_id' => $blue->id]);
        $this->assertDatabaseMissing('shop_item_attribute_options', ['option_id' => $red->id]);
        $this->assertDatabaseMissing('shop_item_attribute_options', ['option_id' => $waterproof->id]);
    }

    public function test_synchronizing_an_empty_list_removes_all_item_attributes(): void
    {
        $this->authenticateProductAdmin();
        $item = $this->createItem();
        $attribute = $this->createAttribute('Material', ShopAttributeType::Text);
        $item->itemAttributes()->create([
            'attribute_id' => $attribute->id,
            'text_value' => 'Leather',
        ]);

        $this->putJson("/api/products/{$item->id}/attributes", ['attributes' => []])
            ->assertOk()
            ->assertExactJson(['data' => []]);

        $this->assertDatabaseCount('shop_item_attributes', 0);
    }

    public function test_values_and_options_are_validated_for_the_attribute_type(): void
    {
        $this->authenticateProductAdmin();
        $item = $this->createItem();
        $color = $this->createAttribute('Color', ShopAttributeType::Select);
        $red = $color->options()->create(['value' => 'Red']);
        $size = $this->createAttribute('Size', ShopAttributeType::Select);
        $large = $size->options()->create(['value' => 'Large']);
        $features = $this->createAttribute('Features', ShopAttributeType::Multiselect);
        $waterproof = $features->options()->create(['value' => 'Waterproof']);
        $text = $this->createAttribute('Material', ShopAttributeType::Text);
        $number = $this->createAttribute('Weight', ShopAttributeType::Number);
        $boolean = $this->createAttribute('Available', ShopAttributeType::Boolean);

        $this->putJson("/api/products/{$item->id}/attributes", ['attributes' => [
            ['attribute_id' => $color->id, 'value' => $large->id, 'sort_order' => 0],
            ['attribute_id' => $features->id, 'value' => [$waterproof->id, $red->id], 'sort_order' => 1],
            ['attribute_id' => $text->id, 'value' => ['not text'], 'sort_order' => 2],
            ['attribute_id' => $number->id, 'value' => 'heavy', 'sort_order' => 3],
            ['attribute_id' => $boolean->id, 'value' => 1, 'sort_order' => 4],
        ]])->assertUnprocessable()->assertJsonValidationErrors([
            'attributes.0.value',
            'attributes.1.value',
            'attributes.2.value',
            'attributes.3.value',
            'attributes.4.value',
        ]);

        $this->putJson("/api/products/{$item->id}/attributes", ['attributes' => [
            ['attribute_id' => $color->id, 'value' => $red->id, 'sort_order' => 0],
            ['attribute_id' => $color->id, 'value' => $red->id, 'sort_order' => 1],
        ]])->assertUnprocessable()->assertJsonValidationErrors('attributes.1.attribute_id');

        $this->assertDatabaseCount('shop_item_attributes', 0);
    }

    public function test_item_attribute_endpoints_require_product_access(): void
    {
        $item = $this->createItem();

        $this->getJson("/api/products/{$item->id}/attributes")->assertUnauthorized();
        $this->putJson("/api/products/{$item->id}/attributes", ['attributes' => []])->assertUnauthorized();

        $this->actingAs(User::factory()->create(['is_active' => true]), 'sanctum')
            ->getJson("/api/products/{$item->id}/attributes")
            ->assertForbidden();
    }

    public function test_sort_order_migration_backfills_each_product_without_losing_values(): void
    {
        $firstItem = $this->createItem();
        $secondItem = ShopItem::query()->create([
            'name' => 'Second backpack',
            'url' => 'second-backpack',
            'price' => 120,
        ]);
        $firstAttribute = $this->createAttribute('Material', ShopAttributeType::Text);
        $secondAttribute = $this->createAttribute('Weight', ShopAttributeType::Number);
        $firstValue = $firstItem->itemAttributes()->create([
            'attribute_id' => $firstAttribute->id,
            'text_value' => 'Leather',
            'sort_order' => 8,
        ]);
        $secondValue = $firstItem->itemAttributes()->create([
            'attribute_id' => $secondAttribute->id,
            'number_value' => 2,
            'sort_order' => 3,
        ]);
        $otherItemValue = $secondItem->itemAttributes()->create([
            'attribute_id' => $firstAttribute->id,
            'text_value' => 'Canvas',
            'sort_order' => 5,
        ]);

        $migration = require database_path('migrations/2026_10_06_000000_add_sort_order_to_shop_item_attributes_table.php');
        $migration->down();
        $migration->up();

        $this->assertTrue(Schema::hasColumn('shop_item_attributes', 'sort_order'));
        $this->assertDatabaseHas('shop_item_attributes', [
            'id' => $firstValue->id,
            'text_value' => 'Leather',
            'sort_order' => 0,
        ]);
        $this->assertDatabaseHas('shop_item_attributes', [
            'id' => $secondValue->id,
            'number_value' => 2,
            'sort_order' => 1,
        ]);
        $this->assertDatabaseHas('shop_item_attributes', [
            'id' => $otherItemValue->id,
            'text_value' => 'Canvas',
            'sort_order' => 0,
        ]);
        $this->assertSame(3, DB::table('shop_item_attributes')->count());
    }

    private function authenticateProductAdmin(): void
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

    private function createItem(): ShopItem
    {
        return ShopItem::query()->create([
            'name' => 'Backpack',
            'url' => 'backpack',
            'price' => 100,
        ]);
    }

    private function createAttribute(
        string $name,
        ShopAttributeType $type,
        int $sortOrder = 0,
        ?string $unit = null,
    ): ShopAttribute {
        return ShopAttribute::query()->create([
            'name' => $name,
            'type' => $type,
            'unit' => $unit,
            'sort_order' => $sortOrder,
        ]);
    }
}
