import axiosClient from '../services/axiosClient';

export const createAIAnalysis = async (analysisData) => {
  try {
    const response = await axiosClient.post('/api/ai/analysis', analysisData);
    return response.data;
  } catch (error) {
    const status = error?.response?.status;
    // Soft-fail on expected validation issues; caller may proceed without analysis id
    if (status === 400 || status === 404) {
      console.warn('AI analysis not created (soft-fail):', {
        status,
        data: error?.response?.data,
      });
      return null;
    }
    console.error('Error creating AI analysis:', error);
    throw error;
  }
};

// Spec: GET /api/ai/analysis/message/{messageId}
export const getAIAnalysisByMessageId = async (messageId) => {
  try {
    const response = await axiosClient.get(`/api/ai/analysis/message/${messageId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching AI analysis by message ID:', error);
    throw error;
  }
};

// Spec: GET /api/ai/analysis/session/{sessionId}
export const getAIAnalysesBySessionId = async (sessionId) => {
  try {
    const response = await axiosClient.get(`/api/ai/analysis/session/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching AI analyses by session ID:', error);
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

// Spec: GET /api/ai/responses/query/{queryId}
export const getAIResponsesByQueryId = async (queryId) => {
  try {
    const response = await axiosClient.get(`/api/ai/responses/query/${queryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching AI responses by query ID:', error);
    throw error;
  }
};

// Note: Spec doesn't expose DELETE for analysis/responses; keep removals separate if backend supports
