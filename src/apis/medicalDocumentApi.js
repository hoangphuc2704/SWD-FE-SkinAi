import axiosClient from '../services/axiosClient';

export const getAllMedicalDocuments = async () => {
  try {
    const response = await axiosClient.get('/api/MedicalDocuments');
    return response.data;
  } catch (error) {
    console.error('Error fetching all medical documents:', error);
    throw error;
  }
};

export const getMedicalDocumentById = async (documentId) => {
  try {
    const response = await axiosClient.get(`/api/MedicalDocuments/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching medical document by ID:', error);
    throw error;
  }
};

export const createMedicalDocument = async (documentData) => {
  try {
    const response = await axiosClient.post('/api/MedicalDocuments', documentData);
    return response.data;
  } catch (error) {
    console.error('Error creating medical document:', error);
    throw error;
  }
};

export const updateMedicalDocument = async (id, documentData) => {
  try {
    const response = await axiosClient.put(`/api/MedicalDocuments/${id}`, documentData);
    return response.data;
  } catch (error) {
    console.error('Error updating medical document:', error);
    throw error;
  }
};

export const deleteMedicalDocument = async (id) => {
  try {
    const response = await axiosClient.delete(`/api/MedicalDocuments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting medical document:', error);
    throw error;
  }
};
