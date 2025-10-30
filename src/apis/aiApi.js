import axiosClient from '../services/axiosClient';

export const createAIAnalysis = async (analysisData) => {
  try {
    const response = await axiosClient.post('/api/ai/analysis', analysisData);
    return response.data;
  } catch (error) {
    console.error('Error creating AI analysis:', error);
    throw error;
  }
};

export const getAIAnalysisById = async (analysisId) => {
  try {
    const response = await axiosClient.get(`/api/ai/analysis/${analysisId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching AI analysis by ID:', error);
    throw error;
  }
};

export const getAIAnalysesByUserId = async (userId) => {
  try {
    const response = await axiosClient.get(`/api/ai/analysis/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching AI analyses by user ID:', error);
    throw error;
  }
};

export const createAIResponse = async (responseData) => {
  try {
    const response = await axiosClient.post('/api/ai/responses', responseData);
    return response.data;
  } catch (error) {
    console.error('Error creating AI response:', error);
    throw error;
  }
};

export const getAIResponseById = async (responseId) => {
  try {
    const response = await axiosClient.get(`/api/ai/responses/${responseId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching AI response by ID:', error);
    throw error;
  }
};

export const getAIResponsesByAnalysisId = async (analysisId) => {
  try {
    const response = await axiosClient.get(`/api/ai/responses/analysis/${analysisId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching AI responses by analysis ID:', error);
    throw error;
  }
};

export const deleteAIAnalysis = async (analysisId) => {
  try {
    const response = await axiosClient.delete(`/api/ai/analysis/${analysisId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting AI analysis:', error);
    throw error;
  }
};

export const deleteAIResponse = async (responseId) => {
  try {
    const response = await axiosClient.delete(`/api/ai/responses/${responseId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting AI response:', error);
    throw error;
  }
};
