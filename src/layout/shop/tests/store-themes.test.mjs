import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');
const manifest = JSON.parse(read('css/themes/theme-manifest.json'));
const expected = [
  { id: 'clothing', path: '', palette: 'athletic', font: 'fashion' },
  { id: 'food', path: 'food/', palette: 'warm-skin', font: 'soft' },
  { id: 'jewelry', path: 'jewelry/', palette: 'plum', font: 'elegant' }
];

assert.equal(manifest.selectionMode, 'independent');
assert.equal(manifest.selectionGroups.length, 6, 'No coupled theme group');
assert.equal(manifest.storeDefaults.length, expected.length);
for (const store of expected) {
  const defaults = manifest.storeDefaults.find(item => item.id === store.id);
  for (const key of ['path', 'palette', 'font']) assert.equal(defaults[key], store[key]);
  const palette = manifest.palettes.find(item => item.id === store.palette);
  const font = manifest.fonts.find(item => item.id === store.font);
  assert.ok(palette && font, store.id + ': valid independent choices');
  for (const page of ['index', 'catalog', 'product', 'checkout']) {
    const html = read(store.path + page + '.html');
    for (const [group, choice] of [['palettes', palette], ['fonts', font]]) {
      const links = [...html.matchAll(new RegExp('href="([^"]*themes/' + group + '/[^"]+)"', 'g'))];
      assert.equal(links.length, 1, store.id + '/' + page + ': exactly one ' + group + ' choice');
      assert.ok(links[0][1].endsWith(choice.file), store.id + '/' + page + ': consistent ' + group);
    }
  }
}

const stand = read('tests/theme-presets.html');
const helpers = stand.slice(stand.indexOf('      const storeSelections = new Map();'), stand.indexOf('      // Static hosting'));
assert.ok(helpers.includes('function selectStoreThemes()'));
assert.match(stand, /site\.addEventListener\('change', \(\) => \{ selectStoreThemes\(\); showPage\(\); \}\)/);
assert.match(stand, /page\.addEventListener\('change', showPage\)/);
for (const control of ['font', 'palette']) {
  assert.ok(stand.includes(control + ".addEventListener('change', () => { rememberStoreThemes(); applyThemes().catch(reportError); })"));
}
const context = {
  manifest,
  site: { value: '' },
  font: { value: '' },
  palette: { value: '' }
};
runInNewContext(helpers + '\nselectStoreThemes();', context);
assert.equal(context.font.value, 'fashion');
assert.equal(context.palette.value, 'athletic');
context.font.value = 'editorial';
runInNewContext('rememberStoreThemes();', context);
assert.equal(context.palette.value, 'athletic', 'Changing fonts leaves colours alone');
context.palette.value = 'saffron';
runInNewContext('rememberStoreThemes();', context);
assert.equal(context.font.value, 'editorial', 'Changing colours leaves fonts alone');
for (const store of expected.slice(1)) {
  context.site.value = store.path;
  runInNewContext('selectStoreThemes();', context);
  assert.equal(context.font.value, store.font);
  assert.equal(context.palette.value, store.palette);
}
context.site.value = '';
runInNewContext('selectStoreThemes();', context);
assert.equal(context.font.value, 'editorial', 'Previous font choice restored for this store');
assert.equal(context.palette.value, 'saffron', 'Previous palette choice restored for this store');

console.log('Store themes passed: 12 consistent pages, independent font/palette choices, per-store preview selections.');
