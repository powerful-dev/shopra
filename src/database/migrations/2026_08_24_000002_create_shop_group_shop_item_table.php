<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shop_group_shop_item', function (Blueprint $table) {
            $table->foreignId('shop_item_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('shop_group_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->primary(['shop_item_id', 'shop_group_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shop_group_shop_item');
    }
};
