import axiosClient from '../services/axiosClient';

export const createRoutineProgress = async (progressData) => {
  try {
    const response = await axiosClient.post('/api/routine-progress', progressData);
    return response.data;
  } catch (error) {
    console.error('Error creating routine progress:', error);
    throw error;
  }
};

export const getRoutineProgressByInstanceId = async (instanceId) => {
  try {
    const response = await axiosClient.get(`/api/routine-progress/instance/${instanceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching routine progress by instance ID:', error);
    throw error;
  }
};

export const getAllRoutineProgress = async () => {
  try {
    const response = await axiosClient.get('/api/routine-progress');
    return response.data;
  } catch (error) {
    console.error('Error fetching all routine progress:', error);
    throw error;
  }
};

export const updateRoutineProgress = async (id, progressData) => {
  try {
    const response = await axiosClient.put(`/api/routine-progress/${id}`, progressData);
    return response.data;
  } catch (error) {
    console.error('Error updating routine progress:', error);
    throw error;
  }
};

export const deleteRoutineProgress = async (id) => {
  try {
    const response = await axiosClient.delete(`/api/routine-progress/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting routine progress:', error);
    throw error;
  }
};
