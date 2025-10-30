import { useState } from 'react';
import { uploadImageToCloudinary } from '../../../../services/upLoadService';
import { createAIAnalysis, createAIResponse } from '../../../../apis/aiApi';
import { createChatMessage } from '../../../../apis/chatApi';

/**
 * Custom hook để xử lý upload và phân tích ảnh da
 */
export const useImageAnalysis = ({
  user,
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
    try {
      // Upload ảnh lên Cloudinary
      const uploadResult = await uploadImageToCloudinary(selectedImage, 'skin-analysis');
      const imageUrl = uploadResult.secure_url;

      // Tạo AI Analysis record
      const analysisData = await createAIAnalysis({
        userId: user.id,
        imageUrl: imageUrl,
        analysisType: 'skin_condition',
      });
      setAiAnalysisId(analysisData.data.id);

      // Thêm tin nhắn user gửi ảnh
      const userMsg = {
        role: 'user',
        content: 'Đây là ảnh da của tôi',
        imageUrl: imageUrl,
        timestamp: new Date().toISOString(),
      };
      addMessage(userMsg);

      // Lưu tin nhắn vào database
      await createChatMessage(chatSession.id, {
        role: 'user',
        content: 'Đây là ảnh da của tôi',
        imageUrl: imageUrl,
      });

      // Giả lập phản hồi AI (thực tế sẽ gọi API AI thật)
      setTimeout(async () => {
        const aiResponse = `Tôi đã phân tích ảnh da của bạn. Dựa trên hình ảnh, tôi nhận thấy:

🔍 **Tình trạng da:**
- Loại da: ${selectedSkinType || 'Hỗn hợp'}
- Vấn đề chính: ${selectedProblem || 'Cần thêm thông tin'}
- Độ ẩm: Trung bình
- Tình trạng lỗ chân lông: Hơi to ở vùng chữ T

💡 **Khuyến nghị:**
- Cần làm sạch da đều đặn 2 lần/ngày
- Sử dụng toner cân bằng pH
- Dưỡng ẩm phù hợp với loại da
- Chống nắng SPF 50+ hàng ngày

Bạn có muốn tôi tạo lộ trình chăm sóc da chi tiết không?`;

        const assistantMsg = {
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date().toISOString(),
        };
        addMessage(assistantMsg);

        // Lưu AI response
        await createAIResponse({
          analysisId: analysisData.data.id,
          responseText: aiResponse,
          confidence: 0.85,
        });

        await createChatMessage(chatSession.id, {
          role: 'assistant',
          content: aiResponse,
        });

        setAnalyzing(false);
      }, 2000);

      // Reset image
      removeImage();
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Có lỗi khi phân tích ảnh. Vui lòng thử lại!');
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

