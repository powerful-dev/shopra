<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shop_items', function (Blueprint $table): void {
            $table->foreignId('shop_group_id')
                ->nullable()
                ->constrained('shop_groups')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('shop_items', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('shop_group_id');
        });
    }
};
