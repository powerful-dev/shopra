<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shop_item_variant_selections', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('shop_item_variant_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('shop_item_variant_value_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->timestamps();

            $table->unique(
                ['shop_item_variant_id', 'shop_item_variant_value_id'],
                'shop_item_variant_selections_unique',
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shop_item_variant_selections');
    }
};
