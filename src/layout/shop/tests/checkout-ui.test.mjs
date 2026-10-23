import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');
const css = read('css/shopra-checkout.css');
assert.ok(read('css/themes/shopra-theme-core.css').includes('@import url("../shopra-checkout.css");'));
assert.doesNotMatch(css, /#[\da-f]{3,8}\b|\brgba?\(/i, 'No hardcoded theme colours');
assert.doesNotMatch(css, /font-family:\s*["']/, 'No hardcoded font families');
assert.ok(css.includes('font-family: var(--shopra-font-body)'));
assert.ok(css.includes('font-weight: var(--shopra-font-weight-ui)'));
assert.ok(css.includes('color: var(--shopra-color-on-primary)'), 'Light primary palettes keep readable selected choices');
assert.ok(css.includes('grid-template-columns: minmax(0, 1fr) minmax(310px, 0.5fr)'));
assert.ok(css.includes('font-size: 16px'), 'Mobile controls retain a readable font size');
assert.ok(css.includes('[data-order-line-footer]'));
assert.ok(css.includes('flex-wrap: wrap'));
assert.ok(css.includes('min-width: 0'));
assert.ok(css.includes('font-size: 22px'), 'Summary total follows the compact scale');

for (const folder of ['', 'food/', 'jewelry/']) {
  const html = read(folder + 'checkout.html');
  for (const hook of ['data-checkout-page', 'data-checkout-layout', 'data-checkout-sections', 'data-checkout-summary']) {
    assert.equal([...html.matchAll(new RegExp('\\b' + hook + '\\b', 'g'))].length, 1, folder + hook);
  }
  assert.doesNotMatch(html, /uk-form-large/, 'Use normal UIkit form controls');
  assert.ok(html.includes('name="delivery"'));
  assert.ok(html.includes('name="payment"'));
  assert.ok(html.includes('data-promo-input'));
  assert.ok(html.includes('data-order-total'));
}

const source = read('js/checkout.js');
const escape = source.slice(source.indexOf('  function escapeHTML('), source.indexOf('  function itemCount('));
const renderer = source.slice(source.indexOf('  function renderLine('), source.indexOf('  function updateChoiceCards('));
for (const labels of [
  { color: 'Цвет', size: 'Размер' },
  { color: 'Получение', size: 'Формат' },
  { color: 'Металл', size: 'Размер' },
]) {
  const item = { key: 'product:<test>"', productId: 'product', color: 'Белый & серый', size: 'M/L', quantity: 4 };
  const context = { store: { optionLabels: labels }, products: { product: { name: 'Товар <test>', image: 'product.webp', price: 150 } }, item, Intl };
  const markup = runInNewContext(escape + renderer + '\nrenderLine(item);', context);
  assert.equal([...markup.matchAll(/class="uk-width-auto"/g)].length, 1, 'Only photo and flexible copy share the main row');
  assert.ok(markup.includes('width="56" height="76"'));
  assert.ok(markup.includes('data-order-quantity>4'));
  assert.ok(markup.includes('Товар &lt;test&gt;'));
  assert.ok(markup.includes(labels.color + ': Белый &amp; серый'));
  assert.ok(markup.includes(labels.size + ': M/L'));
  assert.ok(markup.includes('data-order-line-total>600 ₴'));
  assert.ok(markup.indexOf('data-order-line-footer') < markup.indexOf('data-checkout-remove'));
  assert.ok(markup.includes('data-cart-key="product:&lt;test&gt;&quot;"'));
}
assert.ok(source.includes('cart = cart.filter((item) => item.key !== removeButton.dataset.cartKey)'));
assert.ok(source.includes('subtotal() - discount() + deliveryPrice() + codFee()'));
console.log('Checkout UI passed: 3 pages, scoped theme-aware styles, standard fields, compact 2-column item rows and intact totals/removal hooks.');
