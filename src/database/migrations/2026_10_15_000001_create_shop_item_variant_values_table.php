<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shop_item_variant_values', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('shop_item_variant_option_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('shop_attribute_option_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            $table->string('value')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['shop_item_variant_option_id', 'shop_attribute_option_id']);
            $table->unique(['shop_item_variant_option_id', 'value']);
            $table->index(['shop_item_variant_option_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shop_item_variant_values');
    }
};
