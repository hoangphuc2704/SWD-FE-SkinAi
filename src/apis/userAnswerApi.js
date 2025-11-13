import axiosClient from '../services/axiosClient';

export const createUserAnswer = async (answerData) => {
  try {
    const response = await axiosClient.post('/api/UserAnswers', answerData);
    return response.data;
  } catch (error) {
    console.error('Error creating user answer:', error);
    throw error;
  }
};

export const getUserAnswersByUserId = async (userId) => {
  try {
    const response = await axiosClient.get(`/api/UserAnswers/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user answers:', error);
    throw error;
  }
};

export const updateUserAnswer = async (id, answerData) => {
  try {
    const response = await axiosClient.put(`/api/UserAnswers/${id}`, answerData);
    return response.data;
  } catch (error) {
    console.error('Error updating user answer:', error);
    throw error;
  }
};

export const deleteUserAnswer = async (id) => {
  try {
    const response = await axiosClient.delete(`/api/UserAnswers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user answer:', error);
    throw error;
  }
};
