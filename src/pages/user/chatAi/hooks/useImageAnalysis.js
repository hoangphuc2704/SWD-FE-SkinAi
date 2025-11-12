import { useState } from 'react';
import { uploadImageToCloudinary } from '../../../../services/upLoadService';
import { createChatMessage } from '../../../../apis/chatApi';
import { submitConsultation } from '../../../../apis/consultationApi';

/**
 * Custom hook để xử lý upload và phân tích ảnh da
 */
export const useImageAnalysis = ({
  chatSession,
  selectedProblem,
  selectedSkinType,
  setAiAnalysisId,
  addMessage,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Xử lý chọn ảnh
  const handleImageSelect = (file) => {
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Xóa ảnh đã chọn
  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Phân tích ảnh
  const analyzeImage = async () => {
    if (!selectedImage || !chatSession) return;

    setAnalyzing(true);
    const isMockSession = chatSession?.id?.startsWith('mock-session-');
    try {
      // Upload ảnh lên Cloudinary
      const uploadResult = await uploadImageToCloudinary(selectedImage, 'skin-analysis');
      const imageUrl = uploadResult.secure_url;

      // Gọi consultation với ImageUrl để phân tích (GenerateRoutine=false)
      let analysisId = null;

      // Thêm tin nhắn user gửi ảnh
      const userMsg = {
        role: 'user',
        content: 'Đây là ảnh da của tôi',
        imageUrl: imageUrl,
        timestamp: new Date().toISOString(),
      };
      addMessage(userMsg);

      // Lưu tin nhắn vào database (nếu không mock)
      if (!isMockSession) {
        try {
          await createChatMessage(chatSession.id, {
            role: 'user',
            content: 'Đây là ảnh da của tôi',
            imageUrl: imageUrl,
          });
        } catch (e) {
          console.warn('Skip saving image user message:', e);
        }
      }

      try {
        const result = await submitConsultation({
          text: `Phân tích ảnh da${selectedProblem ? `, vấn đề: ${selectedProblem}` : ''}${
            selectedSkinType ? `, loại da: ${selectedSkinType}` : ''
          }`,
          imageUrl,
          generateRoutine: true,
        });
        const d = result?.data || {};
        if (d.analysisId) {
          analysisId = d.analysisId;
          setAiAnalysisId(analysisId);
        }

        const summary = d?.advice?.summary || 'Mình đã phân tích ảnh của bạn.';
        if (d.routineGenerated && d.routineId) {
          addMessage({
            role: 'assistant',
            content: `${summary}\n\nMình vừa tạo lộ trình chăm sóc da cho bạn. Bạn có muốn xem lộ trình ngay bây giờ không?`,
            actions: [
              { id: 'open-routine', label: 'Xem lộ trình' },
              { id: 'decline-open', label: 'Để sau' },
            ],
            meta: { routineId: d.routineId },
            timestamp: new Date().toISOString(),
          });
        } else {
          addMessage({
            role: 'assistant',
            content: summary,
            timestamp: new Date().toISOString(),
          });
        }

        if (!isMockSession) {
          try {
            await createChatMessage(chatSession.id, {
              role: 'assistant',
              content: summary,
            });
          } catch (e) {
            console.warn('Skip saving assistant image analysis message:', e);
          }
        }

        // KHÔNG tự động chuyển trang sau phân tích ảnh.
      } catch {
        addMessage({
          role: 'assistant',
          content:
            'Hiện chưa phân tích được ảnh. Bạn có thể thử lại hoặc tiếp tục cung cấp thông tin để tôi tư vấn.',
          timestamp: new Date().toISOString(),
        });
      } finally {
        setAnalyzing(false);
      }

      // Reset image
      removeImage();
    } catch (error) {
      console.error('Error analyzing image:', error);
      // Vẫn kết thúc trạng thái phân tích để UI không bị kẹt
      setAnalyzing(false);
    }
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
