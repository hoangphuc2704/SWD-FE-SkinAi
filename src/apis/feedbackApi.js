import axiosClient from '../services/axiosClient';

// 🔹 Giai đoạn 3: Phản hồi - Create a new feedback
export const createFeedback = async (feedbackData) => {
  try {
    const response = await axiosClient.post('/api/feedbacks', feedbackData);
    return response.data;
  } catch (error) {
    console.error('Error creating feedback:', error);
    throw error;
  }
};

// 🔹 Get all feedbacks for a specific user
export const getFeedbacksByUserId = async (userId) => {
  try {
    const response = await axiosClient.get(`/api/feedbacks/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feedbacks by user ID:', error);
    throw error;
  }
};

// Spec: GET /api/feedbacks/routine/{routineId}
export const getFeedbacksByRoutineId = async (routineId) => {
  try {
    const response = await axiosClient.get(`/api/feedbacks/routine/${routineId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feedbacks by routine ID:', error);
    throw error;
  }
};

// Spec: GET /api/feedbacks/step/{stepId}
export const getFeedbacksByStepId = async (stepId) => {
  try {
    const response = await axiosClient.get(`/api/feedbacks/step/${stepId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feedbacks by step ID:', error);
    throw error;
  }
};

// 🔹 Get all feedbacks (Admin only)
export const getAllFeedbacks = async () => {
  try {
    const response = await axiosClient.get('/api/feedbacks');
    return response.data;
  } catch (error) {
    console.error('Error fetching all feedbacks:', error);
    throw error;
  }
};

// 🔹 Get feedback by ID
export const getFeedbackById = async (feedbackId) => {
  try {
    const response = await axiosClient.get(`/api/feedbacks/${feedbackId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback by ID:', error);
    throw error;
  }
};

// 🔹 Update feedback
export const updateFeedback = async (id, feedbackData) => {
  try {
    const response = await axiosClient.put(`/api/feedbacks/${id}`, feedbackData);
    return response.data;
  } catch (error) {
    console.error('Error updating feedback:', error);
    throw error;
  }
};

// 🔹 Delete feedback
export const deleteFeedback = async (id) => {
  try {
    const response = await axiosClient.delete(`/api/feedbacks/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting feedback:', error);
    throw error;
  }
};
