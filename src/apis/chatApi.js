// import axiosClient from '../services/axiosClient';

// export const createChatSession = async (sessionData) => {
//   try {
//     const response = await axiosClient.post('/api/chat/sessions', sessionData);
//     return response.data;
//   } catch (error) {
//     console.error('Error creating chat session:', error);
//     throw error;
//   }
// };

// export const getChatSessionsByUserId = async (userId) => {
//   try {
//     const response = await axiosClient.get(`/api/chat/sessions/user/${userId}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching chat sessions by user ID:', error);
//     throw error;
//   }
// };

// export const getChatSessionById = async (sessionId) => {
//   try {
//     const response = await axiosClient.get(`/api/chat/sessions/${sessionId}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching chat session by ID:', error);
//     throw error;
//   }
// };

// export const createChatMessage = async (sessionId, messageData) => {
//   try {
//     const response = await axiosClient.post(
//       `/api/chat/sessions/${sessionId}/messages`,
//       messageData
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Error creating chat message:', error);
//     throw error;
//   }
// };

// export const getMessagesBySessionId = async (sessionId) => {
//   try {
//     const response = await axiosClient.get(`/api/chat/sessions/${sessionId}/messages`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching messages by session ID:', error);
//     throw error;
//   }
// };

// export const updateChatSession = async (sessionId, sessionData) => {
//   try {
//     const response = await axiosClient.put(`/api/chat/sessions/${sessionId}`, sessionData);
//     return response.data;
//   } catch (error) {
//     console.error('Error updating chat session:', error);
//     throw error;
//   }
// };

// export const deleteChatSession = async (sessionId) => {
//   try {
//     const response = await axiosClient.delete(`/api/chat/sessions/${sessionId}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error deleting chat session:', error);
//     throw error;
//   }
// };

import axiosClient from '../services/axiosClient';

/**
 * 🟢 Tạo một chat session mới
 * Endpoint: POST /api/chat/sessions
 * Body: { userId: string, title: string }
 */
export const createChatSession = async (sessionData) => {
  try {
    const response = await axiosClient.post('/api/chat/sessions', sessionData);
    return response.data;
  } catch (error) {
    console.warn('❌ Error creating chat session:', error);
    throw error;
  }
};

/**
 * 🟢 Lấy danh sách chat sessions (có thể lọc theo userId)
 * Endpoint: GET /api/chat/sessions?userId=xxx&pageNumber=1&pageSize=20
 */
export const getChatSessions = async (params = {}) => {
  try {
    const response = await axiosClient.get('/api/chat/sessions', { params });
    return response.data;
  } catch (error) {
    console.warn('❌ Error fetching chat sessions:', error);
    throw error;
  }
};

/**
 * 🟢 Lấy chi tiết 1 session
 * Endpoint: GET /api/chat/sessions/{id}?includeMessages=true/false
 */
export const getChatSessionById = async (sessionId, includeMessages = false) => {
  try {
    const response = await axiosClient.get(`/api/chat/sessions/${sessionId}`, {
      params: { includeMessages },
    });
    return response.data;
  } catch (error) {
    console.warn('❌ Error fetching chat session by ID:', error);
    throw error;
  }
};

/**
 * 🟢 Cập nhật session
 * Endpoint: PATCH /api/chat/sessions/{id}
 */
export const updateChatSession = async (sessionId, sessionData) => {
  try {
    const response = await axiosClient.patch(`/api/chat/sessions/${sessionId}`, sessionData);
    return response.data;
  } catch (error) {
    console.warn('❌ Error updating chat session:', error);
    throw error;
  }
};

/**
 * 🟢 Xoá session
 * (nếu backend chưa có thì có thể giữ lại tạm)
 */
export const deleteChatSession = async (sessionId) => {
  try {
    const response = await axiosClient.delete(`/api/chat/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    console.warn('❌ Error deleting chat session:', error);
    throw error;
  }
};

/**
 * 🟢 Tạo tin nhắn trong session
 * Endpoint: POST /api/chat/sessions/{id}/messages
 * Form fields: Content (optional), Image (file, optional), ImageUrl (optional)
 */
export const createChatMessage = async (sessionId, { content, imageFile, imageUrl } = {}) => {
  try {
    const form = new FormData();
    if (content) {
      form.append('Content', content);
    }
    if (imageFile) {
      form.append('Image', imageFile);
    }
    if (imageUrl) {
      form.append('ImageUrl', imageUrl);
    }

    const response = await axiosClient.post(`/api/chat/sessions/${sessionId}/messages`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.warn('❌ Error creating chat message:', error);
    throw error;
  }
};

/**
 * 🟢 Lấy danh sách tin nhắn trong session
 * Endpoint: GET /api/chat/sessions/{id}/messages
 */
export const getMessagesBySessionId = async (sessionId) => {
  try {
    const response = await axiosClient.get(`/api/chat/sessions/${sessionId}/messages`);
    return response.data;
  } catch (error) {
    console.warn('❌ Error fetching messages by session ID:', error);
    throw error;
  }
};

/**
 * 🟢 Lấy tin nhắn theo messageId
 * Endpoint: GET /api/chat/messages/{messageId}
 */
export const getChatMessageById = async (messageId) => {
  try {
    const response = await axiosClient.get(`/api/chat/messages/${messageId}`);
    return response.data;
  } catch (error) {
    console.warn('❌ Error fetching chat message by ID:', error);
    throw error;
  }
};

/**
 * � Specialist/Admin: danh sách phiên dành cho specialist
 * Endpoint: GET /api/chat/specialist-sessions?state=waiting_specialist|assigned&mine=true&pageNumber=&pageSize=
 * Chỉ admin/specialist gọi được.
 */
export const getSpecialistSessions = async (params = {}) => {
  try {
    const response = await axiosClient.get('/api/chat/specialist-sessions', { params });
    return response.data?.data ?? response.data;
  } catch (error) {
    console.warn('❌ Error fetching specialist sessions:', error);
    throw error;
  }
};

/**
 * 🟣 Specialist/Admin: claim/assign một session đang chờ
 * Endpoint: POST /api/chat/sessions/{sessionId}/assignments
 */
export const assignSpecialistSession = async (sessionId) => {
  try {
    const response = await axiosClient.post(`/api/chat/sessions/${sessionId}/assignments`);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.warn('❌ Error assigning specialist session:', error);
    throw error;
  }
};

/**
 * 🟣 Đóng session (admin, user owner, hoặc specialist được gán)
 * Endpoint: POST /api/chat/sessions/{sessionId}/closures
 */
export const closeChatSession = async (sessionId) => {
  try {
    const response = await axiosClient.post(`/api/chat/sessions/${sessionId}/closures`);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.warn('❌ Error closing chat session:', error);
    throw error;
  }
};

/**
 * �🟢 Upload ảnh tin nhắn (multipart/form-data)
 * Endpoint: POST /api/chat/sessions/{sessionId}/messages/upload
 */
export const uploadChatImageMessage = async (sessionId, file, params = {}) => {
  try {
    const form = new FormData();
    form.append('file', file);
    const response = await axiosClient.post(
      `/api/chat/sessions/${sessionId}/messages/upload`,
      form,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        params, // e.g., { role: 'user', messageType: 'image' }
      }
    );
    return response.data;
  } catch (error) {
    console.warn('❌ Error uploading chat image message:', error);
    throw error;
  }
};
