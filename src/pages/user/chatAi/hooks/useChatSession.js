import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../../../../apis/userApi';
import { createChatSession, createChatMessage } from '../../../../apis/chatApi';

const unwrapServiceResult = (payload) => {
  if (!payload) return null;
  if (typeof payload.success === 'boolean') {
    if (!payload.success) {
      throw new Error(payload.message || 'Request failed');
    }
    return payload.data ?? null;
  }
  if (payload.data !== undefined) {
    return payload.data;
  }
  return payload;
};

const normalizeSession = (dto) => {
  if (!dto) return null;
  const id = dto.sessionId || dto.SessionId || dto.id;
  const userId = dto.userId || dto.UserId;
  return {
    id,
    userId,
    title: dto.title || dto.Title || 'Tư vấn chăm sóc da',
    channel: dto.channel || dto.Channel || 'ai',
    state: dto.state || dto.State || 'open',
    createdAt: dto.createdAt || dto.CreatedAt || new Date().toISOString(),
  };
};

const toViewMessage = (dto, currentUserId, fallbackRole = 'assistant') => {
  if (!dto) {
    return null;
  }

  const ownerId = dto.userId ?? dto.UserId;
  const role = ownerId && currentUserId && ownerId === currentUserId ? 'user' : fallbackRole;

  return {
    role,
    content: dto.content ?? dto.Content ?? '',
    imageUrl: dto.imageUrl ?? dto.ImageUrl ?? null,
    timestamp: dto.createdAt ?? dto.CreatedAt ?? new Date().toISOString(),
  };
};

const buildSuggestionMessages = (suggestions, viewerUserId) => {
  if (!Array.isArray(suggestions) || suggestions.length === 0) {
    return [];
  }

  return suggestions.map((item) => {
    const title = item.title || item.Title || 'Routine gợi ý';
    const reason = item.whyMatched || item.WhyMatched || 'Phù hợp với mô tả của bạn.';
    const shortDescription = item.shortDescription || item.ShortDescription || '';
    const routineId = item.routineId || item.RoutineId;
    const contentLines = [
      `Routine gợi ý: ${title}`,
      shortDescription ? `Tóm tắt: ${shortDescription}` : null,
      `Lý do phù hợp: ${reason}`,
    ].filter(Boolean);

    return {
      role: 'assistant',
      content: contentLines.join('\n'),
      actions: routineId ? [{ id: 'open-routine', label: 'Xem lộ trình' }] : undefined,
      meta: routineId
        ? {
            routineId,
            userId: viewerUserId,
          }
        : undefined,
      timestamp: new Date().toISOString(),
    };
  });
};

/**
 * Custom hook để quản lý chat session giữa user ↔ AI
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

  useEffect(() => {
    const initChat = async () => {
      if (initializedRef.current) return;
      initializedRef.current = true;

      try {
        const profileEnvelope = await getProfile();
        const profile = unwrapServiceResult(profileEnvelope);
        if (!profile) {
          throw new Error('Không lấy được thông tin người dùng.');
        }
        const normalizedUserId = [profile?.id, profile?.Id, profile?.userId, profile?.UserId]
          .map((value) => {
            if (!value) return null;
            if (typeof value === 'string') return value.trim();
            return null;
          })
          .find(Boolean);
        if (!normalizedUserId) {
          throw new Error('Không xác định được mã người dùng.');
        }
        const normalizedProfile = { ...profile, id: normalizedUserId };
        setUser(normalizedProfile);

        setMessages([
          {
            role: 'assistant',
            content:
              'Xin chào! Để tôi tư vấn chính xác nhất, bạn vui lòng hoàn thành 3 bước đầu tiên:\n1️⃣ Chọn loại da của bạn.\n2️⃣ Chọn vấn đề da đang gặp phải.\n3️⃣ Tải một bức ảnh rõ nét về vùng da đó để tôi phân tích.\nSau khi phân tích xong, bạn có thể trò chuyện và nhận routine phù hợp nhé! 😊',
            timestamp: new Date().toISOString(),
          },
        ]);

        const sessionEnvelope = await createChatSession({
          userId: normalizedUserId,
          title: 'Tư vấn chăm sóc da',
          channel: 'ai',
        });

        const session = normalizeSession(unwrapServiceResult(sessionEnvelope));
        if (!session) {
          throw new Error('Không tạo được phiên chat.');
        }
        setChatSession(session);
      } catch (error) {
        console.error('Error initializing chat:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          setMessages([
            {
              role: 'assistant',
              content:
                'Không thể khởi tạo cuộc trò chuyện. Vui lòng thử đăng nhập lại hoặc thử lại sau.',
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      }
    };

    initChat();
  }, [navigate]);

  const handleChatTurnResponse = useCallback(
    (responsePayload) => {
      try {
        const turn = unwrapServiceResult(responsePayload);
        if (!turn) return;

        if (turn.analysisId) {
          setAiAnalysisId(turn.analysisId);
        }

        const currentUserId = user?.id || user?.userId || user?.UserId || null;
        const assistantMessage = toViewMessage(turn.assistantMessage, currentUserId, 'assistant');
        const suggestionMessages = buildSuggestionMessages(turn.suggestedRoutines, currentUserId);

        setMessages((prev) => {
          const next = [...prev];
          if (assistantMessage?.content) {
            next.push(assistantMessage);
          }
          if (suggestionMessages.length > 0) {
            next.push(...suggestionMessages);
          }
          return next;
        });
      } catch (error) {
        console.error('Error handling chat response:', error);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'Xin lỗi, tôi đang gặp sự cố khi phản hồi. Bạn thử lại giúp nhé!',
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    },
    [user?.id, user?.userId, user?.UserId]
  );

  const sendChatTurn = useCallback(
    async ({ content, imageFile, optimisticImageUrl, fallbackContent } = {}) => {
      if (!chatSession || loading) return false;

      const hasImage = !!imageFile;
      const trimmedContent = (content || '').trim();
      if (!trimmedContent && !hasImage) {
        return false;
      }

      const displayContent =
        trimmedContent ||
        fallbackContent ||
        (hasImage ? 'Mình gửi ảnh da của mình để bạn phân tích giúp nhé!' : '');

      if (displayContent) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'user',
            content: displayContent,
            imageUrl: optimisticImageUrl || null,
            timestamp: new Date().toISOString(),
          },
        ]);
      }

      setLoading(true);

      try {
        const response = await createChatMessage(chatSession.id, {
          content:
            trimmedContent ||
            fallbackContent ||
            (hasImage ? 'Phân tích giúp tôi bức ảnh này.' : ''),
          imageFile,
        });
        handleChatTurnResponse(response);
        return true;
      } catch (error) {
        console.error('Error sending chat message:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content:
                'Xin lỗi, tôi chưa thể xử lý yêu cầu này. Bạn có thể thử lại sau một chút nhé!',
              timestamp: new Date().toISOString(),
            },
          ]);
        }
        return false;
      } finally {
        setLoading(false);
      }
    },
    [chatSession, handleChatTurnResponse, loading, navigate]
  );

  const sendMessage = useCallback(
    async (messageText) => {
      const text = (messageText || '').trim();
      if (!text) return;
      await sendChatTurn({ content: text });
    },
    [sendChatTurn]
  );

  const selectProblem = useCallback((problem) => {
    setSelectedProblem(problem);
  }, []);

  const selectSkinType = useCallback((skinType) => {
    setSelectedSkinType(skinType);
  }, []);

  const appendLocalMessage = useCallback((message) => {
    if (!message) return;
    setMessages((prev) => [...prev, message]);
  }, []);

  return {
    user,
    chatSession,
    messages,
    loading,
    selectedProblem,
    selectedSkinType,
    aiAnalysisId,
    sendMessage,
    sendChatTurn,
    selectProblem,
    selectSkinType,
    appendLocalMessage,
  };
};
