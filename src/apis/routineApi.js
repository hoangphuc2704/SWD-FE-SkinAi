import axiosClient from '../services/axiosClient';

export const getRoutinesByUserId = async (userId) => {
  try {
    const response = await axiosClient.get(`/api/routines/user/${userId}`);
    // Normalize shape: some BE returns { data: { items: [...] }}
    const d = response.data;
    if (d && d.data && Array.isArray(d.data.items)) {
      return { ...d, data: d.data.items };
    }
    return d;
  } catch (error) {
    if (error?.response?.status === 404) {
      return { success: true, data: [] };
    }
    console.error('Error fetching routines by user ID:', error);
    throw error;
  }
};

export const getAllRoutines = async () => {
  try {
    const response = await axiosClient.get('/api/routines');
    const d = response.data;
    // Normalize to return array of routines when paginated envelope is used
    if (d && d.data && Array.isArray(d.data.items)) {
      return d.data.items;
    }
    return d?.data ?? d;
  } catch (error) {
    console.error('Error fetching all routines:', error);
    throw error;
  }
};

export const getRoutineById = async (routineId) => {
  try {
    const response = await axiosClient.get(`/api/routines/${routineId}`);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error('Error fetching routine by ID:', error);
    throw error;
  }
};

export const createRoutine = async (routineData) => {
  try {
    const response = await axiosClient.post('/api/routines', routineData);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error('Error creating routine:', error);
    throw error;
  }
};

export const updateRoutine = async (id, routineData) => {
  try {
    const response = await axiosClient.put(`/api/routines/${id}`, routineData);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error('Error updating routine:', error);
    throw error;
  }
};

export const deleteRoutine = async (id) => {
  try {
    const response = await axiosClient.delete(`/api/routines/${id}`);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error('Error deleting routine:', error);
    throw error;
  }
};
