<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shop_item_attributes', function (Blueprint $table): void {
            $table->integer('sort_order')->default(0);
            $table->index(['shop_item_id', 'sort_order']);
        });

        $sortOrders = [];

        DB::table('shop_item_attributes')
            ->select(['id', 'shop_item_id'])
            ->orderBy('shop_item_id')
            ->orderBy('id')
            ->each(function (object $itemAttribute) use (&$sortOrders): void {
                $sortOrder = $sortOrders[$itemAttribute->shop_item_id] ?? 0;

                DB::table('shop_item_attributes')
                    ->where('id', $itemAttribute->id)
                    ->update(['sort_order' => $sortOrder]);

                $sortOrders[$itemAttribute->shop_item_id] = $sortOrder + 1;
            });
    }

    public function down(): void
    {
        Schema::table('shop_item_attributes', function (Blueprint $table): void {
            $table->dropIndex(['shop_item_id', 'sort_order']);
            $table->dropColumn('sort_order');
        });
    }
};
