const uploadToCloudinary = async (file, { folder = '', resourceType = 'auto' } = {}) => {
  if (!file) throw new Error('No file provided');

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Missing Cloudinary configuration');
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
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

  return res.json();
};

export const uploadImageToCloudinary = (file, folder = '') =>
  uploadToCloudinary(file, { folder, resourceType: 'image' });

export const uploadFileToCloudinary = (file, folder = '', resourceType = 'auto') =>
  uploadToCloudinary(file, { folder, resourceType });
