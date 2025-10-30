import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../../../../apis/userApi';
import { createChatSession, createChatMessage } from '../../../../apis/chatApi';
import { createAIResponse } from '../../../../apis/aiApi';
import { createUserSymptom } from '../../../../apis/symptomApi';

/**
 * Custom hook để quản lý chat session và messages
 */
export const useChatSession = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chatSession, setChatSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState('');
  const [selectedSkinType, setSelectedSkinType] = useState('');
  const [aiAnalysisId, setAiAnalysisId] = useState(null);

  // Khởi tạo chat session
  useEffect(() => {
    const initChat = async () => {
      try {
        const profileData = await getProfile();
        console.log('User profile:', profileData);
        setUser(profileData.data);

        // Thêm tin nhắn chào mừng
        const welcomeMsg = {
          role: 'assistant',
          content:
            'Xin chào! Tôi là AI tư vấn chăm sóc da. Bạn có thể:\n\n1. Chụp ảnh da của bạn để tôi phân tích\n2. Chọn vấn đề da bạn đang gặp phải\n3. Cho tôi biết loại da của bạn\n\nHãy bắt đầu nhé! 😊',
          timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMsg]);

        // Tạo chat session
        try {
          const sessionData = await createChatSession({
            userId: profileData.data.id,
            title: 'Tư vấn chăm sóc da',
          });
          console.log('Chat session created:', sessionData);
          setChatSession(sessionData.data);
        } catch (sessionError) {
          console.warn('Could not create chat session, will work without it:', sessionError);
          // Tạo mock session để app vẫn hoạt động
          setChatSession({
            id: 'mock-session-' + Date.now(),
            userId: profileData.data.id,
            title: 'Tư vấn chăm sóc da',
          });
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    initChat();
  }, [navigate]);

  // Gửi tin nhắn text
  const sendMessage = async (messageText) => {
    if (!messageText.trim() || !chatSession || loading) return;

    const userMessage = messageText.trim();
    setLoading(true);

    try {
      // Thêm tin nhắn user
      const userMsg = {
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);

      // Lưu vào database
      await createChatMessage(chatSession.id, {
        role: 'user',
        content: userMessage,
      });

      // Giả lập phản hồi AI
      setTimeout(async () => {
        let aiResponse = '';

        // Kiểm tra nếu user hỏi về lộ trình
        if (
          userMessage.toLowerCase().includes('lộ trình') ||
          userMessage.toLowerCase().includes('routine') ||
          userMessage.toLowerCase().includes('có')
        ) {
          aiResponse = `Tuyệt vời! Tôi sẽ tạo lộ trình chăm sóc da phù hợp cho bạn.

📋 **Lộ trình chăm sóc da cho ${selectedSkinType || 'da của bạn'}:**

**Buổi sáng:**
1. Làm sạch da với sữa rửa mặt nhẹ nhàng
2. Toner cân bằng pH
3. Serum Vitamin C (chống oxy hóa)
4. Kem dưỡng ẩm
5. Kem chống nắng SPF 50+

**Buổi tối:**
1. Tẩy trang (nếu có makeup)
2. Sữa rửa mặt làm sạch sâu
3. Toner
4. Serum điều trị (${selectedProblem || 'phù hợp với vấn đề da'})
5. Kem dưỡng đêm

Bạn có muốn tôi lưu lộ trình này vào hệ thống để theo dõi tiến trình không?`;
        } else {
          aiResponse = `Cảm ơn bạn đã chia sẻ! Dựa trên thông tin:
- Loại da: ${selectedSkinType || 'Chưa xác định'}
- Vấn đề: ${selectedProblem || 'Chưa xác định'}

Tôi khuyên bạn nên:
1. Chụp ảnh da để tôi phân tích chính xác hơn
2. Chọn loại da và vấn đề da bên phải
3. Sau đó tôi sẽ tạo lộ trình chăm sóc da chi tiết cho bạn

Bạn có câu hỏi gì khác không?`;
        }

        const assistantMsg = {
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMsg]);

        // Lưu AI response
        if (aiAnalysisId) {
          await createAIResponse({
            analysisId: aiAnalysisId,
            responseText: aiResponse,
            confidence: 0.9,
          });
        }

        await createChatMessage(chatSession.id, {
          role: 'assistant',
          content: aiResponse,
        });

        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
    }
  };

  // Chọn vấn đề da
  const selectProblem = async (problem) => {
    setSelectedProblem(problem);

    if (!chatSession) return;

    // Gửi tin nhắn tự động
    const msg = {
      role: 'user',
      content: `Vấn đề da của tôi: ${problem}`,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);

    await createChatMessage(chatSession.id, {
      role: 'user',
      content: `Vấn đề da của tôi: ${problem}`,
    });

    // Lưu symptom
    try {
      await createUserSymptom({
        userId: user.id,
        symptomName: problem,
        severity: 'moderate',
      });
    } catch (error) {
      console.error('Error saving symptom:', error);
    }

    // Phản hồi AI
    setTimeout(async () => {
      const response = `Tôi hiểu rồi! Bạn đang gặp vấn đề về ${problem}. ${
        selectedSkinType
          ? 'Hãy chụp ảnh da để tôi phân tích chi tiết hơn nhé!'
          : 'Bạn có thể cho tôi biết loại da của bạn không?'
      }`;

      const assistantMsg = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      await createChatMessage(chatSession.id, {
        role: 'assistant',
        content: response,
      });
    }, 1000);
  };

  // Chọn loại da
  const selectSkinType = async (skinType) => {
    setSelectedSkinType(skinType);

    if (!chatSession) return;

    const msg = {
      role: 'user',
      content: `Loại da của tôi: ${skinType}`,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);

    await createChatMessage(chatSession.id, {
      role: 'user',
      content: `Loại da của tôi: ${skinType}`,
    });

    // Phản hồi AI
    setTimeout(async () => {
      const response = `Tuyệt vời! Tôi đã ghi nhận loại da của bạn là ${skinType}. ${
        selectedProblem
          ? 'Bây giờ hãy chụp ảnh da để tôi phân tích và tạo lộ trình chăm sóc phù hợp nhé!'
          : 'Bạn có thể cho tôi biết vấn đề da bạn đang gặp phải không?'
      }`;

      const assistantMsg = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      await createChatMessage(chatSession.id, {
        role: 'assistant',
        content: response,
      });
    }, 1000);
  };

  // Thêm message vào chat
  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  return {
    user,
    chatSession,
    messages,
    loading,
    selectedProblem,
    selectedSkinType,
    aiAnalysisId,
    setLoading,
    setAiAnalysisId,
    sendMessage,
    selectProblem,
    selectSkinType,
    addMessage,
  };
};

