/**
 * Generates the testimonial avatar tiles in public/assets/avatars/.
 *
 * Usage: node scripts/generate-avatars.mjs
 *
 * WHY THESE ARE GENERATED RATHER THAN PHOTOGRAPHED
 * ------------------------------------------------
 * A stock photo standing in for a named person's face is a fabricated
 * likeness attached to a fabricated quote, which is a harder thing to walk back
 * than the quote alone. So each tile is drawn here: a deterministic gradient
 * disc carrying that person's initials. It is unmistakably a placeholder that
 * still occupies the space a portrait would, so the card layout can be judged
 * honestly at the real image size.
 *
 * REPLACE THESE BEFORE DEPLOYING
 * ------------------------------
 * Drop consented photographs into public/assets/avatars/ and point each
 * `avatar` field in app/data/testimonials.ts at the file. Square, at least
 * 256x256. The same names and quotes in that file are sample data too — see the
 * note at the top of it.
 *
 * DETERMINISM
 * -----------
 * Everything below is derived from the person's name, so re-running this writes
 * byte-identical files for unchanged input. That matters because the output is
 * committed: a script that drifted on every run would show up as noise in every
 * diff and defeat the point of reviewing it.
 */
import sharp from "sharp";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import path from "path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(root, "public/assets/avatars");

const SIZE = 256;

/**
 * Name is kept in sync with `testimonials` in app/data/testimonials.ts. This
 * script cannot import that file — it is TypeScript, and running it through a
 * loader would mean adding a build step to a script whose whole job is to have
 * none. The `avatar` field on each entry is what actually wires the two
 * together; if a name is edited here and not there, the build fails on a
 * missing image, which is the intended failure mode.
 */
const PEOPLE = [
  { slug: "anish-rai", name: "Anish Rai" },
  { slug: "sneha-adhikari", name: "Sneha Adhikari" },
  { slug: "bikash-thapa", name: "Bikash Thapa" },
  { slug: "pratiksha-shah", name: "Pratiksha Shah" },
  { slug: "nirajan-gurung", name: "Nirajan Gurung" },
  { slug: "aashma-khadka", name: "Aashma Khadka" },
];

/*
 * Drawn from the site's own palette so the tiles sit inside the theme rather
 * than introducing a second set of hues. `weight` biases how far into the list
 * the hash lands: a plain modulo would only ever use the first handful.
 */
const GRADIENTS = [
  ["#38b3f4", "#302b63"],
  ["#6dd5fa", "#2a5298"],
  ["#29b6f6", "#1a2b6b"],
  ["#4fc3f7", "#40396c"],
  ["#0288d1", "#4a3f8f"],
  ["#7dd3fc", "#252a63"],
];

function hash(input) {
  // FNV-1a. Small and well spread for short strings, which is all this gets.
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function tile({ name, slug }) {
  const seed = hash(name);
  const [from, to] = GRADIENTS[seed % GRADIENTS.length];

  // Angle in 25-degree steps, so neighbouring tiles differ visibly while the
  // set still reads as one family rather than random noise.
  const angle = (seed % 12) * 25;
  const rad = (angle * Math.PI) / 180;
  const x2 = (50 + Math.cos(rad) * 50).toFixed(1);
  const y2 = (50 + Math.sin(rad) * 50).toFixed(1);

  // Two soft highlights, offset off-centre so the disc is never symmetric.
  const h1x = 25 + (seed % 5) * 6;
  const h1y = 22 + ((seed >> 3) % 5) * 6;
  const h2x = 78 - ((seed >> 6) % 4) * 7;
  const h2y = 80 - ((seed >> 9) % 4) * 7;

  const svg = `
<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${x2}" y2="${y2}">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
    <radialGradient id="h1" cx="${h1x}%" cy="${h1y}%" r="55%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="h2" cx="${h2x}%" cy="${h2y}%" r="45%">
      <stop offset="0%" stop-color="#6dd5fa" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#6dd5fa" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)"/>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#h1)"/>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#h2)"/>
  <text x="50%" y="50%" dy="0.36em" text-anchor="middle"
    font-family="Verdana, DejaVu Sans, Arial, sans-serif" font-size="104"
    font-weight="bold" fill="#ffffff" fill-opacity="0.94">${initials(name)}</text>
</svg>`.trim();

  return { slug, svg };
}

await fs.mkdir(OUT_DIR, { recursive: true });

for (const person of PEOPLE) {
  const { slug, svg } = tile(person);
  const file = path.join(OUT_DIR, `${slug}.png`);
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(file);
  console.log(`wrote public/assets/avatars/${slug}.png`);
}

console.log(`\n${PEOPLE.length} avatars generated into public/assets/avatars/`);
