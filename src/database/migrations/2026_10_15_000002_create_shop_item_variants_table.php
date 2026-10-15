<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shop_item_variants', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('shop_item_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('sku')->nullable();
            $table->decimal('price', 12, 2)->nullable();
            $table->unsignedInteger('quantity')->default(0);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['shop_item_id', 'sku']);
            $table->index(['shop_item_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shop_item_variants');
    }
};
