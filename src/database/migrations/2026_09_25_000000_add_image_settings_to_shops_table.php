<?php

use App\Enums\ImageFit;
use App\Enums\ImageFormat;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shops', function (Blueprint $table): void {
            $table->unsignedInteger('group_small_image_max_width')->nullable();
            $table->unsignedInteger('group_small_image_max_height')->nullable();
            $table->string('group_small_image_fit')->default(ImageFit::Contain->value);
            $table->unsignedInteger('group_large_image_max_width')->nullable();
            $table->unsignedInteger('group_large_image_max_height')->nullable();
            $table->string('group_large_image_fit')->default(ImageFit::Contain->value);
            $table->string('group_image_format')->default(ImageFormat::Webp->value);

            $table->unsignedInteger('product_small_image_max_width')->nullable();
            $table->unsignedInteger('product_small_image_max_height')->nullable();
            $table->string('product_small_image_fit')->default(ImageFit::Contain->value);
            $table->unsignedInteger('product_large_image_max_width')->nullable();
            $table->unsignedInteger('product_large_image_max_height')->nullable();
            $table->string('product_large_image_fit')->default(ImageFit::Contain->value);
            $table->string('product_image_format')->default(ImageFormat::Webp->value);
        });
    }

    public function down(): void
    {
        Schema::table('shops', function (Blueprint $table): void {
            $table->dropColumn([
                'group_small_image_max_width',
                'group_small_image_max_height',
                'group_small_image_fit',
                'group_large_image_max_width',
                'group_large_image_max_height',
                'group_large_image_fit',
                'group_image_format',
                'product_small_image_max_width',
                'product_small_image_max_height',
                'product_small_image_fit',
                'product_large_image_max_width',
                'product_large_image_max_height',
                'product_large_image_fit',
                'product_image_format',
            ]);
        });
    }
};
