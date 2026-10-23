import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const manifest = JSON.parse(read('css/themes/theme-manifest.json'));
const spacing = read(manifest.spacing).replace(/\/\*[\s\S]*?\*\//g, '');

assert.deepEqual(manifest.loadOrder, ['base', 'spacing', 'palette', 'shape', 'font', 'icons', 'iconBackground', 'menu']);
assert.equal(manifest.selectionGroups.length, 6);
assert.ok(!manifest.selectionGroups.some(group => group.key === 'spacing'), 'Spacing must not become a selectable preset.');

const allowed = /^(?:--shopra-(?:page-gutter|section-space(?:-small)?|home-start-space|label-gap|heading-gap|grid-gutter|grid-row-gap|panel-space|padding-large|anchor-space)|margin(?:-(?:top|right|bottom|left))?|padding(?:-(?:top|right|bottom|left))?|scroll-margin-top|align-items)$/;
for (const [, property] of spacing.matchAll(/(?:^|[;{}])\s*([\w-]+)\s*:/g)) {
  assert.match(property, allowed, `Spacing file must not change typography, colour or component sizes: ${property}`);
}

for (const folder of ['', 'food/', 'jewelry/']) {
  for (const page of ['index', 'catalog', 'product', 'checkout']) {
    const path = `${folder}${page}.html`;
    const prefix = folder ? '../' : '';
    const styles = [...read(path).matchAll(/<link\b[^>]*href="([^"]+\.css)"[^>]*>/g)].map((m) => m[1]);
    const base = styles.indexOf(prefix + manifest.base);
    assert.equal(styles.filter((s) => s === prefix + manifest.spacing).length, 1, `${path}: one spacing stylesheet`);
    assert.equal(styles[base + 1], prefix + manifest.spacing, `${path}: spacing directly after core`);
    assert.ok(styles.slice(base + 2).some((s) => s.includes('/palettes/')), `${path}: colour preset retained`);
    assert.ok(styles.slice(base + 2).some((s) => s.includes('/fonts/')), `${path}: font preset retained`);
  }
}

console.log('Spacing contract passed: 12 pages, 6 independent preset groups, spacing-only CSS.');
