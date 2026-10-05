<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shop_item_attributes', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('shop_item_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('attribute_id')
                ->constrained('shop_attributes')
                ->cascadeOnDelete();
            $table->text('text_value')->nullable();
            $table->decimal('number_value', 20, 6)->nullable();
            $table->boolean('boolean_value')->nullable();
            $table->timestamps();

            $table->unique(['shop_item_id', 'attribute_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shop_item_attributes');
    }
};
