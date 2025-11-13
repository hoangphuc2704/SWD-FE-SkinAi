import axiosClient from '../services/axiosClient';

export const createConsentRecord = async (consentData) => {
  try {
    const response = await axiosClient.post('/api/ConsentRecords', consentData);
    return response.data;
  } catch (error) {
    console.error('Error creating consent record:', error);
    throw error;
  }
};

export const getConsentRecordsByUserId = async (userId) => {
  try {
    const response = await axiosClient.get(`/api/ConsentRecords/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching consent records:', error);
    throw error;
  }
};

export const getAllConsentRecords = async () => {
  try {
    const response = await axiosClient.get('/api/ConsentRecords');
    return response.data;
  } catch (error) {
    console.error('Error fetching all consent records:', error);
    throw error;
  }
};

// Spec: GET /api/ConsentRecords/{id}
export const getConsentRecordById = async (id) => {
  try {
    const response = await axiosClient.get(`/api/ConsentRecords/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching consent record by ID:', error);
    throw error;
  }
};

// Spec: PUT /api/ConsentRecords/{id}
export const updateConsentRecord = async (id, updateData) => {
  try {
    const response = await axiosClient.put(`/api/ConsentRecords/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating consent record:', error);
    throw error;
  }
};

// Spec: DELETE /api/ConsentRecords/{id}
export const deleteConsentRecord = async (id) => {
  try {
    const response = await axiosClient.delete(`/api/ConsentRecords/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting consent record:', error);
    throw error;
  }
};
