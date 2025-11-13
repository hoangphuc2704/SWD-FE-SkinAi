import axiosClient from '../services/axiosClient';

export const createUserSymptom = async (symptomData) => {
  try {
    const response = await axiosClient.post('/api/user-symptoms', symptomData);
    return response.data;
  } catch (error) {
    console.error('Error creating user symptom:', error);
    throw error;
  }
};

export const getAllSymptoms = async () => {
  try {
    const response = await axiosClient.get('/api/symptoms');
    return response.data;
  } catch (error) {
    console.error('Error fetching symptoms:', error);
    throw error;
  }
};

export const getUserSymptomsByUserId = async (userId) => {
  try {
    const response = await axiosClient.get(`/api/user-symptoms/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user symptoms:', error);
    throw error;
  }
};

export const createSymptom = async (symptomData) => {
  try {
    const response = await axiosClient.post('/api/symptoms', symptomData);
    return response.data;
  } catch (error) {
    console.error('Error creating symptom:', error);
    throw error;
  }
};

export const updateSymptom = async (id, symptomData) => {
  try {
    const response = await axiosClient.put(`/api/symptoms/${id}`, symptomData);
    return response.data;
  } catch (error) {
    console.error('Error updating symptom:', error);
    throw error;
  }
};

export const deleteSymptom = async (id) => {
  try {
    const response = await axiosClient.delete(`/api/symptoms/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting symptom:', error);
    throw error;
  }
};
