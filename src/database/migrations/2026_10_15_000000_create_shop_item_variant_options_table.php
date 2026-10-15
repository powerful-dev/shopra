<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shop_item_variant_options', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('shop_item_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('shop_attribute_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            $table->string('name')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['shop_item_id', 'shop_attribute_id']);
            $table->unique(['shop_item_id', 'name']);
            $table->index(['shop_item_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shop_item_variant_options');
    }
};
