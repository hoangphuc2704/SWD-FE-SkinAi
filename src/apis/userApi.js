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

// Get specific user by ID (Admin)
export const getUserById = async (id) => {
  try {
    const response = await axiosClient.get(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateProfile = async (id, userData) => {
  try {
    const response = await axiosClient.put(`/api/users/${id}/profile`, userData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Update current logged-in user's profile (self-service)
export const updateMyProfile = async (userData) => {
  try {
    const response = await axiosClient.put('/api/users/me', userData);
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

// Admin: Update user by ID
export const updateUser = async (id, userData) => {
  try {
    const response = await axiosClient.put(`/api/users/${id}`, userData);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Admin: Delete (soft delete) user by ID
export const deleteUser = async (id) => {
  try {
    const response = await axiosClient.delete(`/api/users/${id}`);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
