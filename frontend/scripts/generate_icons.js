import sharp from 'sharp';
import fs from 'fs';

const svg = `
<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
  <g transform="translate(40, 40)">
    <ellipse cx="0" cy="-18" rx="11" ry="18" fill="#F8B6B6" />
    <ellipse cx="0" cy="-18" rx="11" ry="18" fill="#F8B6B6" transform="rotate(60)" />
    <ellipse cx="0" cy="-18" rx="11" ry="18" fill="#F8B6B6" transform="rotate(120)" />
    <ellipse cx="0" cy="-18" rx="11" ry="18" fill="#F8B6B6" transform="rotate(180)" />
    <ellipse cx="0" cy="-18" rx="11" ry="18" fill="#F8B6B6" transform="rotate(240)" />
    <ellipse cx="0" cy="-18" rx="11" ry="18" fill="#F8B6B6" transform="rotate(300)" />
    
    <circle cx="0" cy="0" r="7" fill="#F6A58E" />
    <circle cx="0" cy="0" r="3" fill="#FFFBF0" />
  </g>
</svg>
`;

async function generate() {
  const publicDir = '../public';
  
  // favicon.svg
  fs.writeFileSync(`${publicDir}/favicon.svg`, svg);

  // 16x16 png (for standard favicon if needed)
  await sharp(Buffer.from(svg))
    .resize(16, 16)
    .toFile(`${publicDir}/favicon-16x16.png`);

  // 32x32 png
  await sharp(Buffer.from(svg))
    .resize(32, 32)
    .toFile(`${publicDir}/favicon-32x32.png`);

  // 180x180 apple touch icon
  await sharp(Buffer.from(svg))
    .resize(180, 180)
    .toFile(`${publicDir}/apple-touch-icon.png`);

  // generate a small ico file (sharp can't natively output ico without a bit of work, but we can just use the pngs or svg)
  // Actually, I can just copy favicon-32x32.png to favicon.ico as a fallback, modern browsers support it or we can just update index.html to use svg and png.
  fs.copyFileSync(`${publicDir}/favicon-32x32.png`, `${publicDir}/favicon.ico`);
  
  console.log('Icons generated successfully.');
}

generate().catch(console.error);
