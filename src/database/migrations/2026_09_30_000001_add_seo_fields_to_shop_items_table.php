<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shop_items', function (Blueprint $table): void {
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('shop_items', function (Blueprint $table): void {
            $table->dropColumn(['seo_title', 'seo_description']);
        });
    }
};
