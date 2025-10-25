import axiosClient from '../services/axiosClient';

const authApi = {
  loginWithGoogle: async (data) => {
    try {
      console.log('Sending Google login data:', data);
      const response = await axiosClient.post('/api/auth/providers/google/token', data);
      return response;
    } catch (error) {
      console.error('Google login API error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },
};

export default authApi;
