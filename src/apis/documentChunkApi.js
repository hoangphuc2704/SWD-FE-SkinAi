import axiosClient from '../services/axiosClient';

// 🔹 Get all document chunks
export const getAllDocumentChunks = async () => {
  try {
    const response = await axiosClient.get('/api/DocumentChunks');
    return response.data;
  } catch (error) {
    console.error('Error fetching all document chunks:', error);
    throw error;
  }
};

// 🔹 Get document chunks by document ID
export const getDocumentChunksByDocumentId = async (documentId) => {
  try {
    const response = await axiosClient.get(`/api/DocumentChunks/document/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching document chunks by document ID:', error);
    throw error;
  }
};

// 🔹 Get document chunk by ID
export const getDocumentChunkById = async (chunkId) => {
  try {
    const response = await axiosClient.get(`/api/DocumentChunks/${chunkId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching document chunk by ID:', error);
    throw error;
  }
};

// 🔹 Admin only - Create document chunk
export const createDocumentChunk = async (chunkData) => {
  try {
    const response = await axiosClient.post('/api/DocumentChunks', chunkData);
    return response.data;
  } catch (error) {
    console.error('Error creating document chunk:', error);
    throw error;
  }
};

// 🔹 Admin only - Update document chunk
export const updateDocumentChunk = async (id, chunkData) => {
  try {
    const response = await axiosClient.put(`/api/DocumentChunks/${id}`, chunkData);
    return response.data;
  } catch (error) {
    console.error('Error updating document chunk:', error);
    throw error;
  }
};

// 🔹 Admin only - Delete document chunk
export const deleteDocumentChunk = async (id) => {
  try {
    const response = await axiosClient.delete(`/api/DocumentChunks/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting document chunk:', error);
    throw error;
  }
};

