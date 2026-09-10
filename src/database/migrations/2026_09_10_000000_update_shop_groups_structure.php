<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shop_groups', function (Blueprint $table) {
            $table->renameColumn('url', 'slug');
        });

        Schema::table('shop_groups', function (Blueprint $table) {
            $table->unique('slug');
            $table->foreignId('parent_id')->nullable()->constrained('shop_groups')->nullOnDelete();
            $table->integer('sorting')->default(0);
            $table->index(['parent_id', 'sorting']);
        });
    }

    public function down(): void
    {
        Schema::table('shop_groups', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropIndex(['parent_id', 'sorting']);
            $table->dropUnique(['slug']);
            $table->dropColumn(['parent_id', 'sorting']);
        });

        Schema::table('shop_groups', function (Blueprint $table) {
            $table->renameColumn('slug', 'url');
        });
    }
};
