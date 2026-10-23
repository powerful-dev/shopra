import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');
const manifest = JSON.parse(read('css/themes/theme-manifest.json'));
const expected = {
  "palettes": [
    {
      "id": "warm-skin",
      "tokens": {
        "ink": "#2B211D",
        "accent": "#A44124",
        "dark": "#46271D",
        "pale": "#F1DECC",
        "cream": "#FFFAF4",
        "header": "#FFFDFA",
        "footer": "#E9CDB0",
        "hero-1": "#2B211D",
        "hero-2": "#643820"
      }
    },
    {
      "id": "forest",
      "tokens": {
        "ink": "#1F2C25",
        "accent": "#3E5B37",
        "dark": "#243C2D",
        "pale": "#E2E8CE",
        "cream": "#F5F7ED",
        "header": "#FBFCF7",
        "footer": "#DDE6CA",
        "hero-1": "#1C2E23",
        "hero-2": "#405034"
      }
    },
    {
      "id": "ink",
      "tokens": {
        "ink": "#242321",
        "accent": "#5B6034",
        "dark": "#242321",
        "pale": "#E6E6D5",
        "cream": "#F8F8F2",
        "header": "#FDFDF9",
        "footer": "#DDDDBF",
        "hero-1": "#1F201C",
        "hero-2": "#494D34"
      }
    },
    {
      "id": "graphite",
      "tokens": {
        "ink": "#171717",
        "accent": "#333333",
        "dark": "#171717",
        "pale": "#E5E5E5",
        "cream": "#F7F7F7",
        "header": "#FFFFFF",
        "footer": "#E9E9E9",
        "hero-1": "#111111",
        "hero-2": "#3F3F3F"
      }
    },
    {
      "id": "burgundy",
      "tokens": {
        "ink": "#2D2022",
        "accent": "#7B283C",
        "dark": "#4D1D2A",
        "pale": "#F1E1DA",
        "cream": "#FCF8F5",
        "header": "#FFFAF7",
        "footer": "#EBD2C6",
        "hero-1": "#2C1720",
        "hero-2": "#642D3A"
      }
    },
    {
      "id": "light-sand",
      "tokens": {
        "ink": "#302820",
        "accent": "#805632",
        "dark": "#4D3829",
        "pale": "#F0E3CC",
        "cream": "#FFFAF0",
        "header": "#FFFDF7",
        "footer": "#E9D5B4",
        "hero-1": "#30251D",
        "hero-2": "#665037"
      }
    },
    {
      "id": "marine",
      "tokens": {
        "ink": "#19312E",
        "accent": "#176963",
        "dark": "#174741",
        "pale": "#D7E9E3",
        "cream": "#F2F8F5",
        "header": "#FAFDFC",
        "footer": "#CFE3DA",
        "hero-1": "#132F2B",
        "hero-2": "#216057"
      }
    },
    {
      "id": "plum",
      "tokens": {
        "ink": "#2E2030",
        "accent": "#653663",
        "dark": "#41223F",
        "pale": "#EEE0E6",
        "cream": "#FBF6F8",
        "header": "#FFFAFC",
        "footer": "#E8CFDC",
        "hero-1": "#281A29",
        "hero-2": "#563050"
      }
    },
    {
      "id": "athletic",
      "tokens": {
        "ink": "#191919",
        "accent": "#000000",
        "dark": "#0D1012",
        "pale": "#F5F5F5",
        "cream": "#FFFFFF",
        "header": "#FFFFFF",
        "footer": "#FFFFFF",
        "footer-ink": "#0D1012",
        "hero-1": "#0D1012",
        "hero-2": "#333638",
        "hero-action": "#FFFFFF",
        "on-hero-action": "#0D1012",
        "hero-text": "#FFFFFF",
        "hero-outline": "#FFFFFF"
      }
    },
    {
      "id": "saffron",
      "tokens": {
        "ink": "#23221D",
        "accent": "#805500",
        "action": "#EBC246",
        "on-action": "#23221D",
        "dark": "#29271F",
        "pale": "#F5E9BD",
        "cream": "#FFFCF2",
        "header": "#FFFFFF",
        "footer": "#EEDBA2",
        "hero-1": "#24221B",
        "hero-2": "#64552D"
      }
    }
  ],
  "fonts": [
    {
      "id": "modern",
      "heading": "PT Sans",
      "body": "PT Sans",
      "headingWeight": 400,
      "bodyWeight": 400,
      "uiWeight": 400,
      "priceWeight": 700,
      "tracking": "-0.01em",
      "leading": 1.18,
      "scale": 0.96
    },
    {
      "id": "fashion",
      "heading": "Onest",
      "body": "Onest",
      "headingWeight": 600,
      "bodyWeight": 400,
      "uiWeight": 500,
      "priceWeight": 600,
      "tracking": "-0.035em",
      "leading": 1.14,
      "scale": 1
    },
    {
      "id": "editorial",
      "heading": "Playfair Display",
      "body": "Source Sans 3",
      "headingWeight": 600,
      "bodyWeight": 400,
      "uiWeight": 600,
      "priceWeight": 600,
      "tracking": "-0.02em",
      "leading": 1.15,
      "scale": 1.04
    },
    {
      "id": "minimal",
      "heading": "Inter",
      "body": "Inter",
      "headingWeight": 600,
      "bodyWeight": 400,
      "uiWeight": 500,
      "priceWeight": 600,
      "tracking": "-0.03em",
      "leading": 1.12,
      "scale": 0.98
    },
    {
      "id": "classic",
      "heading": "Lora",
      "body": "Source Sans 3",
      "headingWeight": 500,
      "bodyWeight": 400,
      "uiWeight": 600,
      "priceWeight": 600,
      "tracking": "-0.015em",
      "leading": 1.2,
      "scale": 1.02
    },
    {
      "id": "soft",
      "heading": "Nunito",
      "body": "Nunito Sans",
      "headingWeight": 700,
      "bodyWeight": 400,
      "uiWeight": 600,
      "priceWeight": 600,
      "tracking": "-0.025em",
      "leading": 1.15,
      "scale": 1
    },
    {
      "id": "geometric",
      "heading": "Montserrat",
      "body": "Open Sans",
      "headingWeight": 600,
      "bodyWeight": 400,
      "uiWeight": 600,
      "priceWeight": 600,
      "tracking": "-0.03em",
      "leading": 1.15,
      "scale": 0.97
    },
    {
      "id": "elegant",
      "heading": "Cormorant Garamond",
      "body": "Montserrat",
      "headingWeight": 500,
      "bodyWeight": 400,
      "uiWeight": 500,
      "priceWeight": 600,
      "tracking": "-0.015em",
      "leading": 1.12,
      "scale": 1.15
    },
    {
      "id": "business",
      "heading": "IBM Plex Serif",
      "body": "IBM Plex Sans",
      "headingWeight": 500,
      "bodyWeight": 400,
      "uiWeight": 500,
      "priceWeight": 600,
      "tracking": "-0.02em",
      "leading": 1.18,
      "scale": 0.98
    }
  ]
};

assert.equal(manifest.palettes.length, 20);
assert.equal(manifest.fonts.length, 19);
assert.equal(new Set(manifest.palettes.map(item => item.id)).size, 20);
assert.equal(new Set(manifest.fonts.map(item => item.id)).size, 19);
assert.equal(manifest.selectionGroups.length, 6);
const tokenMap = {
  ink: 'text', accent: 'accent', dark: 'secondary', pale: 'muted', cream: 'surface',
  header: 'header', footer: 'footer', 'hero-1': 'hero-start', 'hero-2': 'hero-end'
};
const rgb = hex => hex.slice(1).match(/../g).map(value => parseInt(value, 16) / 255);
const luminance = color => color.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
  .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
const contrast = (first, second) => (Math.max(luminance(first), luminance(second)) + 0.05) /
  (Math.min(luminance(first), luminance(second)) + 0.05);
for (const p of expected.palettes) {
  const item = manifest.palettes.find(item => item.id === p.id);
  assert.deepEqual(item.tokens, p.tokens, p.id + ': palette contract');
  const css = read(item.file);
  for (const [source, target] of Object.entries(tokenMap)) {
    assert.ok(css.includes('--shopra-color-' + target + ': ' + p.tokens[source] + ';'), p.id + ': ' + target);
  }
  assert.ok(css.includes('--shopra-color-primary: ' + (p.tokens.action ?? p.tokens.accent) + ';'));
  assert.ok(css.includes('--shopra-color-on-primary: ' + (p.tokens['on-action'] ?? '#FFFFFF') + ';'));
  assert.ok(css.includes('--shopra-color-footer-text: ' + (p.tokens['footer-ink'] ?? p.tokens.ink) + ';'));
  assert.ok(contrast(rgb(p.tokens.action ?? p.tokens.accent), rgb(p.tokens['on-action'] ?? '#FFFFFF')) >= 4.5,
    p.id + ': readable primary button');
  assert.ok(contrast(rgb(p.tokens.accent), rgb(p.tokens.cream)) >= 4.5, p.id + ': readable accent text');
  if (p.tokens['hero-action']) {
    for (const token of ['hero-action', 'on-hero-action', 'hero-text', 'hero-outline']) {
      assert.ok(css.includes('--shopra-color-' + token + ': ' + p.tokens[token] + ';'), p.id + ': ' + token);
    }
    assert.ok(contrast(rgb(p.tokens['hero-action']), rgb(p.tokens['on-hero-action'])) >= 4.5,
      p.id + ': readable inverse banner button');
  }
}
const athletic = read('css/themes/palettes/athletic.css');
const core = read('css/themes/shopra-theme-core.css');
assert.ok(athletic.includes('--shopra-hero-gradient-left: linear-gradient(0deg,'));
assert.ok(athletic.includes('--shopra-hero-gradient-left-mobile: linear-gradient(0deg,'));
assert.ok(core.includes('.uk-cover-container.uk-light .uk-button-primary {'));
assert.ok(core.includes('var(--shopra-color-hero-action, var(--shopra-color-primary))'));
assert.ok(read('css/shopra-gradients.css').includes('var(--shopra-hero-gradient-left-mobile,'));
for (const f of expected.fonts) {
  const item = manifest.fonts.find(item => item.id === f.id);
  for (const [key, value] of Object.entries(f)) assert.equal(item[key], value, f.id + ': ' + key);
  const css = read(item.file);
  assert.ok(css.includes('@import url("../shopra-font-faces.css");'));
  assert.ok(css.includes('@import url("../shopra-typography.css");'));
  assert.ok(css.includes('--shopra-font-heading: "' + f.heading + '"'));
  assert.ok(css.includes('--shopra-font-body: "' + f.body + '"'));
  for (const [token, value] of [
    ['font-weight-heading', f.headingWeight], ['font-weight-body', f.bodyWeight],
    ['font-weight-ui', f.uiWeight], ['font-weight-price', f.priceWeight],
    ['heading-letter-spacing', f.tracking], ['heading-line-height', f.leading], ['heading-scale', f.scale]
  ]) assert.ok(css.includes('--shopra-' + token + ': ' + value + ';'), f.id + ': ' + token);
}
const faces = read(manifest.fontFaces);
const assets = JSON.parse(read(manifest.fontAssets));
assert.equal(assets.length, 59);
assert.equal([...faces.matchAll(/@font-face\s*\{/g)].length, 59);
assert.doesNotMatch(faces, /https?:\/\//, 'No external runtime font requests');
for (const asset of assets) {
  const file = resolve(root, 'assets/fonts', asset.file);
  assert.equal(statSync(file).size, asset.bytes, asset.file + ': complete font binary');
  assert.equal(readFileSync(file).subarray(0, 4).toString(), 'wOF2', asset.file + ': WOFF2 signature');
  assert.ok(faces.includes('../../assets/fonts/' + asset.file), asset.file + ': relative URL');
  assert.ok(faces.includes("font-family: '" + asset.family + "'"));
}
for (const f of expected.fonts) {
  for (const family of [f.heading, f.body]) {
    const available = assets.filter(asset => asset.family === family);
    assert.ok(available.length, family + ': font files exist');
    assert.ok(available.some(asset => asset.subset === 'cyrillic'), family + ': Cyrillic support');
    assert.ok(available.some(asset => asset.subset === 'latin'), family + ': Latin support');
  }
}
assert.equal(readdirSync(resolve(root, 'assets/fonts')).filter(file => file.endsWith('-OFL.txt')).length, 20);
for (const folder of ['', 'food/', 'jewelry/']) {
  for (const page of ['index', 'catalog', 'product', 'checkout']) {
    const html = read(folder + page + '.html');
    for (const [group, items] of [['palettes', manifest.palettes], ['fonts', manifest.fonts]]) {
      const link = html.match(new RegExp('themes/' + group + '/([^"]+)'));
      assert.ok(link, folder + page + ': ' + group);
      assert.ok(items.some(item => item.file.endsWith('/' + link[1])), link[1] + ': valid preset');
    }
  }
}
console.log('Original theme contract preserved: 10 palettes, 9 font solutions, 59 original WOFF2 files; 12 valid pages. Additional brand schemes tested separately.');
