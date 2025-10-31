import axiosClient from '../services/axiosClient';
export const createUser = async (userData) => {
  try {
    const response = await axiosClient.post('/api/users', userData);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async () => {
  try {
    const response = await axiosClient.get('/api/users/me');
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateProfile = async (id, userData) => {
  try {
    const response = await axiosClient.put(`/api/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUsers = async (pageNumber = 1, pageSize = 10) => {
  try {
    const response = await axiosClient.get('/api/users', {
      params: { pageNumber, pageSize },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
