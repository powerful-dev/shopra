<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shop_items', function (Blueprint $table): void {
            $table->unsignedInteger('quantity')->nullable()->default(0)->change();
        });
    }

    public function down(): void
    {
        DB::table('shop_items')->whereNull('quantity')->update(['quantity' => 0]);

        Schema::table('shop_items', function (Blueprint $table): void {
            $table->unsignedInteger('quantity')->nullable(false)->default(0)->change();
        });
    }
};
