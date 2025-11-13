import { useState } from 'react';

/**
 * Custom hook để xử lý upload và phân tích ảnh da bằng luồng chat AI chính thức
 */
export const useImageAnalysis = ({
  sendChatTurn,
  selectedProblem,
  selectedSkinType,
  isSessionReady,
  onAnalysisComplete,
  onPreconditionFailed,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleImageSelect = (file) => {
    if (!file) return;
    if (!selectedSkinType || !selectedProblem) {
      onPreconditionFailed?.('Bạn cần chọn loại da và tình trạng da trước khi tải ảnh nhé!');
      return;
    }
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const analyzeImage = async () => {
    if (!selectedImage || !sendChatTurn) return;
    if (!isSessionReady) {
      console.warn('Chat session is not ready. Skipping image analysis.');
      return;
    }
    if (!selectedSkinType || !selectedProblem) {
      onPreconditionFailed?.(
        'Hãy chọn đầy đủ loại da và tình trạng da trước khi gửi ảnh để tôi phân tích nhé!'
      );
      return;
    }

    setAnalyzing(true);
    let sent = false;
    try {
      const contextParts = [];
      if (selectedProblem) contextParts.push(`Vấn đề: ${selectedProblem}`);
      if (selectedSkinType) contextParts.push(`Loại da: ${selectedSkinType}`);
      const contextText = contextParts.length > 0 ? contextParts.join('. ') : null;

      sent = await sendChatTurn({
        content: contextText
          ? `Nhờ bạn phân tích giúp ảnh này. ${contextText}`
          : 'Nhờ bạn phân tích giúp ảnh này.',
        imageFile: selectedImage,
        optimisticImageUrl: imagePreview,
        fallbackContent: 'Đây là ảnh da của tôi.',
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setAnalyzing(false);
      if (sent) {
        removeImage();
        onAnalysisComplete?.();
      }
    }
    return sent;
  };

  return {
    selectedImage,
    imagePreview,
    analyzing,
    handleImageSelect,
    removeImage,
    analyzeImage,
  };
};
