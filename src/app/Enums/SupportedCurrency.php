<?php

namespace App\Enums;

enum SupportedCurrency: string
{
    case Uah = 'UAH';
    case Eur = 'EUR';
    case Usd = 'USD';
    case Mdl = 'MDL';
    case Gel = 'GEL';
    case Pln = 'PLN';
    case Ron = 'RON';
    case Czk = 'CZK';
    case Huf = 'HUF';
    case Gbp = 'GBP';

    public function code(): string
    {
        return $this->value;
    }

    public function symbol(): string
    {
        return match ($this) {
            self::Uah => '₴',
            self::Eur => '€',
            self::Usd => '$',
            self::Mdl => 'L',
            self::Gel => '₾',
            self::Pln => 'zł',
            self::Ron => 'lei',
            self::Czk => 'Kč',
            self::Huf => 'Ft',
            self::Gbp => '£',
        };
    }

    /**
     * @return list<array{code: string, symbol: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $currency): array => [
                'code' => $currency->code(),
                'symbol' => $currency->symbol(),
            ],
            self::cases(),
        );
    }
}
