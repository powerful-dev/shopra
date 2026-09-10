<?php

namespace Tests\Feature;

use App\Models\Module;
use App\Models\ShopGroup;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShopGroupMoveTest extends TestCase
{
    use RefreshDatabase;

    public function test_moves_reorder_siblings_and_allow_nesting_and_return_to_root(): void
    {
        $this->signIn();
        $a = ShopGroup::create(['name' => 'A', 'slug' => 'a', 'sorting' => 0]);
        $b = ShopGroup::create(['name' => 'B', 'slug' => 'b', 'sorting' => 1]);
        $c = ShopGroup::create(['name' => 'C', 'slug' => 'c', 'sorting' => 2]);
        $this->move($c, $a, 'before');
        $this->assertSame([$c->id, $a->id, $b->id], $this->order(null));
        $this->move($c, $b, 'after');
        $this->assertSame([$a->id, $b->id, $c->id], $this->order(null));
        $this->move($b, $a, 'inside');
        $this->move($c, $a, 'inside');
        $this->assertSame([$b->id, $c->id], $this->order($a->id));
        $this->move($c, $b, 'before');
        $this->assertSame([$c->id, $b->id], $this->order($a->id));
        $this->move($b, $a, 'before');
        $this->assertNull($b->fresh()->parent_id);
        $this->assertSame([$b->id, $a->id], $this->order(null));
        $this->move($c, null, 'inside');
        $this->assertSame([$b->id, $a->id, $c->id], $this->order(null));
        $this->assertSame([0, 1, 2], ShopGroup::orderBy('sorting')->pluck('sorting')->all());
    }

    public function test_cycles_and_invalid_targets_are_rejected_without_changes(): void
    {
        $this->signIn();
        $root = ShopGroup::create(['name' => 'Root', 'slug' => 'root']);
        $child = $root->children()->create(['name' => 'Child', 'slug' => 'child']);
        $leaf = $child->children()->create(['name' => 'Leaf', 'slug' => 'leaf']);
        foreach ([[$root->id, 'inside'], [$child->id, 'inside'], [$leaf->id, 'inside'], [$leaf->id, 'before'], [$leaf->id, 'after'], [null, 'before'], [99999, 'inside']] as [$target, $position]) {
            $this->patchJson("/api/product-categories/{$root->id}/move", ['target_id' => $target, 'position' => $position])
                ->assertUnprocessable()->assertJsonValidationErrors('target_id');
        }
        $this->assertNull($root->fresh()->parent_id);
        $this->assertSame($root->id, $child->fresh()->parent_id);
        $leaf->delete();
        $this->patchJson("/api/product-categories/{$root->id}/move", ['target_id' => $leaf->id, 'position' => 'inside'])
            ->assertUnprocessable();
    }

    public function test_moves_require_product_access(): void
    {
        $this->patchJson('/api/product-categories/1/move', [])->assertUnauthorized();
        $group = ShopGroup::create(['name' => 'A', 'slug' => 'a']);
        $this->actingAs(User::factory()->create(['is_active' => true]), 'sanctum')
            ->patchJson("/api/product-categories/{$group->id}/move", [])->assertForbidden();
    }

    private function signIn(): void
    {
        $admin = User::factory()->create(['is_active' => true]);
        $module = Module::create(['code' => 'products', 'show_in_menu' => true, 'is_required' => false]);
        $admin->modules()->attach($module);
        $this->actingAs($admin, 'sanctum');
    }

    private function move(ShopGroup $group, ?ShopGroup $target, string $position): void
    {
        $this->patchJson("/api/product-categories/{$group->id}/move", ['target_id' => $target?->id, 'position' => $position])->assertNoContent();
    }

    private function order(?int $parentId): array
    {
        return ShopGroup::where('parent_id', $parentId)->orderBy('sorting')->pluck('id')->all();
    }
}
