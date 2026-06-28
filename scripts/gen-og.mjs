/**
 * Generates public/og.png: the social-card image (1200×630).
 *
 * Run:  node scripts/gen-og.mjs
 *
 * Intentionally dependency-light: builds an SVG in the site's paper-and-mono
 * palette and rasterizes it with `sharp` (already a project dependency). Update
 * the SVG below if the brand mark changes.
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, '..', 'public', 'og.png');

const FONT = "'JetBrains Mono', 'Geist Mono', 'DejaVu Sans Mono', 'Menlo', monospace";

// Palette mirrors src/pages/index.astro.
const BG = '#e8e2d0';
const ELEV = '#faf6e8';
const INK = '#1c160c';
const FAINT = '#5f5640';
const TEAL = '#0a6a6a';
const RULE = '#2a2418';

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="${BG}"/>
  <rect x="48" y="48" width="1104" height="534" fill="none" stroke="${RULE}" stroke-width="2"/>

  <g transform="translate(96 96) scale(2)">
    <line x1="8" y1="13.5" x2="8" y2="9" stroke="${INK}" stroke-width="1.2" stroke-linecap="square"/>
    <line x1="8" y1="9" x2="4" y2="5" stroke="${INK}" stroke-width="1.2" stroke-linecap="square"/>
    <line x1="8" y1="9" x2="12" y2="5" stroke="${TEAL}" stroke-width="1.2" stroke-linecap="square"/>
    <rect x="3" y="3" width="2.5" height="2.5" fill="${INK}"/>
    <rect x="10.5" y="3" width="2.5" height="2.5" fill="${TEAL}"/>
  </g>
  <text x="142" y="126" font-family="${FONT}" font-size="40" font-weight="800" fill="${INK}">routeup</text>

  <text x="96" y="268" font-family="${FONT}" font-size="76" font-weight="800" fill="${INK}" letter-spacing="-2">Stable HTTPS for</text>
  <text x="96" y="352" font-family="${FONT}" font-size="76" font-weight="800" fill="${INK}" letter-spacing="-2">local services.</text>

  <text x="98" y="412" font-family="${FONT}" font-size="33" font-weight="600" fill="${TEAL}">Public when you need it.</text>

  <rect x="96" y="446" width="1008" height="72" fill="${ELEV}" stroke="${RULE}" stroke-width="2"/>
  <text x="122" y="491" font-family="${FONT}" font-size="26" font-weight="500" fill="${INK}"><tspan fill="${FAINT}">$</tspan> routeup serve myapp --port 8080 --public</text>

  <text x="98" y="558" font-family="${FONT}" font-size="22" font-weight="500" fill="${FAINT}">open source · MIT · self-hostable · zero telemetry</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log('wrote', out);
