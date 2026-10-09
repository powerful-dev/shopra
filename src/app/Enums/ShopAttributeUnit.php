<?php

namespace App\Enums;

use Illuminate\Support\Facades\Lang;

enum ShopAttributeUnit: string
{
    case Piece = 'pcs';
    case Kilogram = 'kg';
    case Gram = 'g';
    case Liter = 'l';
    case Milliliter = 'ml';
    case Meter = 'm';
    case Centimeter = 'cm';
    case SquareMeter = 'm²';
    case Package = 'pkg';
    case Set = 'set';

    public function localizedName(?string $locale = null): string
    {
        return Lang::get('shop_attribute_units.'.$this->translationKey().'.name', locale: $locale);
    }

    public function localizedShortName(?string $locale = null): string
    {
        return Lang::get('shop_attribute_units.'.$this->translationKey().'.short_name', locale: $locale);
    }

    /** @return list<array{value: string, name: string, short_name: string}> */
    public static function options(?string $locale = null): array
    {
        return array_map(
            fn (self $unit): array => [
                'value' => $unit->value,
                'name' => $unit->localizedName($locale),
                'short_name' => $unit->localizedShortName($locale),
            ],
            self::cases(),
        );
    }

    private function translationKey(): string
    {
        return match ($this) {
            self::Piece => 'piece',
            self::Kilogram => 'kilogram',
            self::Gram => 'gram',
            self::Liter => 'liter',
            self::Milliliter => 'milliliter',
            self::Meter => 'meter',
            self::Centimeter => 'centimeter',
            self::SquareMeter => 'square_meter',
            self::Package => 'package',
            self::Set => 'set',
        };
    }
}
