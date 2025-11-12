import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './ChatAi.module.scss';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/button/Button';
// import { getProfile } from '../../../apis/userApi';
import { getRoutinesByUserId, getRoutineById } from '../../../apis/routineApi';

// Import custom hooks
import { useChatSession } from './hooks/useChatSession';
import { useImageAnalysis } from './hooks/useImageAnalysis';
import { useRoutineCreation } from './hooks/useRoutineCreation';

// Import components
import ChatMessages from './components/ChatMessages';
import ChatInput from './components/ChatInput';
import ImagePreview from './components/ImagePreview';
import ConsultPanel from './components/ConsultPanel';

const cx = classNames.bind(styles);

function ChatAi() {
  const navigate = useNavigate();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Custom hooks
  const {
    user,
    chatSession,
    messages,
    loading,
    selectedProblem,
    selectedSkinType,
    setAiAnalysisId,
    sendMessage,
    selectProblem,
    selectSkinType,
    addMessage,
  } = useChatSession();

  const { imagePreview, analyzing, handleImageSelect, removeImage, analyzeImage } =
    useImageAnalysis({
      chatSession,
      selectedProblem,
      selectedSkinType,
      setAiAnalysisId,
      addMessage,
    });

  const { creating, createSkincareRoutine } = useRoutineCreation({
    user,
    chatSession,
    addMessage,
  });

  // Scroll to bottom khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handlers
  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleCreateRoutine = () => {
    createSkincareRoutine(selectedProblem, selectedSkinType);
  };

  // Handle action buttons inside messages (e.g., create routine decision)
  const handleMessageAction = async (actionId, message) => {
    // Hỗ trợ id mới 'open-routine' và tương thích ngược với 'create-routine'
    if (actionId === 'open-routine' || actionId === 'create-routine') {
      const preferredRoutineId = message?.meta?.routineId;
      const preferredUserId = message?.meta?.userId || user?.id;

      // Gọi API theo yêu cầu trước khi điều hướng (không gọi /me)
      if (preferredUserId) {
        try {
          await getRoutinesByUserId(preferredUserId);
        } catch (e) {
          console.warn('GET /api/routines/user failed:', e?.message || e);
        }
      }
      if (preferredRoutineId) {
        try {
          await getRoutineById(preferredRoutineId);
        } catch (e) {
          console.warn('GET /api/routines/{id} failed:', e?.message || e);
        }
      }

      // Điều hướng đến trang Routine và để Routine.jsx gọi GET /api/routine-steps/routine/{routineId}
      navigate('/routine', { state: { routineId: preferredRoutineId, userId: preferredUserId } });
    }
    if (actionId === 'decline-open' || actionId === 'decline-create') {
      addMessage({
        role: 'assistant',
        content: 'Không sao, bạn có thể tiếp tục trò chuyện hoặc tải ảnh để tôi phân tích nhé!',
        timestamp: new Date().toISOString(),
      });
    }
  };

  return (
    <div className={cx('wrapper')}>
      {/* Back button */}
      <Button onClick={handleGoBack} className={cx('backBtn')}>
        <i className="fa-solid fa-left-long"></i>
      </Button>

      {/* Cột bên trái (chat box) */}
      <div className={cx('chatLeft')}>
        <ChatMessages
          messages={messages}
          loading={loading || analyzing}
          messagesEndRef={messagesEndRef}
          onAction={handleMessageAction}
        />

        <ImagePreview
          imagePreview={imagePreview}
          onRemove={removeImage}
          onAnalyze={analyzeImage}
          analyzing={analyzing}
        />

        <ChatInput
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onSend={handleSendMessage}
          onImageSelect={handleImageSelect}
          disabled={loading || analyzing}
        />
      </div>

      {/* Cột bên phải (tính năng & lựa chọn) */}
      <ConsultPanel
        selectedProblem={selectedProblem}
        selectedSkinType={selectedSkinType}
        onProblemSelect={selectProblem}
        onSkinTypeSelect={selectSkinType}
        onCreateRoutine={handleCreateRoutine}
        creating={creating}
      />
    </div>
  );
}

export default ChatAi;
