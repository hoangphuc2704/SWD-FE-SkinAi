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
