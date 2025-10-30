import axiosClient from '../services/axiosClient';

export const getAllQuestions = async () => {
  try {
    const response = await axiosClient.get('/api/Questions');
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

export const createQuestion = async (questionData) => {
  try {
    const response = await axiosClient.post('/api/Questions', questionData);
    return response.data;
  } catch (error) {
    console.error('Error creating question:', error);
    throw error;
  }
};

export const updateQuestion = async (id, questionData) => {
  try {
    const response = await axiosClient.put(`/api/Questions/${id}`, questionData);
    return response.data;
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
};

export const deleteQuestion = async (id) => {
  try {
    const response = await axiosClient.delete(`/api/Questions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};
