/**
 * Utility for reading and compressing local image files selected from computer / folder.
 * Produces crisp, web-optimized Data URLs suitable for instant rendering and local storage.
 */
export function processImageFile(file, options = {}) {
  const { maxWidth = 1200, maxHeight = 1200, quality = 0.85 } = options;

  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image. Please choose a JPG, PNG, or WEBP file.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read file from your device.'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not parse image data.'));
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Use image/jpeg for photos, keep PNG if transparency exists or small file
          const format = file.type === 'image/png' && file.size < 500000 ? 'image/png' : 'image/jpeg';
          const dataUrl = canvas.toDataURL(format, quality);
          resolve(dataUrl);
        } catch (err) {
          // Fallback to raw data url if canvas operations fail
          resolve(event.target.result);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}
