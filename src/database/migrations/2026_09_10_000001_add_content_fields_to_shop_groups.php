<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shop_groups', function (Blueprint $table) {
            $table->text('description')->nullable();
            $table->longText('text')->nullable();
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('shop_groups', function (Blueprint $table) {
            $table->dropColumn(['description', 'text', 'seo_title', 'seo_description']);
        });
    }
};
