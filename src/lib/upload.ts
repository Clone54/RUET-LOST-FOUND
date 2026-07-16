import imageCompression from 'browser-image-compression';

export async function uploadImage(file: File): Promise<string> {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("ImgBB API key is not configured.");
  }

  try {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    const compressedFile = await imageCompression(file, options);

    const formData = new FormData();
    formData.append('image', compressedFile);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error.message || "Failed to upload image");
    }
  } catch (error) {
    console.error('Error compressing or uploading image:', error);
    throw error;
  }
}
