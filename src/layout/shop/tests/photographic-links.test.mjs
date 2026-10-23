import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = file => readFileSync(resolve(root, file), 'utf8');
const core = read('css/themes/shopra-theme-core.css');
const inverseSelector = 'a.uk-inline-clip.uk-light';
const inverseRule = core.match(/a\.uk-inline-clip\.uk-light,[^{]+\{([^}]+)\}/);
assert.ok(inverseRule, 'Photographic links need a shared inverse text rule.');
for (const state of ['', ':hover', ':focus-visible', ':active']) {
  assert.ok(inverseRule[0].includes(inverseSelector + state), `Missing inverse link state: ${state || 'rest'}`);
}
assert.match(inverseRule[1], /color: rgba\(255, 255, 255, 0\.7\);/, 'Keep UIkit’s existing inverse caption colour in every interaction state.');
assert.ok(core.indexOf(inverseRule[0]) > core.indexOf('a:hover,'), 'Inverse cards must override ordinary link hover colours.');
assert.match(core, /a:hover,\s*\.uk-link:hover\s*\{\s*color: var\(--shopra-color-accent-hover\);/, 'Ordinary links must still follow their palette.');

for (const store of ['', 'food/', 'jewelry/']) {
  const html = read(store + 'index.html');
  assert.match(html, /href="(?:\.\.\/)?css\/themes\/shopra-theme-core\.css"/);
  const cards = [...html.matchAll(/<a class="uk-inline-clip uk-transition-toggle uk-light"[^>]*>([\s\S]*?)<\/a>/g)];
  assert.equal(cards.length, 4, `${store || 'clothing/'} must keep four shared photographic category links.`);
  for (const [, card] of cards) {
    assert.match(card, /shopra-gradient--bottom/);
    assert.match(card, /<small>[^<]+<\/small>/, 'The inherited subtitle must remain present.');
  }
}
console.log('Photographic links passed: inverse captions at rest, hover, focus and active; 12 category cards across 3 stores; normal palette links preserved.');
