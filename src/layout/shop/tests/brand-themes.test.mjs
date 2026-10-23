import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');
const manifest = JSON.parse(read('css/themes/theme-manifest.json'));
const expected = [
  {
    "id": "brand-aesop",
    "swatches": [
      "#F3F0E6",
      "#33332E",
      "#DDD7CA",
      "#756550"
    ],
    "heading": "Noto Sans",
    "body": "Noto Sans",
    "headingWeight": 400,
    "bodyWeight": 400
  },
  {
    "id": "brand-tiffany",
    "swatches": [
      "#FBFBF7",
      "#212121",
      "#D9F2EF",
      "#81CFC5"
    ],
    "heading": "Cormorant Garamond",
    "body": "Manrope",
    "headingWeight": 500,
    "bodyWeight": 400
  },
  {
    "id": "brand-glossier",
    "swatches": [
      "#FFFDFC",
      "#222222",
      "#F2E3E6",
      "#EBC0D0"
    ],
    "heading": "Golos Text",
    "body": "Golos Text",
    "headingWeight": 500,
    "bodyWeight": 400
  },
  {
    "id": "brand-nike",
    "swatches": [
      "#FFFFFF",
      "#111111",
      "#F2F2F2",
      "#707072"
    ],
    "heading": "Oswald",
    "body": "Inter",
    "headingWeight": 700,
    "bodyWeight": 400
  },
  {
    "id": "brand-ralph-lauren",
    "swatches": [
      "#F7F5EF",
      "#18243A",
      "#E5E1D7",
      "#1F3358"
    ],
    "heading": "PT Serif",
    "body": "IBM Plex Sans",
    "headingWeight": 400,
    "bodyWeight": 400
  },
  {
    "id": "brand-loccitane",
    "swatches": [
      "#FFF9EA",
      "#25334A",
      "#F1E6CB",
      "#F7D15B"
    ],
    "heading": "PT Serif",
    "body": "Source Sans 3",
    "headingWeight": 400,
    "bodyWeight": 400
  },
  {
    "id": "brand-zara",
    "swatches": [
      "#FFFFFF",
      "#111111",
      "#F4F4F4",
      "#A6A6A6"
    ],
    "heading": "Roboto",
    "body": "Roboto",
    "headingWeight": 300,
    "bodyWeight": 400
  },
  {
    "id": "brand-ikea",
    "swatches": [
      "#FFFFFF",
      "#111111",
      "#0058A3",
      "#FFDB00"
    ],
    "heading": "Noto Sans",
    "body": "Noto Sans",
    "headingWeight": 700,
    "bodyWeight": 400
  },
  {
    "id": "brand-lego",
    "swatches": [
      "#FFFFFF",
      "#1A1A1A",
      "#FFD500",
      "#E3000B"
    ],
    "heading": "Nunito",
    "body": "Nunito Sans",
    "headingWeight": 800,
    "bodyWeight": 400
  },
  {
    "id": "brand-lush",
    "swatches": [
      "#FFFDF5",
      "#111111",
      "#F1F0E7",
      "#FFFFFF"
    ],
    "heading": "Caveat",
    "body": "Roboto",
    "headingWeight": 700,
    "bodyWeight": 400
  }
];
assert.equal(manifest.selectionMode, 'independent');
assert.equal(manifest.selectionGroups.length, 6);
assert.equal(manifest.palettes.length, 20);
assert.equal(manifest.fonts.length, 19);
const rgb = hex => hex.slice(1).match(/../g).map(n => parseInt(n, 16) / 255);
const luminance = hex => rgb(hex).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4).reduce((n, v, i) => n + v * [.2126, .7152, .0722][i], 0);
const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
const originalAssets = JSON.parse(read(manifest.fontAssets));
const brandAssets = JSON.parse(read(manifest.brandFontAssets));
const faces = read(manifest.brandFontFaces);
assert.equal(brandAssets.length, 28);
assert.equal([...faces.matchAll(/@font-face\s*\{/g)].length, 28);
assert.doesNotMatch(faces, /https?:\/\//, 'Fonts are local at runtime');
for (const a of brandAssets) {
  const file = resolve(root, 'assets/fonts', a.file);
  assert.equal(statSync(file).size, a.bytes);
  assert.equal(readFileSync(file).subarray(0, 4).toString(), 'wOF2');
  assert.ok(faces.includes('../../assets/fonts/' + a.file));
  assert.ok(a.source.startsWith('https://fonts.gstatic.com/'));
}
for (const e of expected) {
  const p = manifest.palettes.find(p => p.id === e.id);
  const f = manifest.fonts.find(f => f.id === e.id);
  assert.deepEqual(p.swatches, e.swatches, e.id + ': exact screenshot colours');
  for (const key of ['heading', 'body', 'headingWeight', 'bodyWeight']) assert.equal(f[key], e[key]);
  assert.equal(p.sourceKind, 'user-provided-adaptation');
  assert.equal(f.sourceKind, 'user-provided-adaptation');
  const paletteCss = read(p.file), fontCss = read(f.file);
  assert.doesNotMatch(paletteCss, /font-|padding|margin|radius|icon-set/);
  assert.doesNotMatch(fontCss, /color:|background:|padding|margin|radius|icon-set/);
  assert.ok(fontCss.includes('--shopra-font-heading: "' + e.heading + '"'));
  assert.ok(fontCss.includes('--shopra-font-body: "' + e.body + '"'));
  assert.ok(fontCss.includes('--shopra-font-weight-heading: ' + e.headingWeight + ';'));
  assert.ok(fontCss.includes('@import url("../shopra-brand-font-faces.css");'));
  assert.ok(contrast(p.tokens.action, p.tokens['on-action']) >= 4.5, e.id + ': primary button contrast');
  assert.ok(contrast(p.tokens.accent, p.tokens.cream) >= 4.5, e.id + ': accent text contrast');
  assert.ok(contrast(p.tokens['hero-action'], p.tokens['on-hero-action']) >= 4.5, e.id + ': photo CTA contrast');
  const allAssets = [...originalAssets, ...brandAssets];
  for (const [family, weight] of [[e.heading, e.headingWeight], [e.body, 400], [e.body, f.uiWeight], [e.body, f.priceWeight]]) {
    for (const subset of ['cyrillic', 'latin']) {
      assert.ok(allAssets.some(a => {
        const range = a.weight.split(' ').map(Number);
        return a.family === family && a.subset === subset && weight >= range[0] && weight <= (range[1] || range[0]);
      }), e.id + ': real ' + family + ' ' + weight + ' ' + subset + ' face');
    }
  }
}
console.log('Brand schemes passed: 10 additions, exact colours/font pairs, 28 local WOFF2 assets, readable contrast, independent selections.');
