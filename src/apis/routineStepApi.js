import axiosClient from '../services/axiosClient';

export const getRoutineStepsByRoutineId = async (routineId) => {
  try {
    const response = await axiosClient.get(`/api/routine-steps/routine/${routineId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching routine steps:', error);
    throw error;
  }
};

export const getAllRoutineSteps = async () => {
  try {
    const response = await axiosClient.get('/api/routine-steps');
    return response.data;
  } catch (error) {
    console.error('Error fetching all routine steps:', error);
    throw error;
  }
};

export const getRoutineStepById = async (stepId) => {
  try {
    const response = await axiosClient.get(`/api/routine-steps/${stepId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching routine step by ID:', error);
    throw error;
  }
};

export const createRoutineStep = async (stepData) => {
  try {
    const response = await axiosClient.post('/api/routine-steps', stepData);
    return response.data;
  } catch (error) {
    console.error('Error creating routine step:', error);
    throw error;
  }
};

export const updateRoutineStep = async (id, stepData) => {
  try {
    const response = await axiosClient.put(`/api/routine-steps/${id}`, stepData);
    return response.data;
  } catch (error) {
    console.error('Error updating routine step:', error);
    throw error;
  }
};

export const deleteRoutineStep = async (id) => {
  try {
    const response = await axiosClient.delete(`/api/routine-steps/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting routine step:', error);
    throw error;
  }
};
