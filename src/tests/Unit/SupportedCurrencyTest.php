<?php

namespace Tests\Unit;

use App\Enums\SupportedCurrency;
use PHPUnit\Framework\TestCase;

class SupportedCurrencyTest extends TestCase
{
    public function test_it_exposes_supported_currency_codes_and_symbols(): void
    {
        $this->assertSame([
            ['code' => 'UAH', 'symbol' => '₴'],
            ['code' => 'EUR', 'symbol' => '€'],
            ['code' => 'USD', 'symbol' => '$'],
            ['code' => 'MDL', 'symbol' => 'L'],
            ['code' => 'GEL', 'symbol' => '₾'],
            ['code' => 'PLN', 'symbol' => 'zł'],
            ['code' => 'RON', 'symbol' => 'lei'],
            ['code' => 'CZK', 'symbol' => 'Kč'],
            ['code' => 'HUF', 'symbol' => 'Ft'],
            ['code' => 'GBP', 'symbol' => '£'],
        ], SupportedCurrency::options());
    }
}
