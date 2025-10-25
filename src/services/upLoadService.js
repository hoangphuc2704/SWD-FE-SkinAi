export async function uploadImageToCloudinary(file, folder = '') {
  if (!file) throw new Error('No file provided');

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();

  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  if (folder) formData.append('folder', folder);

  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || 'Cloudinary upload failed');
  }

  const data = await res.json();
  // data.secure_url là link trả về
  return data;
}
