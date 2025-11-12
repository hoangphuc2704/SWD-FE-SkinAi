import axiosClient from '../services/axiosClient';

// GET /api/MedicalDocumentAssets/{assetId}
export const getMedicalDocumentAssetById = async (assetId) => {
  try {
    const response = await axiosClient.get(`/api/MedicalDocumentAssets/${assetId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching medical document asset by ID:', error);
    throw error;
  }
};

// GET /api/MedicalDocumentAssets/document/{documentId}
export const getMedicalDocumentAssetsByDocumentId = async (documentId) => {
  try {
    const response = await axiosClient.get(`/api/MedicalDocumentAssets/document/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching assets by document ID:', error);
    throw error;
  }
};

// POST /api/MedicalDocumentAssets (JSON with fileUrl/publicId, etc.)
export const createMedicalDocumentAsset = async (assetData) => {
  try {
    const response = await axiosClient.post('/api/MedicalDocumentAssets', assetData);
    return response.data;
  } catch (error) {
    console.error('Error creating medical document asset:', error);
    throw error;
  }
};

// POST /api/MedicalDocumentAssets/{documentId}/upload (multipart)
export const uploadMedicalDocumentAsset = async (documentId, file) => {
  try {
    const form = new FormData();
    form.append('file', file);
    const response = await axiosClient.post(
      `/api/MedicalDocumentAssets/${documentId}/upload`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading medical document asset:', error);
    throw error;
  }
};

// PUT /api/MedicalDocumentAssets/{assetId}
export const updateMedicalDocumentAsset = async (assetId, updateData) => {
  try {
    const response = await axiosClient.put(`/api/MedicalDocumentAssets/${assetId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating medical document asset:', error);
    throw error;
  }
};

// DELETE /api/MedicalDocumentAssets/{assetId}?publicId=...
export const deleteMedicalDocumentAsset = async (assetId, publicId) => {
  try {
    const response = await axiosClient.delete(`/api/MedicalDocumentAssets/${assetId}`, {
      params: publicId ? { publicId } : {},
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting medical document asset:', error);
    throw error;
  }
};
