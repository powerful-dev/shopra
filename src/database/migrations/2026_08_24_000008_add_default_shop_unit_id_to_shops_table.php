<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shops', function (Blueprint $table) {
            $table->foreignId('default_shop_unit_id')
                ->nullable()
                ->constrained('shop_units')
                ->nullOnDelete();

            $table->unsignedInteger('low_stock_threshold')
                ->default(5);
        });
    }

    public function down(): void
    {
        Schema::table('shops', function (Blueprint $table) {
            $table->dropConstrainedForeignId('default_shop_unit_id');
            $table->dropColumn('low_stock_threshold');
        });
    }
};
