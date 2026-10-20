<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->replaceForeignKey('shop_item_attributes', 'attribute_id', 'shop_attributes', 'restrict');
        $this->replaceForeignKey('shop_item_attribute_options', 'option_id', 'shop_attribute_options', 'restrict');
        $this->replaceForeignKey('shop_item_variant_options', 'shop_attribute_id', 'shop_attributes', 'restrict');
        $this->replaceForeignKey('shop_item_variant_values', 'shop_attribute_option_id', 'shop_attribute_options', 'restrict');
    }

    public function down(): void
    {
        $this->replaceForeignKey('shop_item_attributes', 'attribute_id', 'shop_attributes', 'cascade');
        $this->replaceForeignKey('shop_item_attribute_options', 'option_id', 'shop_attribute_options', 'cascade');
        $this->replaceForeignKey('shop_item_variant_options', 'shop_attribute_id', 'shop_attributes', 'null');
        $this->replaceForeignKey('shop_item_variant_values', 'shop_attribute_option_id', 'shop_attribute_options', 'null');
    }

    private function replaceForeignKey(string $tableName, string $column, string $foreignTable, string $onDelete): void
    {
        Schema::table($tableName, function (Blueprint $table) use ($column, $foreignTable, $onDelete): void {
            $table->dropForeign([$column]);

            $foreign = $table->foreign($column)->references('id')->on($foreignTable);

            match ($onDelete) {
                'cascade' => $foreign->cascadeOnDelete(),
                'null' => $foreign->nullOnDelete(),
                default => $foreign->restrictOnDelete(),
            };
        });
    }
};
