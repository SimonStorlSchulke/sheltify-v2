import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageConverterService {

  private sizes: [string, number][] = [
    ["thumbnail", 150],
    ["small", 320],
    ["medium", 640],
    ["large", 1280],
    ["xlarge", 1920],
  ];

  public async generateAllSizes(image: File) {
    const img = new Image();
    img.src = URL.createObjectURL(image);

    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
    });

    let largestAvailableSize = "thumbnail";
    for (const size of this.sizes) {
      if (img.width >= size[1]) {
        largestAvailableSize = size[0];
      }
    }

    const images: {size: string, blob: Blob}[] = [];
    for (const size of this.sizes) {
      images.push({size: size[0], blob: await this.toScaledWebP(img, size[1])});
      if (size[0] == largestAvailableSize) break;
    }
    return images;
  }

  public async toScaledWebP(
    img: HTMLImageElement,
    width: number): Promise<Blob> {
    try {

      // Create a canvas element to draw the image
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Unable to obtain 2D rendering context.");
      }

      const aspectRatio = img.height / img.width

      // Set the canvas dimensions to match the image dimensions
      canvas.width = width;
      canvas.height = Math.ceil(width * aspectRatio);

      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0, width, Math.ceil(width * aspectRatio));

      // Convert the canvas content to a WebP Blob
      const webpBlob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              throw new Error("Failed to convert to WebP format.");
            }
          },
          "image/webp",
          0.85
        );
      });

      return webpBlob;
    } catch (error) {
      throw error;
    }
  }
}

