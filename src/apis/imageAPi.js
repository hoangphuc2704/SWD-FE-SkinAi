import axiosClient from '../services/axiosClient';

const imageApi = {
  saveImage: (payload) => axiosClient.post('/images', payload), // payload { url, public_id, folder, ownerId... }
};

export default imageApi;
