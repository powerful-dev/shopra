import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');
const manifest = JSON.parse(read('css/themes/theme-manifest.json'));
const group = manifest.selectionGroups.find(item => item.key === 'iconBackground');
assert.equal(group.source, 'iconBackgrounds');
assert.equal(group.multiple, false);
assert.equal(group.required, true);
assert.equal(group.default, 'filled');
assert.deepEqual(manifest.iconBackgrounds.map(item => item.id), ['filled', 'bare']);
assert.equal(manifest.loadOrder.indexOf('iconBackground'), manifest.loadOrder.indexOf('icons') + 1);

for (const item of manifest.iconBackgrounds) {
  const css = read(item.file);
  assert.ok(css.includes('--shopra-icon-background: ' + item.id + ';'));
  assert.doesNotMatch(css, /--shopra-(?:icon-set|icon-stroke-width|icon-fill|radius-icon|icon-button-size|color-[\w-]+)\s*:/,
    'Background choice must not change geometry, size, shape or palette.');
  assert.doesNotMatch(css, /(?:^|[;{}])\s*(?:width|height|padding|margin|display|pointer-events)\s*:/,
    'Both modes must preserve the existing button hit area.');
}
const bare = read(manifest.iconBackgrounds.find(item => item.id === 'bare').file);
assert.match(bare, /--shopra-card-icon-background:\s*transparent;/);
assert.match(bare, /--shopra-card-icon-active-background:\s*transparent;/);
assert.match(bare, /--shopra-card-icon-active-color:\s*var\(--shopra-color-on-secondary\);/);
assert.ok(bare.includes('color: var(--shopra-color-on-secondary);'));
assert.match(bare, /--shopra-card-favorite-active-fill:\s*currentColor;/);
assert.doesNotMatch(bare, /(?:data-cart-count|data-card-cart-count|data-variant-option|uk-navbar)/,
  'Do not remove counter backgrounds, swatch colours or header styling.');

const core = read(manifest.base);
assert.ok(core.includes('.uk-card-media-top > :is(a, button).uk-icon-button.uk-button-primary:hover'));
assert.ok(core.includes('var(--shopra-card-icon-active-background, var(--shopra-color-primary))'));
assert.ok(core.includes('var(--shopra-card-icon-background, var(--shopra-color-surface))'));
for (const folder of ['', 'food/', 'jewelry/']) {
  for (const page of ['index', 'catalog', 'product', 'checkout']) {
    const path = folder + page + '.html';
    const html = read(path);
    const styles = [...html.matchAll(/<link\b[^>]*href="([^"]+\.css)"[^>]*>/g)].map(match => match[1]);
    const backgroundLinks = styles.filter(href => href.includes('/icon-backgrounds/'));
    assert.equal(backgroundLinks.length, 1, path + ': exactly one background preset');
    const prefix = folder ? '../' : '';
    const selected = manifest.iconBackgrounds.find(item => item.id === (folder ? 'filled' : 'bare'));
    assert.equal(backgroundLinks[0], prefix + selected.file, path + ': store-specific background');
    const icons = styles.findIndex(href => href.includes('/icons/'));
    assert.equal(styles[icons + 1], backgroundLinks[0], path + ': independent layer after icon geometry');
  }
}
for (const harness of ['tests/theme-presets.html', 'tests/menu-presets.html']) {
  assert.ok(read(harness).includes('id="icon-background"'), harness + ': selectable background');
}
console.log('Icon-background contract passed: 2 independent modes, preserved hit areas and counters, 12 pages.');
