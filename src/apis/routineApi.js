import axiosClient from '../services/axiosClient';

export const getRoutinesByUserId = async (userId) => {
  try {
    const response = await axiosClient.get(`/api/routines/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching routines by user ID:', error);
    throw error;
  }
};

export const getAllRoutines = async () => {
  try {
    const response = await axiosClient.get('/api/routines');
    return response.data;
  } catch (error) {
    console.error('Error fetching all routines:', error);
    throw error;
  }
};

export const getRoutineById = async (routineId) => {
  try {
    const response = await axiosClient.get(`/api/routines/${routineId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching routine by ID:', error);
    throw error;
  }
};

export const createRoutine = async (routineData) => {
  try {
    const response = await axiosClient.post('/api/routines', routineData);
    return response.data;
  } catch (error) {
    console.error('Error creating routine:', error);
    throw error;
  }
};

export const updateRoutine = async (id, routineData) => {
  try {
    const response = await axiosClient.put(`/api/routines/${id}`, routineData);
    return response.data;
  } catch (error) {
    console.error('Error updating routine:', error);
    throw error;
  }
};

export const deleteRoutine = async (id) => {
  try {
    const response = await axiosClient.delete(`/api/routines/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting routine:', error);
    throw error;
  }
};
