// Script to remove white background from an image using sharp
// Makes white/near-white pixels transparent

import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const INPUT = resolve('public/images/icon_apparence.png');
const OUTPUT = resolve('public/images/icon_apparence_nobg.png');

const THRESHOLD = 240; // pixels with R,G,B all above this are considered "white"

async function removeBg() {
  const image = sharp(INPUT);
  const { width, height, channels } = await image.metadata();
  
  // Get raw pixel data
  const rawBuffer = await image.ensureAlpha().raw().toBuffer();
  
  const pixelCount = width * height;
  
  for (let i = 0; i < pixelCount; i++) {
    const offset = i * 4; // RGBA
    const r = rawBuffer[offset];
    const g = rawBuffer[offset + 1];
    const b = rawBuffer[offset + 2];
    
    // If pixel is near-white, make it transparent
    if (r >= THRESHOLD && g >= THRESHOLD && b >= THRESHOLD) {
      rawBuffer[offset + 3] = 0; // Set alpha to 0
    }
  }
  
  await sharp(rawBuffer, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(OUTPUT);
  
  console.log(`✅ Background removed! Saved to: ${OUTPUT}`);
}

removeBg().catch(console.error);
