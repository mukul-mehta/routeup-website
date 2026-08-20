/**
 * Generates public/og.png: the social-card image (1200×630).
 *
 * Run:  node scripts/gen-og.mjs
 *
 * Builds the brand social card (dark canvas, mint/amber gradient hairlines,
 * lockup + headline + URL + tagline) as SVG and rasterizes it with `sharp`.
 * Self-sufficient about
 * fonts: if Space Grotesk / JetBrains Mono are not already in scripts/fonts/,
 * the static TTFs are downloaded from Google Fonts and a private fontconfig
 * is pointed at them before sharp (librsvg) loads.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fontsDir = join(__dirname, 'fonts');
const out = join(__dirname, '..', 'public', 'og.png');

// ---------------------------------------------------------------------------
// Fonts: download static TTFs once, then serve them to librsvg via fontconfig.
// A blank User-Agent makes the Google Fonts css2 endpoint return TTF URLs.
// ---------------------------------------------------------------------------
const FONTS = [
  { file: 'SpaceGrotesk-700.ttf', css: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700' },
  { file: 'JetBrainsMono-400.ttf', css: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400' },
  { file: 'JetBrainsMono-700.ttf', css: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700' },
];

mkdirSync(fontsDir, { recursive: true });
for (const font of FONTS) {
  const path = join(fontsDir, font.file);
  if (existsSync(path)) continue;
  const cssRes = await fetch(font.css, { headers: { 'User-Agent': '' } });
  if (!cssRes.ok) throw new Error(`fetch ${font.css}: ${cssRes.status}`);
  const css = await cssRes.text();
  const match = css.match(/url\((https:[^)]+\.ttf)\)/);
  if (!match) throw new Error(`no TTF URL in css2 response for ${font.file} (got webfont CSS?)`);
  const ttfRes = await fetch(match[1]);
  if (!ttfRes.ok) throw new Error(`fetch ${match[1]}: ${ttfRes.status}`);
  writeFileSync(path, Buffer.from(await ttfRes.arrayBuffer()));
  console.log('downloaded', font.file);
}

const fontsConf = join(fontsDir, 'fonts.conf');
writeFileSync(
  fontsConf,
  `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>${fontsDir}</dir>
  <cachedir>${join(fontsDir, '.cache')}</cachedir>
</fontconfig>
`,
);
// Must be set before sharp (and its bundled fontconfig/pango) is loaded.
// PANGOCAIRO_BACKEND forces the fontconfig fontmap — on macOS pango would
// otherwise use CoreText and ignore FONTCONFIG_FILE entirely.
process.env.FONTCONFIG_FILE = fontsConf;
process.env.FONTCONFIG_PATH = fontsDir;
process.env.PANGOCAIRO_BACKEND = 'fontconfig';
const sharp = (await import('sharp')).default;

// ---------------------------------------------------------------------------
// Card: 1200×630, dark canvas, 72px padding, space-between column.
// ---------------------------------------------------------------------------
const BG = '#101512';
const TXT = '#F5EFE1';
const MINT = '#79E2CB';
const GRAY = '#A09A8F';
const SANS = "'Space Grotesk', sans-serif";
const MONO = "'JetBrains Mono', monospace";

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="mint-line" gradientUnits="userSpaceOnUse" x1="680" y1="0" x2="1320" y2="0">
      <stop offset="0" stop-color="rgba(121,226,203,0)"/>
      <stop offset="1" stop-color="rgba(121,226,203,.5)"/>
    </linearGradient>
    <linearGradient id="amber-line" gradientUnits="userSpaceOnUse" x1="680" y1="0" x2="1320" y2="0">
      <stop offset="0" stop-color="rgba(255,183,107,0)"/>
      <stop offset="1" stop-color="rgba(255,183,107,.45)"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="${BG}"/>
  <rect x="680" y="120" width="640" height="1" fill="url(#mint-line)"/>
  <rect x="680" y="300" width="640" height="1" fill="url(#amber-line)"/>

  <!-- lockup: 38px mark + wordmark, top-left at 72px padding -->
  <g transform="translate(72 72)">
    <rect x="0" y="0" width="13" height="13" fill="${TXT}"/>
    <rect x="25" y="0" width="13" height="13" fill="${MINT}"/>
    <rect x="17" y="13" width="4" height="25" fill="${TXT}"/>
    <rect x="6" y="13" width="26" height="4" fill="rgba(245,239,225,.52)"/>
  </g>
  <text x="126" y="100" font-family="${MONO}" font-size="26" font-weight="700" letter-spacing="-0.78" fill="${TXT}">routeup</text>

  <!-- headline + URL block -->
  <text x="72" y="280" font-family="${SANS}" font-size="78" font-weight="700" letter-spacing="-3.12" fill="${TXT}">Your app has a</text>
  <text x="72" y="358" font-family="${SANS}" font-size="78" font-weight="700" letter-spacing="-3.12" fill="${TXT}">name. Use it.</text>
  <text x="72" y="423" font-family="${MONO}" font-size="24" fill="${MINT}">https://myapp.localhost</text>

  <!-- tagline, 72px from bottom edge -->
  <text x="72" y="553" font-family="${MONO}" font-size="18" fill="${GRAY}">stable HTTPS names for local services \u00b7 public only when you say so</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
const meta = await sharp(out).metadata();
console.log('wrote', out, `${meta.width}x${meta.height}`);
