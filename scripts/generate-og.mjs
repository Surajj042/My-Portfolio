/**
 * Generates public/assets/og-image.png (1200x630) used for Open Graph /
 * Twitter card previews when the portfolio URL is shared.
 *
 * Usage: node scripts/generate-og.mjs
 */
import sharp from "sharp";
import { fileURLToPath } from "url";
import path from "path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const W = 1200;
const H = 630;

// Crop the portrait photo for the right side of the banner
const photo = await sharp(path.join(root, "public/assets/p.jpg"))
  .resize(560, H, { fit: "cover", position: "attention" })
  .png()
  .toBuffer();

const overlay = Buffer.from(`
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0d1b2a"/>
        <stop offset="55%" stop-color="#1e3c72"/>
        <stop offset="100%" stop-color="#2a5298"/>
      </linearGradient>
      <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#16335e" stop-opacity="1"/>
        <stop offset="100%" stop-color="#16335e" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <circle cx="170" cy="60" r="240" fill="#6dd5fa" opacity="0.10"/>
    <circle cx="470" cy="620" r="240" fill="#302b63" opacity="0.30"/>
    <rect x="600" y="0" width="60" height="${H}" fill="url(#fade)"/>
    <text x="80" y="270" font-family="Poppins, Verdana, Arial, sans-serif"
      font-size="76" font-weight="800" fill="#ffffff">Suraj Gurung</text>
    <text x="80" y="345" font-family="Verdana, Arial, sans-serif"
      font-size="36" font-weight="600" fill="#6dd5fa">Full Stack Developer</text>
    <text x="80" y="425" font-family="Verdana, Arial, sans-serif"
      font-size="24" fill="#c9d6e5">React · Next.js · Node.js · Java · TypeScript</text>
    <text x="80" y="540" font-family="Verdana, Arial, sans-serif"
      font-size="24" fill="#8fa3b8">suraj-gurung.com.np</text>
  </svg>
`);

await sharp({
  create: { width: W, height: H, channels: 4, background: "#0d1b2a" },
})
  .composite([
    { input: photo, left: 640, top: 0 },
    { input: overlay, left: 0, top: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(path.join(root, "public/assets/og-image.png"));

console.log("✅ og-image.png generated (1200x630)");
