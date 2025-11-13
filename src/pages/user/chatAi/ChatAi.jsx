import React, { useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames/bind';
import styles from './ChatAi.module.scss';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/button/Button';
// import { getProfile } from '../../../apis/userApi';
import { createRoutineInstanceFromTemplate } from '../../../apis/routineInstanceApi';

// Import custom hooks
import { useChatSession } from './hooks/useChatSession';
import { useImageAnalysis } from './hooks/useImageAnalysis';

// Import components
import ChatMessages from './components/ChatMessages';
import ChatInput from './components/ChatInput';
import ImagePreview from './components/ImagePreview';
import ConsultPanel from './components/ConsultPanel';

const cx = classNames.bind(styles);

function ChatAi() {
  const navigate = useNavigate();
  const [inputMessage, setInputMessage] = useState('');
  const [hasAnalyzedImage, setHasAnalyzedImage] = useState(false);
  const messagesEndRef = useRef(null);
  const reminderIssuedRef = useRef(false);
  const reminderTimeoutRef = useRef(null);

  // Custom hooks
  const {
    user,
    chatSession,
    messages,
    loading,
    selectedProblem,
    selectedSkinType,
    sendMessage,
    sendChatTurn,
    selectProblem,
    selectSkinType,
    appendLocalMessage,
  } = useChatSession();

  const {
    imagePreview,
    analyzing,
    handleImageSelect: baseHandleImageSelect,
    removeImage: baseRemoveImage,
    analyzeImage,
  } = useImageAnalysis({
    selectedProblem,
    selectedSkinType,
    sendChatTurn,
    isSessionReady: Boolean(chatSession),
    onAnalysisComplete: () => setHasAnalyzedImage(true),
    onPreconditionFailed: (content) => {
      const message = content?.trim()
        ? content
        : 'Bạn vui lòng hoàn thành ba bước: chọn loại da, chọn tình trạng và tải ảnh để tôi phân tích nhé!';
      appendLocalMessage({
        role: 'assistant',
        content: message,
        timestamp: new Date().toISOString(),
      });
    },
  });

  const handleImageSelect = useCallback(
    (file) => {
      if (!selectedSkinType || !selectedProblem) {
        baseHandleImageSelect(file);
        return;
      }
      setHasAnalyzedImage(false);
      baseHandleImageSelect(file);
    },
    [baseHandleImageSelect, selectedProblem, selectedSkinType]
  );

  const removeImage = useCallback(() => {
    setHasAnalyzedImage(false);
    baseRemoveImage();
  }, [baseRemoveImage]);

  const canSendMessages = Boolean(
    chatSession && selectedProblem && selectedSkinType && hasAnalyzedImage && !analyzing
  );

  useEffect(() => {
    setHasAnalyzedImage(false);
  }, [selectedProblem, selectedSkinType]);

  // Scroll to bottom khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(
    () => () => {
      if (reminderTimeoutRef.current) {
        clearTimeout(reminderTimeoutRef.current);
      }
    },
    []
  );

  // Handlers
  const handleGoBack = () => {
    navigate(-1);
  };

  const remindOnboardingSteps = useCallback(() => {
    if (reminderIssuedRef.current) return;
    reminderIssuedRef.current = true;
    appendLocalMessage({
      role: 'assistant',
      content:
        'Để tôi hỗ trợ chính xác, bạn hãy hoàn tất: chọn loại da, chọn vấn đề da và gửi ảnh để tôi phân tích nhé! Khi xong, bạn có thể trò chuyện tiếp.',
      timestamp: new Date().toISOString(),
    });
    if (reminderTimeoutRef.current) {
      clearTimeout(reminderTimeoutRef.current);
    }
    reminderTimeoutRef.current = setTimeout(() => {
      reminderIssuedRef.current = false;
      reminderTimeoutRef.current = null;
    }, 4000);
  }, [appendLocalMessage]);

  const handleSendMessage = () => {
    if (!canSendMessages) {
      remindOnboardingSteps();
      return;
    }
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  // Handle action buttons inside messages (e.g., create routine decision)
  const handleMessageAction = async (actionId, message) => {
    // Hỗ trợ id mới 'open-routine' và tương thích ngược với 'create-routine'
    if (actionId === 'open-routine' || actionId === 'create-routine') {
      const preferredRoutineId = message?.meta?.routineId;
      const preferredUserId = message?.meta?.userId || user?.id || user?.userId || user?.UserId;
      const routineNameFromMessage =
        message?.meta?.routineName ||
        message?.meta?.routine?.name ||
        message?.meta?.name ||
        message?.meta?.title;

      if (!preferredRoutineId) {
        appendLocalMessage({
          role: 'assistant',
          content:
            'Xin lỗi, mình không tìm thấy mã routine để tạo lộ trình. Bạn hãy thử gửi lại yêu cầu nhé!',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      try {
        const startResponse = await createRoutineInstanceFromTemplate(preferredRoutineId);
        const resultPayload =
          startResponse?.data !== undefined ? startResponse.data : startResponse || {};
        const instanceId =
          resultPayload?.instanceId || resultPayload?.InstanceId || resultPayload?.id;

        appendLocalMessage({
          role: 'assistant',
          content:
            'Mình đã thêm lộ trình vào danh sách routine của bạn. Bạn có thể xem chi tiết và theo dõi tiến trình trong mục Routine nhé!',
          timestamp: new Date().toISOString(),
        });

        navigate('/routine', {
          state: {
            routineId: preferredRoutineId,
            instanceId,
            userId: preferredUserId,
            scrollToRoutine: true,
            routineName: routineNameFromMessage,
          },
        });
      } catch (error) {
        const status = error?.response?.status;
        if (status === 401) {
          navigate('/login');
          return;
        }
        let content =
          'Không thể bắt đầu lộ trình từ routine này vào lúc này. Bạn vui lòng thử lại sau hoặc chọn một routine khác nhé!';
        if (status === 409) {
          content =
            'Bạn đã có routine này trong danh sách rồi, hãy vào mục Routine để xem chi tiết nhé!';
        } else if (status === 404) {
          content = 'Routine này hiện không tồn tại nữa. Bạn thử chọn routine khác giúp mình nhé!';
        }
        appendLocalMessage({
          role: 'assistant',
          content,
          timestamp: new Date().toISOString(),
        });
      }
      return;
    }
    if (actionId === 'decline-open' || actionId === 'decline-create') {
      appendLocalMessage({
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
          disabled={!chatSession || !selectedSkinType || !selectedProblem || loading || analyzing}
        />

        <ChatInput
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onSend={handleSendMessage}
          onImageSelect={handleImageSelect}
          disabled={loading || analyzing || !canSendMessages}
        />
      </div>

      {/* Cột bên phải (tính năng & lựa chọn) */}
      <ConsultPanel
        selectedProblem={selectedProblem}
        selectedSkinType={selectedSkinType}
        hasAnalyzedImage={hasAnalyzedImage}
        onProblemSelect={selectProblem}
        onSkinTypeSelect={selectSkinType}
      />
    </div>
  );
}

export default ChatAi;
