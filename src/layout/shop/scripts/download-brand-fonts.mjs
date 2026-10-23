// Download only the font binaries; text manifests/CSS are emitted for apply_patch.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const requests = [
  ['Noto Sans', '400..700'], ['Roboto', '300..700'], ['PT Serif', '400'],
  ['Oswald', '700'], ['Golos Text', '400..700'], ['Caveat', '700'], ['Nunito', '800']
];
const fontDir = resolve('assets/fonts');
await mkdir(fontDir, { recursive: true });
const families = await Promise.all(requests.map(async ([family, weight]) => {
  const slug = family.toLowerCase().replaceAll(' ', '-');
  const source = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(family) + ':wght@' + weight + '&display=swap';
  const response = await fetch(source, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' } });
  if (!response.ok) throw new Error(family + ': CSS ' + response.status);
  const css = await response.text();
  const blocks = [...css.matchAll(/\/\* ([^*]+) \*\/\s*(@font-face\s*\{[^}]+\})/g)]
    .filter(match => ['cyrillic-ext', 'cyrillic', 'latin-ext', 'latin'].includes(match[1]));
  if (!blocks.some(match => match[1] === 'cyrillic') || !blocks.some(match => match[1] === 'latin')) throw new Error(family + ': missing subsets');
  const assets = await Promise.all(blocks.map(async ([, subset, face]) => {
    const url = face.match(/url\(([^)]+)\)/)[1];
    if (!url.startsWith('https://fonts.gstatic.com/') || !url.endsWith('.woff2')) throw new Error('Not a Google WOFF2 asset');
    const file = slug + '-brand-' + subset + '.woff2';
    const metadataOnly = process.argv.includes('--metadata-only');
    const download = metadataOnly ? null : await fetch(url);
    if (download && !download.ok) throw new Error(family + ': font ' + download.status);
    const bytes = metadataOnly ? await readFile(resolve(fontDir, file)) : Buffer.from(await download.arrayBuffer());
    if (bytes.subarray(0, 4).toString() !== 'wOF2') throw new Error(family + ': bad WOFF2 signature');
    if (!metadataOnly) await writeFile(resolve(fontDir, file), bytes);
    return {
      family, subset, weight: face.match(/font-weight:\s*([^;]+);/)[1], file, source: url, bytes: bytes.length,
      face: face.replace(/url\([^)]+\)/, 'url("../../assets/fonts/' + file + '")')
    };
  }));
  return assets;
}));
process.stdout.write(JSON.stringify(families.flat()));
