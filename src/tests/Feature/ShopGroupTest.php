<?php

namespace Tests\Feature;

use App\Models\ShopGroup;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class ShopGroupTest extends TestCase
{
    use RefreshDatabase;

    public function test_groups_support_hierarchy_sorting_and_parent_deletion(): void
    {
        $parent = ShopGroup::query()->create(['name' => 'Parent', 'slug' => 'parent']);
        $child = $parent->children()->create(['name' => 'Child', 'slug' => 'child', 'sorting' => '5']);

        $this->assertTrue($child->parent->is($parent));
        $this->assertSame(5, $child->fresh()->sorting);
        $this->assertSame(0, $parent->fresh()->sorting);

        $parent->delete();
        $this->assertSame($parent->id, $child->fresh()->parent_id);
        $this->assertNotNull($child->fresh());

        $parent->forceDelete();
        $this->assertNull($child->fresh()->parent_id);
    }

    public function test_slug_is_unique_including_soft_deleted_groups(): void
    {
        ShopGroup::query()->create(['name' => 'First', 'slug' => 'same'])->delete();

        $this->expectException(QueryException::class);

        ShopGroup::query()->create(['name' => 'Second', 'slug' => 'same']);
    }

    public function test_parent_must_reference_an_existing_group(): void
    {
        $this->expectException(QueryException::class);

        ShopGroup::query()->create(['name' => 'Child', 'slug' => 'child', 'parent_id' => 999]);
    }

    public function test_migration_preserves_existing_data_and_can_be_reversed(): void
    {
        $migration = require database_path('migrations/2026_09_10_000000_update_shop_groups_structure.php');
        $migration->down();

        $timestamp = '2026-09-01 12:00:00';
        $id = DB::table('shop_groups')->insertGetId([
            'name' => 'Existing group',
            'url' => 'existing-group',
            'created_at' => $timestamp,
            'updated_at' => $timestamp,
            'deleted_at' => $timestamp,
        ]);

        $migration->up();

        $this->assertFalse(Schema::hasColumn('shop_groups', 'url'));
        $this->assertDatabaseHas('shop_groups', [
            'id' => $id,
            'slug' => 'existing-group',
            'parent_id' => null,
            'sorting' => 0,
            'created_at' => $timestamp,
            'updated_at' => $timestamp,
            'deleted_at' => $timestamp,
        ]);

        $migration->down();

        $this->assertDatabaseHas('shop_groups', ['id' => $id, 'url' => 'existing-group']);
        $this->assertFalse(Schema::hasColumn('shop_groups', 'slug'));
        $this->assertFalse(Schema::hasColumn('shop_groups', 'parent_id'));
        $this->assertFalse(Schema::hasColumn('shop_groups', 'sorting'));

        $migration->up();
    }
}
