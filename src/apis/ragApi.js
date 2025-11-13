import axiosClient from '../services/axiosClient';

// POST /rag/search
export const searchRag = async (payload) => {
  try {
    const response = await axiosClient.post('/rag/search', payload);
    return response.data;
  } catch (error) {
    console.error('Error performing RAG search:', error);
    throw error;
  }
};
