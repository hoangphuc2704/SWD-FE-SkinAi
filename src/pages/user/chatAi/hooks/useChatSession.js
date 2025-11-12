import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../../../../apis/userApi';
import { createChatSession, createChatMessage } from '../../../../apis/chatApi';
import { submitConsultation } from '../../../../apis/consultationApi';
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
  const initializedRef = useRef(false);

  // Khởi tạo chat session
  useEffect(() => {
    const initChat = async () => {
      // Prevent double initialization in React Strict Mode (DEV)
      if (initializedRef.current) return;
      initializedRef.current = true;
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

        // Không gọi consultation ở init; chỉ hiển thị welcome. Consultation sẽ được gọi khi user gửi câu hỏi/nhấn phân tích ảnh.
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
    const isMockSession = chatSession?.id?.startsWith('mock-session-');

    try {
      // Thêm tin nhắn user
      const userMsg = {
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);

      // Lưu vào database (nếu session không phải mock)
      if (!isMockSession) {
        try {
          await createChatMessage(chatSession.id, {
            role: 'user',
            content: userMessage,
          });
        } catch (e) {
          console.warn('Skip saving user message (chat session not found or API error):', e);
        }
      }

      // Gọi BE Consultation để phân tích câu hỏi (GenerateRoutine=false)
      try {
        const result = await submitConsultation({
          text: userMessage,
          generateRoutine: true,
        });

        const d = result?.data || {};
        const advice = d.advice || {};
        const summary = advice.summary || 'Mình đã tiếp nhận câu hỏi của bạn.';

        // Lưu lại analysisId nếu có
        if (d.analysisId) setAiAnalysisId(d.analysisId);

        // Nếu BE đã tạo lộ trình thì hỏi người dùng có muốn chuyển để xem không
        if (d.routineGenerated && d.routineId) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: `Tóm tắt tư vấn: ${summary}\n\nMình vừa tạo lộ trình chăm sóc da cho bạn. Bạn có muốn xem lộ trình ngay bây giờ không?`,
              actions: [
                { id: 'open-routine', label: 'Xem lộ trình' },
                { id: 'decline-open', label: 'Để sau' },
              ],
              meta: { routineId: d.routineId, userId: (user && user.id) || undefined },
              timestamp: new Date().toISOString(),
            },
          ]);
        } else {
          // Trường hợp hiếm khi BE chưa tạo kịp, vẫn hiển thị tóm tắt
          const assistantMsg = {
            role: 'assistant',
            content: `Tóm tắt tư vấn: ${summary}`,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
        }

        // Lưu AI response (best-effort)
        if (aiAnalysisId || d.analysisId) {
          try {
            await createAIResponse({
              analysisId: d.analysisId || aiAnalysisId,
              responseText: summary,
              confidence: d.confidence || 0.9,
            });
          } catch (e) {
            console.warn('Skip saving AI response (AI API error):', e);
          }
        }

        if (!isMockSession) {
          try {
            await createChatMessage(chatSession.id, {
              role: 'assistant',
              content: summary,
            });
          } catch (e) {
            console.warn('Skip saving assistant message (chat session not found or API error):', e);
          }
        }

        // KHÔNG tự động chuyển trang. Việc mở lộ trình sẽ do người dùng bấm nút "Xem lộ trình".
      } catch {
        // Nếu consultation lỗi, vẫn tiếp tục UI mượt mà
        const fallback = `Cảm ơn bạn! Mình đang cập nhật hệ thống, bạn có thể tiếp tục chụp ảnh để phân tích hoặc chọn vấn đề/loại da ở panel bên phải.`;
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: fallback, timestamp: new Date().toISOString() },
        ]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
    }
  };

  // Chọn vấn đề da
  const selectProblem = async (problem) => {
    setSelectedProblem(problem);

    if (!chatSession) return;
    const isMockSession = chatSession?.id?.startsWith('mock-session-');

    // Gửi tin nhắn tự động
    const msg = {
      role: 'user',
      content: `Vấn đề da của tôi: ${problem}`,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);

    if (!isMockSession) {
      try {
        await createChatMessage(chatSession.id, {
          role: 'user',
          content: `Vấn đề da của tôi: ${problem}`,
        });
      } catch (e) {
        console.warn('Skip saving problem selection message:', e);
      }
    }

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

      if (!isMockSession) {
        try {
          await createChatMessage(chatSession.id, {
            role: 'assistant',
            content: response,
          });
        } catch (e) {
          console.warn('Skip saving assistant response (problem):', e);
        }
      }
    }, 1000);
  };

  // Chọn loại da
  const selectSkinType = async (skinType) => {
    setSelectedSkinType(skinType);

    if (!chatSession) return;
    const isMockSession = chatSession?.id?.startsWith('mock-session-');

    const msg = {
      role: 'user',
      content: `Loại da của tôi: ${skinType}`,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);

    if (!isMockSession) {
      try {
        await createChatMessage(chatSession.id, {
          role: 'user',
          content: `Loại da của tôi: ${skinType}`,
        });
      } catch (e) {
        console.warn('Skip saving skin type message:', e);
      }
    }

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

      if (!isMockSession) {
        try {
          await createChatMessage(chatSession.id, {
            role: 'assistant',
            content: response,
          });
        } catch (e) {
          console.warn('Skip saving assistant response (skin type):', e);
        }
      }
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
