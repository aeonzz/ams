'use server'

import { fromBuffer } from 'pdf2pic'
import sharp from 'sharp'

export async function convertPdfToImage(pdfBuffer: Buffer): Promise<string> {
  const options = {
    density: 300,
    format: "png",
    width: 2000,
    height: 2000
  };

  const convert = fromBuffer(pdfBuffer, options);
  
  try {
    const result = await convert.bulk(-1);
    
    // If there's more than one page, we'll combine them vertically
    if (result.length > 1) {
      const images = await Promise.all(result.map(page => sharp(page.buffer).toBuffer()));
      const combinedImage = await sharp(images[0])
        .composite(images.slice(1).map((buffer, i) => ({ input: buffer, top: (i + 1) * 2000 })))
        .toBuffer();
      
      return `data:image/png;base64,${combinedImage.toString('base64')}`;
    } else {
      return `data:image/png;base64,${result[0].buffer.toString('base64')}`;
    }
  } catch (error) {
    console.error("Error converting PDF to image:", error);
    throw new Error("Failed to convert PDF to image");
  }
}

