import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoutine } from '../../../../apis/routineApi';
import { createRoutineInstance } from '../../../../apis/routineInstanceApi';
import { createChatMessage } from '../../../../apis/chatApi';

/**
 * Custom hook để xử lý tạo lộ trình chăm sóc da
 */
export const useRoutineCreation = ({ user, chatSession, addMessage }) => {
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const createSkincareRoutine = async (selectedProblem, selectedSkinType) => {
    if (!user || !selectedProblem || !selectedSkinType) {
      alert('Vui lòng chọn vấn đề da và loại da trước!');
      return;
    }

    setCreating(true);
    try {
      // Tạo routine mới
      const routineData = await createRoutine({
        userId: user.id,
        name: `Lộ trình chăm sóc ${selectedSkinType} - ${selectedProblem}`,
        description: `Lộ trình được AI tư vấn dựa trên phân tích da`,
        skinType: selectedSkinType,
        targetProblem: selectedProblem,
        duration: 30, // 30 ngày
      });

      // Tạo routine instance để bắt đầu theo dõi
      await createRoutineInstance({
        userId: user.id,
        routineId: routineData.data.id,
        startDate: new Date().toISOString(),
        status: 'active',
      });

      // Thông báo thành công
      const successMsg = {
        role: 'assistant',
        content: `🎉 Tuyệt vời! Tôi đã tạo lộ trình chăm sóc da cho bạn:

📋 **${routineData.data.name}**

Lộ trình này được thiết kế đặc biệt cho ${selectedSkinType} với vấn đề ${selectedProblem}.

Bạn có thể xem chi tiết lộ trình và theo dõi tiến trình tại trang "Routine" của mình.

Chúc bạn có làn da khỏe đẹp! 💚`,
        timestamp: new Date().toISOString(),
      };
      addMessage(successMsg);

      await createChatMessage(chatSession.id, {
        role: 'assistant',
        content: successMsg.content,
      });

      // Điều hướng sang trang Routine và chọn đúng lộ trình vừa tạo
      navigate('/routine', { state: { routineId: routineData.data.id } });
    } catch (error) {
      console.error('Error creating routine:', error);
      alert('Có lỗi khi tạo lộ trình. Vui lòng thử lại!');
    } finally {
      setCreating(false);
    }
  };

  return {
    creating,
    createSkincareRoutine,
  };
};
