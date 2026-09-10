<?php

namespace App\Services;

use App\Models\ShopGroup;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ShopGroupService
{
    public function delete(ShopGroup $group): void
    {
        DB::transaction(function () use ($group): void {
            $groups = ShopGroup::query()->orderBy('id')->lockForUpdate()->get()->keyBy('id');
            $deleting = $groups->get($group->id);

            if (! $deleting) {
                return;
            }

            $branchIds = [];
            $pendingIds = [$deleting->id];

            while ($pendingIds !== []) {
                $categoryId = array_shift($pendingIds);

                if (isset($branchIds[$categoryId])) {
                    continue;
                }

                $branchIds[$categoryId] = true;

                foreach ($groups->where('parent_id', $categoryId) as $child) {
                    $pendingIds[] = $child->id;
                }
            }

            $ids = array_keys($branchIds);

            DB::table('shop_group_shop_item')->whereIn('shop_group_id', $ids)->delete();
            ShopGroup::query()->whereIn('id', $ids)->delete();

            $groups->where('parent_id', $deleting->parent_id)
                ->whereNotIn('id', $ids)
                ->sortBy([['sorting', 'asc'], ['id', 'asc']])
                ->values()
                ->each(function (ShopGroup $sibling, int $sorting): void {
                    $sibling->fill(['sorting' => $sorting])->save();
                });
        });
    }

    public function move(ShopGroup $group, array $data): void
    {
        DB::transaction(function () use ($group, $data): void {
            // Serialize tree moves so concurrent requests cannot create a cycle.
            $groups = ShopGroup::query()->orderBy('id')->lockForUpdate()->get()->keyBy('id');
            $moving = $groups->get($group->id);
            $target = $groups->get($data['target_id']);
            if (! $moving || ($data['target_id'] !== null && ! $target) || (! $target && $data['position'] !== 'inside')) {
                throw ValidationException::withMessages(['target_id' => 'Категория назначения недоступна.']);
            }
            if ($target?->id === $moving->id) {
                throw ValidationException::withMessages(['target_id' => 'Нельзя перенести категорию в саму себя.']);
            }
            $parentId = $data['position'] === 'inside' ? $target?->id : $target->parent_id;
            $ancestorId = $parentId;
            $visited = [];
            while ($ancestorId !== null) {
                if ($ancestorId === $moving->id || isset($visited[$ancestorId])) {
                    throw ValidationException::withMessages(['target_id' => 'Нельзя перенести категорию в своего потомка.']);
                }
                $visited[$ancestorId] = true;
                $ancestorId = $groups->get($ancestorId)?->parent_id;
            }

            $oldParentId = $moving->parent_id;
            $siblings = $groups->filter(fn ($item) => $item->parent_id === $parentId && $item->id !== $moving->id)
                ->sortBy([['sorting', 'asc'], ['id', 'asc']])->values()->all();
            $index = count($siblings);
            if ($data['position'] !== 'inside') {
                $index = array_search($target->id, array_column($siblings, 'id'), true);
                if ($data['position'] === 'after') {
                    $index++;
                }
            }
            array_splice($siblings, $index, 0, [$moving]);
            foreach ($siblings as $sorting => $sibling) {
                $sibling->fill(['parent_id' => $parentId, 'sorting' => $sorting])->save();
            }
            if ($oldParentId !== $parentId) {
                $oldSiblings = $groups->filter(fn ($item) => $item->parent_id === $oldParentId && $item->id !== $moving->id)
                    ->sortBy([['sorting', 'asc'], ['id', 'asc']])->values();
                foreach ($oldSiblings as $sorting => $sibling) {
                    $sibling->fill(['sorting' => $sorting])->save();
                }
            }
        });
    }

    public function create(array $data): ShopGroup
    {
        try {
            $group = ShopGroup::query()->create($data);

            return $this->withBranchItemCounts(new Collection([$group]))->first();
        } catch (UniqueConstraintViolationException) {
            throw ValidationException::withMessages(['slug' => 'Этот URL уже занят. Измените URL категории.']);
        }
    }

    public function update(ShopGroup $group, array $data): ShopGroup
    {
        try {
            $updated = DB::transaction(function () use ($group, $data): ShopGroup {
                $groups = ShopGroup::query()->orderBy('id')->lockForUpdate()->get()->keyBy('id');
                $updating = $groups->get($group->id);
                $parentId = $data['parent_id'];
                $ancestorId = $parentId;
                $visited = [];

                while ($ancestorId !== null) {
                    if ($ancestorId === $updating->id || isset($visited[$ancestorId])) {
                        throw ValidationException::withMessages(['parent_id' => 'Нельзя выбрать дочернюю категорию в качестве родительской.']);
                    }

                    $visited[$ancestorId] = true;
                    $ancestorId = $groups->get($ancestorId)?->parent_id;
                }

                $oldParentId = $updating->parent_id;
                if ($oldParentId !== $parentId) {
                    $data['sorting'] = ($groups
                        ->where('parent_id', $parentId)
                        ->where('id', '!=', $updating->id)
                        ->max('sorting') ?? -1) + 1;
                }

                $updating->fill($data)->save();

                if ($oldParentId !== $parentId) {
                    $groups->where('parent_id', $oldParentId)
                        ->where('id', '!=', $updating->id)
                        ->sortBy([['sorting', 'asc'], ['id', 'asc']])
                        ->values()
                        ->each(function (ShopGroup $sibling, int $sorting): void {
                            $sibling->fill(['sorting' => $sorting])->save();
                        });
                }

                return $updating->refresh();
            });

            return $this->withBranchItemCounts(new Collection([$updated]))->first();
        } catch (UniqueConstraintViolationException) {
            throw ValidationException::withMessages(['slug' => 'Этот URL уже занят. Измените URL категории.']);
        }
    }

    public function uniqueSlug(string $value): string
    {
        $base = substr(Str::slug($value, '-', 'ru', []), 0, 255);
        $base = rtrim($base, '-') ?: 'category';
        $slug = $base;
        $suffix = 2;

        while (ShopGroup::withTrashed()->where('slug', $slug)->exists()) {
            $ending = '-'.$suffix++;
            $slug = rtrim(substr($base, 0, 255 - strlen($ending)), '-').$ending;
        }

        return $slug;
    }

    public function all(): Collection
    {
        return $this->withBranchItemCounts(ShopGroup::query()
            ->orderBy('sorting')
            ->orderBy('id')
            ->get());
    }

    public function search(string $search): Collection
    {
        $pattern = '%'.addcslashes($search, '\\%_').'%';
        $ids = ShopGroup::query()->whereLike('name', $pattern)->pluck('id')->all();
        if ($ids === []) {
            return new Collection;
        }

        $placeholders = implode(', ', array_fill(0, count($ids), '?'));
        $ancestors = DB::select(<<<SQL
            WITH RECURSIVE category_path (id, parent_id) AS (
                SELECT id, parent_id FROM shop_groups WHERE id IN ({$placeholders}) AND deleted_at IS NULL
                UNION
                SELECT parent.id, parent.parent_id
                FROM shop_groups AS parent
                JOIN category_path AS child ON child.parent_id = parent.id
                WHERE parent.deleted_at IS NULL
            )
            SELECT id FROM category_path
            SQL, $ids);

        return $this->withBranchItemCounts(ShopGroup::query()
            ->whereIn('id', array_column($ancestors, 'id'))
            ->withExists('children')
            ->orderBy('sorting')
            ->orderBy('id')
            ->get());
    }

    public function roots(): Collection
    {
        return $this->withBranchItemCounts(ShopGroup::query()
            ->whereNull('parent_id')
            ->withExists('children')
            ->orderBy('sorting')
            ->orderBy('id')
            ->get());
    }

    public function children(ShopGroup $group): Collection
    {
        return $this->withBranchItemCounts($group->children()
            ->withExists('children')
            ->orderBy('sorting')
            ->orderBy('id')
            ->get());
    }

    private function withBranchItemCounts(Collection $groups): Collection
    {
        if ($groups->isEmpty()) {
            return $groups;
        }

        $placeholders = implode(', ', array_fill(0, $groups->count(), '?'));

        // Traverse all requested branches in one query; UNION also terminates cycles.
        $counts = DB::select(<<<SQL
            WITH RECURSIVE category_branches (root_id, category_id) AS (
                SELECT id, id
                FROM shop_groups
                WHERE id IN ({$placeholders}) AND deleted_at IS NULL
                UNION
                SELECT branch.root_id, child.id
                FROM category_branches AS branch
                JOIN shop_groups AS child ON child.parent_id = branch.category_id
                WHERE child.deleted_at IS NULL
            )
            SELECT branch.root_id, COUNT(DISTINCT item.id) AS item_count
            FROM category_branches AS branch
            LEFT JOIN shop_group_shop_item AS pivot ON pivot.shop_group_id = branch.category_id
            LEFT JOIN shop_items AS item ON item.id = pivot.shop_item_id AND item.deleted_at IS NULL
            GROUP BY branch.root_id
            SQL, $groups->modelKeys());

        $countsById = collect($counts)->pluck('item_count', 'root_id');
        foreach ($groups as $group) {
            $group->setAttribute('branch_count', (int) $countsById->get($group->getKey(), 0));
        }

        return $groups;
    }
}
