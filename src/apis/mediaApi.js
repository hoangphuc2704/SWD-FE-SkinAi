import axiosClient from '../services/axiosClient';

// POST /api/media/upload (multipart)
export const uploadMedia = async (file, folder) => {
  try {
    const form = new FormData();
    form.append('file', file);
    const response = await axiosClient.post('/api/media/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: folder ? { folder } : {},
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
};

// DELETE /api/media/{publicId}
export const deleteMedia = async (publicId) => {
  try {
    const response = await axiosClient.delete(`/api/media/${publicId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting media:', error);
    throw error;
  }
};
