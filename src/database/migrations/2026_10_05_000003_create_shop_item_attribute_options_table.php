<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shop_item_attribute_options', function (Blueprint $table): void {
            $table->foreignId('item_attribute_id')
                ->constrained('shop_item_attributes')
                ->cascadeOnDelete();
            $table->foreignId('option_id')
                ->constrained('shop_attribute_options')
                ->cascadeOnDelete();

            $table->primary(['item_attribute_id', 'option_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shop_item_attribute_options');
    }
};
