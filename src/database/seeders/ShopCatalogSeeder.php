<?php

namespace Database\Seeders;

use App\Enums\ShopItemStatus;
use App\Models\ShopGroup;
use App\Models\ShopItem;
use App\Models\ShopUnit;
use Illuminate\Database\Seeder;

class ShopCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $pieceUnit = ShopUnit::query()
            ->where('code', 'piece')
            ->where('is_system', true)
            ->firstOrFail();

        $groups = collect([
            ['name' => 'Сумки', 'slug' => 'sumki'],
            ['name' => 'Рюкзаки', 'slug' => 'ryukzaki'],
            ['name' => 'Кошельки', 'slug' => 'koshelki'],
        ])->mapWithKeys(function (array $attributes): array {
            $group = ShopGroup::query()->updateOrCreate(
                ['slug' => $attributes['slug']],
                ['name' => $attributes['name']],
            );

            return [$attributes['slug'] => $group];
        });

        foreach ($this->items() as $index => $attributes) {
            $groupSlugs = $attributes['groups'];
            unset($attributes['groups']);
            $attributes['shop_unit_id'] = $pieceUnit->getKey();
            $attributes['status'] = match ($index % 5) {
                0 => ShopItemStatus::Draft,
                1 => ShopItemStatus::Archived,
                default => ShopItemStatus::Active,
            };

            $item = ShopItem::query()->updateOrCreate(
                ['url' => $attributes['url']],
                $attributes,
            );

            $item->groups()->sync(
                $groups->only($groupSlugs)->pluck('id')->all(),
            );
        }
    }

    /**
     * @return array<int, array{
     *     name: string,
     *     url: string,
     *     price: float,
     *     old_price: float,
     *     quantity: int,
     *     show_stock: bool,
     *     groups: array<int, string>
     * }>
     */
    private function items(): array
    {
        return [
            ['name' => 'Кожаная сумка Forest', 'sku' => 'BAG-001', 'url' => 'kozhanaya-sumka-forest', 'price' => 5490, 'old_price' => 6290, 'quantity' => 12, 'show_stock' => true, 'groups' => ['sumki']],
            ['name' => 'Сумка через плечо Alice', 'sku' => 'BAG-002', 'url' => 'sumka-cherez-plecho-alice', 'price' => 3850, 'old_price' => 4490, 'quantity' => 7, 'show_stock' => true, 'groups' => ['sumki']],
            ['name' => 'Деловая сумка Richmond', 'sku' => 'BAG-003', 'url' => 'delovaya-sumka-richmond', 'price' => 6790, 'old_price' => 7490, 'quantity' => 4, 'show_stock' => true, 'groups' => ['sumki']],
            ['name' => 'Сумка-тоут Olivia', 'sku' => 'BAG-004', 'url' => 'sumka-tout-olivia', 'price' => 4290, 'old_price' => 4890, 'quantity' => 15, 'show_stock' => true, 'groups' => ['sumki']],
            ['name' => 'Мини-сумка Chloe', 'sku' => 'BAG-005', 'url' => 'mini-sumka-chloe', 'price' => 2890, 'old_price' => 3390, 'quantity' => 9, 'show_stock' => true, 'groups' => ['sumki']],
            ['name' => 'Дорожная сумка Voyager', 'sku' => 'BAG-006', 'url' => 'dorozhnaya-sumka-voyager', 'price' => 7250, 'old_price' => 8190, 'quantity' => 3, 'show_stock' => true, 'groups' => ['sumki']],
            ['name' => 'Сумка-рюкзак Urban Flex', 'sku' => 'BAG-007', 'url' => 'sumka-ryukzak-urban-flex', 'price' => 4990, 'old_price' => 5690, 'quantity' => 8, 'show_stock' => true, 'groups' => ['sumki', 'ryukzaki']],
            ['name' => 'Сумка-шоппер Luna', 'sku' => 'BAG-008', 'url' => 'sumka-shopper-luna', 'price' => 3290, 'old_price' => 3790, 'quantity' => 17, 'show_stock' => true, 'groups' => ['sumki']],
            ['name' => 'Сумка через плечо Brooklyn', 'sku' => 'BAG-009', 'url' => 'sumka-cherez-plecho-brooklyn', 'price' => 4150, 'old_price' => 4690, 'quantity' => 11, 'show_stock' => true, 'groups' => ['sumki']],
            ['name' => 'Кожаная сумка Victoria', 'sku' => 'BAG-010', 'url' => 'kozhanaya-sumka-victoria', 'price' => 6490, 'old_price' => 7290, 'quantity' => 5, 'show_stock' => true, 'groups' => ['sumki']],
            ['name' => 'Сумка-хобо Madison', 'sku' => 'BAG-011', 'url' => 'sumka-hobo-madison', 'price' => 4590, 'old_price' => 5190, 'quantity' => 8, 'show_stock' => true, 'groups' => ['sumki']],
            ['name' => 'Мини-сумка Verona', 'sku' => 'BAG-012', 'url' => 'mini-sumka-verona', 'price' => 2690, 'old_price' => 3190, 'quantity' => 19, 'show_stock' => true, 'groups' => ['sumki']],
            ['name' => 'Сумка для ноутбука Boston', 'sku' => 'BAG-013', 'url' => 'sumka-dlya-noutbuka-boston', 'price' => 5790, 'old_price' => 6490, 'quantity' => 6, 'show_stock' => true, 'groups' => ['sumki']],
            ['name' => 'Плетеная сумка Riviera', 'sku' => 'BAG-014', 'url' => 'pletenaya-sumka-riviera', 'price' => 3590, 'old_price' => 4190, 'quantity' => 10, 'show_stock' => true, 'groups' => ['sumki']],
            ['name' => 'Сумка-кроссбоди Stella', 'sku' => 'BAG-015', 'url' => 'sumka-krossbodi-stella', 'price' => 3990, 'old_price' => 4590, 'quantity' => 13, 'show_stock' => true, 'groups' => ['sumki']],
            ['name' => 'Сумка Weekend Travel', 'sku' => 'BAG-016', 'url' => 'sumka-weekend-travel', 'price' => 6990, 'old_price' => 7890, 'quantity' => 4, 'show_stock' => true, 'groups' => ['sumki']],

            ['name' => 'Городской рюкзак Hunter', 'sku' => 'BPK-001', 'url' => 'gorodskoy-ryukzak-hunter', 'price' => 4690, 'old_price' => 5290, 'quantity' => 6, 'show_stock' => true, 'groups' => ['ryukzaki']],
            ['name' => 'Кожаный рюкзак Hanna', 'sku' => 'BPK-002', 'url' => 'kozhanyy-ryukzak-hanna', 'price' => 5890, 'old_price' => 6590, 'quantity' => 5, 'show_stock' => true, 'groups' => ['ryukzaki']],
            ['name' => 'Рюкзак для ноутбука Nord', 'sku' => 'BPK-003', 'url' => 'ryukzak-dlya-noutbuka-nord', 'price' => 5190, 'old_price' => 5990, 'quantity' => 11, 'show_stock' => true, 'groups' => ['ryukzaki']],
            ['name' => 'Компактный рюкзак City Mini', 'sku' => 'BPK-004', 'url' => 'kompaktnyy-ryukzak-city-mini', 'price' => 3490, 'old_price' => 3990, 'quantity' => 14, 'show_stock' => true, 'groups' => ['ryukzaki']],
            ['name' => 'Рюкзак-трансформер Journey', 'sku' => 'BPK-005', 'url' => 'ryukzak-transformer-journey', 'price' => 6250, 'old_price' => 6990, 'quantity' => 2, 'show_stock' => true, 'groups' => ['sumki', 'ryukzaki']],
            ['name' => 'Спортивный рюкзак Active', 'sku' => 'BPK-006', 'url' => 'sportivnyy-ryukzak-active', 'price' => 3190, 'old_price' => 3690, 'quantity' => 18, 'show_stock' => true, 'groups' => ['ryukzaki']],
            ['name' => 'Рюкзак Explorer', 'sku' => 'BPK-007', 'url' => 'ryukzak-explorer', 'price' => 4890, 'old_price' => 5590, 'quantity' => 9, 'show_stock' => true, 'groups' => ['ryukzaki']],
            ['name' => 'Рюкзак Metropolitan', 'sku' => 'BPK-008', 'url' => 'ryukzak-metropolitan', 'price' => 5390, 'old_price' => 6090, 'quantity' => 7, 'show_stock' => true, 'groups' => ['ryukzaki']],
            ['name' => 'Рюкзак Adventure Pro', 'sku' => 'BPK-009', 'url' => 'ryukzak-adventure-pro', 'price' => 5790, 'old_price' => 6490, 'quantity' => 5, 'show_stock' => true, 'groups' => ['ryukzaki']],
            ['name' => 'Мини-рюкзак Mia', 'sku' => 'BPK-010', 'url' => 'mini-ryukzak-mia', 'price' => 2990, 'old_price' => 3490, 'quantity' => 16, 'show_stock' => true, 'groups' => ['ryukzaki']],
            ['name' => 'Рюкзак Rolltop Urban', 'sku' => 'BPK-011', 'url' => 'ryukzak-rolltop-urban', 'price' => 4490, 'old_price' => 5190, 'quantity' => 12, 'show_stock' => true, 'groups' => ['ryukzaki']],
            ['name' => 'Рюкзак Oxford', 'sku' => 'BPK-012', 'url' => 'ryukzak-oxford', 'price' => 5590, 'old_price' => 6290, 'quantity' => 6, 'show_stock' => true, 'groups' => ['ryukzaki']],
            ['name' => 'Рюкзак Casual Day', 'sku' => 'BPK-013', 'url' => 'ryukzak-casual-day', 'price' => 3790, 'old_price' => 4290, 'quantity' => 20, 'show_stock' => true, 'groups' => ['ryukzaki']],
            ['name' => 'Рюкзак Travel Compact', 'sku' => 'BPK-014', 'url' => 'ryukzak-travel-compact', 'price' => 4190, 'old_price' => 4790, 'quantity' => 10, 'show_stock' => true, 'groups' => ['sumki', 'ryukzaki']],
            ['name' => 'Кожаный рюкзак Bruno', 'sku' => 'BPK-015', 'url' => 'kozhanyy-ryukzak-bruno', 'price' => 6590, 'old_price' => 7390, 'quantity' => 4, 'show_stock' => true, 'groups' => ['ryukzaki']],
            ['name' => 'Рюкзак Campus', 'sku' => 'BPK-016', 'url' => 'ryukzak-campus', 'price' => 3390, 'old_price' => 3890, 'quantity' => 22, 'show_stock' => true, 'groups' => ['ryukzaki']],

            ['name' => 'Кошелек Classic Line', 'sku' => 'WAL-001', 'url' => 'koshelek-classic-line', 'price' => 1690, 'old_price' => 1990, 'quantity' => 21, 'show_stock' => true, 'groups' => ['koshelki']],
            ['name' => 'Компактный кошелек Emma', 'sku' => 'WAL-002', 'url' => 'kompaktnyy-koshelek-emma', 'price' => 1450, 'old_price' => 1790, 'quantity' => 16, 'show_stock' => true, 'groups' => ['koshelki']],
            ['name' => 'Кошелек на молнии Adele', 'sku' => 'WAL-003', 'url' => 'koshelek-na-molnii-adele', 'price' => 2190, 'old_price' => 2490, 'quantity' => 10, 'show_stock' => true, 'groups' => ['koshelki']],
            ['name' => 'Мужское портмоне Grant', 'sku' => 'WAL-004', 'url' => 'muzhskoe-portmone-grant', 'price' => 2390, 'old_price' => 2790, 'quantity' => 13, 'show_stock' => true, 'groups' => ['koshelki']],
            ['name' => 'Кошелек-клатч Monica', 'sku' => 'WAL-005', 'url' => 'koshelek-klatch-monica', 'price' => 2790, 'old_price' => 3290, 'quantity' => 6, 'show_stock' => true, 'groups' => ['sumki', 'koshelki']],
            ['name' => 'Кардхолдер Slim', 'sku' => 'WAL-006', 'url' => 'kardholder-slim', 'price' => 990, 'old_price' => 1190, 'quantity' => 27, 'show_stock' => true, 'groups' => ['koshelki']],
            ['name' => 'Органайзер для путешествий Travel Case', 'sku' => 'WAL-007', 'url' => 'organayzer-travel-case', 'price' => 1890, 'old_price' => 2290, 'quantity' => 8, 'show_stock' => true, 'groups' => ['sumki', 'koshelki']],
            ['name' => 'Кожаное портмоне Denver', 'sku' => 'WAL-008', 'url' => 'kozhanoe-portmone-denver', 'price' => 2590, 'old_price' => 2990, 'quantity' => 11, 'show_stock' => true, 'groups' => ['koshelki']],
            ['name' => 'Кошелек Bella', 'sku' => 'WAL-009', 'url' => 'koshelek-bella', 'price' => 1990, 'old_price' => 2390, 'quantity' => 15, 'show_stock' => true, 'groups' => ['koshelki']],
            ['name' => 'Кардхолдер Minimal', 'sku' => 'WAL-010', 'url' => 'kardholder-minimal', 'price' => 890, 'old_price' => 1090, 'quantity' => 31, 'show_stock' => true, 'groups' => ['koshelki']],
            ['name' => 'Кошелек Florence', 'sku' => 'WAL-011', 'url' => 'koshelek-florence', 'price' => 2290, 'old_price' => 2690, 'quantity' => 9, 'show_stock' => true, 'groups' => ['koshelki']],
            ['name' => 'Портмоне London', 'sku' => 'WAL-012', 'url' => 'portmone-london', 'price' => 2490, 'old_price' => 2890, 'quantity' => 14, 'show_stock' => true, 'groups' => ['koshelki']],
            ['name' => 'Кошелек Mini Grace', 'sku' => 'WAL-013', 'url' => 'koshelek-mini-grace', 'price' => 1390, 'old_price' => 1690, 'quantity' => 24, 'show_stock' => true, 'groups' => ['koshelki']],
            ['name' => 'Кошелек Continental', 'sku' => 'WAL-014', 'url' => 'koshelek-continental', 'price' => 2690, 'old_price' => 3090, 'quantity' => 7, 'show_stock' => true, 'groups' => ['koshelki']],
            ['name' => 'Кардхолдер Leather Pro', 'sku' => 'WAL-015', 'url' => 'kardholder-leather-pro', 'price' => 1290, 'old_price' => 1490, 'quantity' => 19, 'show_stock' => true, 'groups' => ['koshelki']],
            ['name' => 'Кошелек-клатч Sophia', 'sku' => 'WAL-016', 'url' => 'koshelek-klatch-sophia', 'price' => 2990, 'old_price' => 3490, 'quantity' => 5, 'show_stock' => true, 'groups' => ['sumki', 'koshelki']],
            ['name' => 'Портмоне Vintage Brown', 'sku' => 'WAL-017', 'url' => 'portmone-vintage-brown', 'price' => 2890, 'old_price' => 3290, 'quantity' => 8, 'show_stock' => true, 'groups' => ['koshelki']],
            ['name' => 'Кошелек Daily Compact', 'sku' => 'WAL-018', 'url' => 'koshelek-daily-compact', 'price' => 1590, 'old_price' => 1890, 'quantity' => 23, 'show_stock' => true, 'groups' => ['koshelki']],
        ];
    }
}
