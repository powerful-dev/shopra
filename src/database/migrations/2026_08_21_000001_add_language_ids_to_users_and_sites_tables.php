<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('admin_language_id')
                ->nullable()
                ->constrained('languages')
                ->restrictOnDelete();
        });

        Schema::table('sites', function (Blueprint $table) {
            $table->foreignId('site_language_id')
                ->nullable()
                ->constrained('languages')
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('sites', function (Blueprint $table) {
            $table->dropConstrainedForeignId('site_language_id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('admin_language_id');
        });
    }
};
