<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shop_item_variant_photos', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('shop_item_variant_value_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('shop_item_media_id')
                ->constrained('shop_item_media')
                ->cascadeOnDelete();
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->unique(
                ['shop_item_variant_value_id', 'shop_item_media_id'],
                'shop_item_variant_photos_unique',
            );
            $table->index(['shop_item_variant_value_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shop_item_variant_photos');
    }
};
