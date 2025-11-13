# 🤖 Chat AI - Tư vấn lộ trình Skincare

## 📋 Tổng quan

Trang ChatAi là trung tâm tư vấn AI cho hệ thống skincare, nơi người dùng có thể:
1. **Chat với AI** để được tư vấn về chăm sóc da
2. **Upload ảnh da** để AI phân tích tình trạng
3. **Chọn vấn đề da** và loại da
4. **Nhận lộ trình chăm sóc** được cá nhân hóa

---

## 🔄 Flow hoạt động

### **Bước 1: Khởi tạo Chat Session**
```javascript
useEffect(() => {
  // 1. Lấy thông tin user từ API
  const profileData = await getProfile();
  
  // 2. Tạo chat session mới
  const sessionData = await createChatSession({
    userId: profileData.data.id,
    title: 'Tư vấn chăm sóc da',
  });
  
  // 3. Hiển thị tin nhắn chào mừng
  setMessages([welcomeMsg]);
}, []);
```

**API sử dụng:**
- `GET /api/users/me` - Lấy thông tin user
- `POST /api/chat/sessions` - Tạo chat session

---

### **Bước 2: User chọn vấn đề da**
```javascript
async function handleProblemSelect(problem) {
  // 1. Lưu vấn đề đã chọn
  setSelectedProblem(problem);
  
  // 2. Gửi tin nhắn vào chat
  await createChatMessage(chatSession.id, {
    role: 'user',
    content: `Vấn đề da của tôi: ${problem}`,
  });
  
  // 3. Lưu symptom vào database
  await createUserSymptom({
    userId: user.id,
    symptomName: problem,
    severity: 'moderate',
  });
  
  // 4. AI phản hồi
  // ...
}
```

**API sử dụng:**
- `POST /api/chat/sessions/{sessionId}/messages` - Lưu tin nhắn
- `POST /api/user-symptoms` - Lưu triệu chứng

**Các vấn đề da có sẵn:**
- Mụn trứng cá và mụn đầu đen
- Da khô và bong tróc
- Da nhờn và lỗ chân lông to
- Nám và tàn nhang
- Lão hóa và nếp nhăn

---

### **Bước 3: User chọn loại da**
```javascript
async function handleSkinTypeSelect(skinType) {
  // 1. Lưu loại da đã chọn
  setSelectedSkinType(skinType);
  
  // 2. Gửi tin nhắn vào chat
  await createChatMessage(chatSession.id, {
    role: 'user',
    content: `Loại da của tôi: ${skinType}`,
  });
  
  // 3. AI phản hồi
  // ...
}
```

**API sử dụng:**
- `POST /api/chat/sessions/{sessionId}/messages`

**Các loại da có sẵn:**
- Da khô
- Da nhờn
- Da hỗn hợp
- Da nhạy cảm
- Không chắc chắn

---

### **Bước 4: User upload ảnh da**
```javascript
async function handleImageAnalysis() {
  // 1. Upload ảnh lên Cloudinary
  const uploadResult = await uploadImageToCloudinary(selectedImage, 'skin-analysis');
  const imageUrl = uploadResult.secure_url;
  
  // 2. Tạo AI Analysis record
  const analysisData = await createAIAnalysis({
    userId: user.id,
    imageUrl: imageUrl,
    analysisType: 'skin_condition',
  });
  
  // 3. Lưu tin nhắn có ảnh
  await createChatMessage(chatSession.id, {
    role: 'user',
    content: 'Đây là ảnh da của tôi',
    imageUrl: imageUrl,
  });
  
  // 4. AI phân tích và phản hồi
  const aiResponse = `Tôi đã phân tích ảnh da của bạn...`;
  
  // 5. Lưu AI response
  await createAIResponse({
    analysisId: analysisData.data.id,
    responseText: aiResponse,
    confidence: 0.85,
  });
}
```

**API sử dụng:**
- Cloudinary API - Upload ảnh
- `POST /api/ai/analysis` - Tạo AI analysis
- `POST /api/chat/sessions/{sessionId}/messages` - Lưu tin nhắn
- `POST /api/ai/responses` - Lưu AI response

---

### **Bước 5: User chat với AI**
```javascript
async function handleSendMessage() {
  // 1. Lưu tin nhắn user
  await createChatMessage(chatSession.id, {
    role: 'user',
    content: userMessage,
  });
  
  // 2. AI xử lý và phản hồi
  // (Hiện tại đang giả lập, sau này sẽ gọi API AI thật)
  const aiResponse = generateAIResponse(userMessage);
  
  // 3. Lưu tin nhắn AI
  await createChatMessage(chatSession.id, {
    role: 'assistant',
    content: aiResponse,
  });
  
  // 4. Lưu AI response (nếu có analysis)
  if (aiAnalysisId) {
    await createAIResponse({
      analysisId: aiAnalysisId,
      responseText: aiResponse,
      confidence: 0.9,
    });
  }
}
```

**API sử dụng:**
- `POST /api/chat/sessions/{sessionId}/messages` - Lưu tin nhắn
- `POST /api/ai/responses` - Lưu AI response

---

### **Bước 6: Tạo lộ trình chăm sóc da**
```javascript
async function handleCreateRoutine() {
  // 1. Tạo routine mới
  const routineData = await createRoutine({
    userId: user.id,
    name: `Lộ trình chăm sóc ${selectedSkinType} - ${selectedProblem}`,
    description: `Lộ trình được AI tư vấn dựa trên phân tích da`,
    skinType: selectedSkinType,
    targetProblem: selectedProblem,
    duration: 30, // 30 ngày
  });
  
  // 2. Tạo routine instance để bắt đầu theo dõi
  await createRoutineInstance({
    userId: user.id,
    routineId: routineData.data.id,
    startDate: new Date().toISOString(),
    status: 'active',
  });
  
  // 3. Thông báo thành công
  alert('Đã tạo lộ trình chăm sóc da thành công!');
}
```

**API sử dụng:**
- `POST /api/routines` - Tạo routine
- `POST /api/routine-instances` - Tạo routine instance

**Điều kiện:**
- User phải chọn cả `selectedProblem` và `selectedSkinType`

---

## 🎨 UI Components

### **1. Chat Messages**
- **User messages**: Màu tím gradient, căn phải
- **AI messages**: Màu xám, căn trái
- **Image messages**: Hiển thị ảnh + text
- **Typing indicator**: 3 chấm nhảy khi AI đang xử lý

### **2. Image Upload**
- **Camera button**: Click để chọn ảnh
- **Image preview**: Hiển thị ảnh đã chọn
- **Analyze button**: Phân tích ảnh
- **Remove button**: Xóa ảnh đã chọn

### **3. Problem & Skin Type Selection**
- **Buttons**: Hiển thị các lựa chọn
- **Selected state**: Màu tím gradient khi được chọn
- **Hover effect**: Dịch chuyển sang phải khi hover

### **4. Create Routine Button**
- Chỉ hiển thị khi đã chọn cả problem và skin type
- Gradient background với shadow
- Hover effect: Nâng lên

---

## 📊 State Management

```javascript
const [user, setUser] = useState(null);                    // Thông tin user
const [chatSession, setChatSession] = useState(null);      // Chat session hiện tại
const [messages, setMessages] = useState([]);              // Danh sách tin nhắn
const [inputMessage, setInputMessage] = useState('');      // Input text
const [selectedImage, setSelectedImage] = useState(null);  // File ảnh đã chọn
const [imagePreview, setImagePreview] = useState(null);    // Preview URL
const [loading, setLoading] = useState(false);             // Loading state
const [selectedProblem, setSelectedProblem] = useState(''); // Vấn đề da đã chọn
const [selectedSkinType, setSelectedSkinType] = useState(''); // Loại da đã chọn
const [aiAnalysisId, setAiAnalysisId] = useState(null);    // ID của AI analysis
```

---

## 🔌 API Integration Summary

| Giai đoạn | API Endpoint | Mục đích |
|-----------|-------------|----------|
| **Init** | `GET /api/users/me` | Lấy thông tin user |
| **Init** | `POST /api/chat/sessions` | Tạo chat session |
| **Chat** | `POST /api/chat/sessions/{id}/messages` | Lưu tin nhắn |
| **Symptom** | `POST /api/user-symptoms` | Lưu triệu chứng |
| **Image** | Cloudinary API | Upload ảnh |
| **Analysis** | `POST /api/ai/analysis` | Tạo AI analysis |
| **Response** | `POST /api/ai/responses` | Lưu AI response |
| **Routine** | `POST /api/routines` | Tạo routine |
| **Instance** | `POST /api/routine-instances` | Bắt đầu routine |

---

## 🚀 Next Steps

### **Cần làm thêm:**
1. **Tích hợp AI thật** thay vì giả lập response
2. **Load chat history** khi user quay lại
3. **Xem routine đã tạo** từ trang Routine
4. **Theo dõi tiến trình** với Routine Progress API
5. **Feedback system** sau khi hoàn thành routine

### **API chưa sử dụng:**
- `GET /api/chat/sessions/{sessionId}/messages` - Load lịch sử chat
- `GET /api/routines/user/{userId}` - Xem routines đã tạo
- `POST /api/routine-progress` - Ghi nhận tiến trình
- `POST /api/feedbacks` - Gửi feedback

---

## 💡 Tips

1. **Error Handling**: Tất cả API calls đều có try-catch
2. **Loading State**: Disable buttons khi đang xử lý
3. **Auto Scroll**: Tự động scroll xuống khi có tin nhắn mới
4. **Image Validation**: Chỉ chấp nhận file ảnh
5. **Auth Check**: Redirect về login nếu chưa đăng nhập

---

**Tạo bởi:** AI Assistant
**Ngày:** 2025-10-29

