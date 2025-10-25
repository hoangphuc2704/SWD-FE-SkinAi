import axiosClient from '../services/axiosClient';
export const createUser = async (userData) => {
  try {
    const response = await axiosClient.post('/api/users', userData);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
