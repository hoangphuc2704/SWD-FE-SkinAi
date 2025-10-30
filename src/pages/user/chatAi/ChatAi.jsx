import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './ChatAi.module.scss';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/button/Button';

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
      user,
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
