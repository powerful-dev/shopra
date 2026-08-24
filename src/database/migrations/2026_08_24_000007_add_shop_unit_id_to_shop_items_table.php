<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shop_items', function (Blueprint $table) {
            $table->foreignId('shop_unit_id')
                ->nullable()
                ->constrained('shop_units')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('shop_items', function (Blueprint $table) {
            $table->dropConstrainedForeignId('shop_unit_id');
        });
    }
};
