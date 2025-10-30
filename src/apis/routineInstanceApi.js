import axiosClient from '../services/axiosClient';

export const createRoutineInstance = async (instanceData) => {
  try {
    const response = await axiosClient.post('/api/routine-instances', instanceData);
    return response.data;
  } catch (error) {
    console.error('Error creating routine instance:', error);
    throw error;
  }
};

export const getRoutineInstancesByUserId = async (userId) => {
  try {
    const response = await axiosClient.get(`/api/routine-instances/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching routine instances by user ID:', error);
    throw error;
  }
};

export const getRoutineInstanceById = async (instanceId) => {
  try {
    const response = await axiosClient.get(`/api/routine-instances/${instanceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching routine instance by ID:', error);
    throw error;
  }
};

export const updateRoutineInstance = async (id, instanceData) => {
  try {
    const response = await axiosClient.put(`/api/routine-instances/${id}`, instanceData);
    return response.data;
  } catch (error) {
    console.error('Error updating routine instance:', error);
    throw error;
  }
};

export const deleteRoutineInstance = async (id) => {
  try {
    const response = await axiosClient.delete(`/api/routine-instances/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting routine instance:', error);
    throw error;
  }
};
