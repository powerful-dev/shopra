<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shop_item_variant_settings', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('shop_item_id')
                ->unique()
                ->constrained()
                ->cascadeOnDelete();
            $table->boolean('individual_prices_enabled')->default(false);
            $table->boolean('photos_enabled')->default(false);
            $table->foreignId('photo_option_id')
                ->nullable()
                ->constrained('shop_item_variant_options')
                ->nullOnDelete();
            $table->foreignId('default_photo_value_id')
                ->nullable()
                ->constrained('shop_item_variant_values')
                ->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shop_item_variant_settings');
    }
};
