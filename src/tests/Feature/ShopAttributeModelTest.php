<?php

namespace Tests\Feature;

use App\Enums\ShopAttributeType;
use App\Models\ShopAttribute;
use App\Models\ShopItem;
use App\Models\ShopItemAttribute;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShopAttributeModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_attribute_values_and_options_are_related_to_an_item(): void
    {
        $item = ShopItem::query()->create([
            'name' => 'T-shirt',
            'url' => 't-shirt',
            'price' => 25,
        ]);
        $attribute = ShopAttribute::query()->create([
            'name' => 'Color',
            'type' => ShopAttributeType::Multiselect,
        ]);
        $red = $attribute->options()->create(['value' => 'Red']);
        $blue = $attribute->options()->create(['value' => 'Blue', 'sort_order' => 1]);
        $itemAttribute = $item->itemAttributes()->create([
            'attribute_id' => $attribute->getKey(),
        ]);

        $itemAttribute->options()->attach([$red->getKey(), $blue->getKey()]);
        $attribute->refresh();

        $this->assertSame(ShopAttributeType::Multiselect, $attribute->type);
        $this->assertTrue($attribute->is_visible);
        $this->assertFalse($attribute->is_filterable);
        $this->assertSame(0, $attribute->sort_order);
        $this->assertTrue($item->attributes()->whereKey($attribute->getKey())->exists());
        $this->assertTrue($attribute->items()->whereKey($item->getKey())->exists());
        $this->assertTrue($red->itemAttributes()->whereKey($itemAttribute->getKey())->exists());
        $this->assertEqualsCanonicalizing(
            [$red->getKey(), $blue->getKey()],
            $itemAttribute->options()->pluck('shop_attribute_options.id')->all(),
        );
    }

    public function test_an_attribute_can_only_be_assigned_to_an_item_once(): void
    {
        $item = ShopItem::query()->create([
            'name' => 'T-shirt',
            'url' => 't-shirt',
            'price' => 25,
        ]);
        $attribute = ShopAttribute::query()->create([
            'name' => 'Material',
            'type' => ShopAttributeType::Text,
        ]);

        ShopItemAttribute::query()->create([
            'shop_item_id' => $item->getKey(),
            'attribute_id' => $attribute->getKey(),
            'text_value' => 'Cotton',
        ]);

        $this->expectException(QueryException::class);

        ShopItemAttribute::query()->create([
            'shop_item_id' => $item->getKey(),
            'attribute_id' => $attribute->getKey(),
            'text_value' => 'Linen',
        ]);
    }

    public function test_database_prevents_deleting_an_attribute_used_by_an_item(): void
    {
        $item = ShopItem::query()->create([
            'name' => 'T-shirt',
            'url' => 't-shirt',
            'price' => 25,
        ]);
        $attribute = ShopAttribute::query()->create([
            'name' => 'Size',
            'type' => ShopAttributeType::Select,
        ]);
        $option = $attribute->options()->create(['value' => 'M']);
        $itemAttribute = $item->itemAttributes()->create([
            'attribute_id' => $attribute->getKey(),
        ]);
        $itemAttribute->options()->attach($option);

        try {
            $attribute->delete();
            $this->fail('Deleting an attribute used by an item should violate its foreign key.');
        } catch (QueryException) {
            // The database is the final safeguard against cascading product data.
        }

        $this->assertDatabaseHas('shop_attributes', ['id' => $attribute->getKey()]);
        $this->assertDatabaseHas('shop_attribute_options', ['id' => $option->getKey()]);
        $this->assertDatabaseHas('shop_item_attributes', ['id' => $itemAttribute->getKey()]);
        $this->assertDatabaseHas('shop_item_attribute_options', [
            'item_attribute_id' => $itemAttribute->getKey(),
            'option_id' => $option->getKey(),
        ]);
    }
}
