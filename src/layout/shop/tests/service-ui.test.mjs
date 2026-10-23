import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = file => readFileSync(resolve(root, file), 'utf8');
const css = read('css/shopra-service-ui.css');
const core = read('css/themes/shopra-theme-core.css');
const script = read('js/shopra-cart.js');
assert.match(core, /^@import url\("\.\.\/shopra-service-ui\.css"\);/);
assert.match(css, /height: auto !important;/, 'Search must not retain the full-height utility.');
assert.match(css, /width: 520px;/);
assert.match(css, /max-height: min\(560px, calc\(100dvh - 56px\)\);/);
assert.match(css, /\[data-search-image\][\s\S]*?width: 48px;[\s\S]*?height: 64px;/);
assert.match(css, /\[data-search-name\][\s\S]*?font-family: var\(--shopra-font-body\);[\s\S]*?font-size: 14px;/);
assert.doesNotMatch(css, /#[0-9a-fA-F]{3,8}\b/, 'Service components must use palette roles, not fixed colours.');
assert.match(read('css/themes/icon-backgrounds/bare.css'), /--shopra-delivery-icon-background: transparent;/);
assert.match(read('css/themes/icon-backgrounds/bare.css'), /--shopra-delivery-icon-inverse-background: transparent;/);
assert.match(read('css/themes/icon-backgrounds/filled.css'), /--shopra-delivery-icon-background: color-mix/);

// Exercise the actual render functions without loading a browser or writing cart storage.
const searchCode = script.slice(script.indexOf('  function renderSearchItem('), script.indexOf('  function renderItem('));
const context = {
  products: {
    'fashion-0': { name: 'Жакет Form 02', category: 'Жакеты', price: 4900, image: 'assets/products/fashion-00.webp', color: 'Кобальт' },
    'fashion-1': { name: 'Пальто Axis', category: 'Жакеты', price: 6800, image: 'assets/products/fashion-01.webp', color: 'Песочный' }
  },
  searchTitle: {}, searchResults: {},
  formatPrice: value => `${value} ₴`
};
runInNewContext(searchCode + '\nrenderSearch();', context);
assert.equal(context.searchTitle.textContent, 'Популярные товары');
assert.equal((context.searchResults.innerHTML.match(/data-search-result>/g) || []).length, 2);
assert.match(context.searchResults.innerHTML, /href="product.html\?id=1"/);
assert.match(context.searchResults.innerHTML, /width="48" height="64" data-search-image/);
runInNewContext('renderSearch("  ПАЛЬТО  ");', context);
assert.equal(context.searchTitle.textContent, 'Результаты поиска');
assert.match(context.searchResults.innerHTML, /Пальто Axis/);
assert.doesNotMatch(context.searchResults.innerHTML, /Жакет Form/);
runInNewContext('renderSearch("нет такого товара");', context);
assert.match(context.searchResults.innerHTML, /data-search-empty/);
assert.match(context.searchResults.innerHTML, /Товары не найдены/);
runInNewContext('resultIcon = deliveryIcon();', context);
assert.match(context.resultIcon, /aria-hidden="true"/);
assert.match(context.resultIcon, /uk-icon="icon: shopra-delivery"/);
assert.match(script, /UIkit\?\.icon\.add\(/, 'Delivery geometry must be registered through UIkit.');
assert.match(script, /shippingElement\.innerHTML = `\$\{deliveryIcon\(\)\}<span>\$\{shippingMessage\}<\/span>`;/);

for (const store of ['', 'food/', 'jewelry/']) {
  for (const page of ['index', 'catalog', 'product']) {
    const html = read(store + page + '.html');
    assert.match(html, /id="search-modal"/);
    assert.match(html, /data-cart-shipping/);
    if (page !== 'index') assert.match(html, /data-shipping-banner/);
  }
}
console.log('Service UI passed: compact themed search, working filtering/empty state, UIkit delivery icon and 2 backgrounds in 3 stores.');
