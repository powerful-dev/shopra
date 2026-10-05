<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shop_attributes', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('type');
            $table->string('unit')->nullable();
            $table->boolean('is_visible')->default(true);
            $table->boolean('is_filterable')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shop_attributes');
    }
};
