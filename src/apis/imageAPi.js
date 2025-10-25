import axiosClient from '../services/axiosClient';

const imageApi = {
  saveImage: (payload) => axiosClient.post('/images', payload),
};

export default imageApi;
