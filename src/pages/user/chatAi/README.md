# 📁 ChatAi - Refactored Structure

## 🎯 Tổng quan

File `ChatAi.jsx` đã được **tách nhỏ** từ **637 dòng** xuống còn **126 dòng** (giảm 80%!) để dễ bảo trì và mở rộng.

---

## 📂 Cấu trúc thư mục

```
chatAi/
├── ChatAi.jsx                    # Main container (126 dòng) ⭐
├── ChatAi.module.scss            # Styles
│
├── components/                   # UI Components
│   ├── ChatMessages.jsx          # Hiển thị danh sách messages
│   ├── ChatInput.jsx             # Input box + camera button
│   ├── ImagePreview.jsx          # Preview ảnh đã chọn
│   ├── FeatureCards.jsx          # 3 ô tính năng
│   ├── ProblemSelector.jsx       # Chọn vấn đề da
│   ├── SkinTypeSelector.jsx      # Chọn loại da
│   └── ConsultPanel.jsx          # Panel bên phải (tổng hợp)
│
├── hooks/                        # Custom Hooks (Business Logic)
│   ├── useChatSession.js         # Quản lý chat session & messages
│   ├── useImageAnalysis.js       # Upload & phân tích ảnh
│   └── useRoutineCreation.js     # Tạo lộ trình chăm sóc da
│
└── docs/                         # Documentation
    ├── README.md                 # File này
    ├── CHAT_FLOW.md              # Flow hoạt động
    └── API_TEST_GUIDE.md         # Hướng dẫn test
```

---

## 🔧 Chi tiết từng file

### **1. ChatAi.jsx** (Main Container - 126 dòng)

**Trách nhiệm:**
- Kết nối các hooks và components
- Quản lý state cục bộ (inputMessage)
- Xử lý navigation
- Render UI

**Code:**
```javascript
function ChatAi() {
  // Custom hooks
  const { messages, loading, sendMessage, ... } = useChatSession();
  const { imagePreview, analyzeImage, ... } = useImageAnalysis({...});
  const { creating, createSkincareRoutine } = useRoutineCreation({...});

  // Handlers
  const handleSendMessage = () => { ... };
  const handleCreateRoutine = () => { ... };

  // Render
  return (
    <div>
      <ChatMessages messages={messages} loading={loading} />
      <ChatInput onSend={handleSendMessage} />
      <ConsultPanel onCreateRoutine={handleCreateRoutine} />
    </div>
  );
}
```

---

### **2. Custom Hooks** (Business Logic)

#### **useChatSession.js** (280 dòng)
**Quản lý:**
- Load user profile
- Tạo chat session
- Gửi/nhận messages
- Chọn vấn đề da & loại da
- Lưu symptoms

**API sử dụng:**
- `getProfile()` - Lấy thông tin user
- `createChatSession()` - Tạo session
- `createChatMessage()` - Gửi tin nhắn
- `createUserSymptom()` - Lưu triệu chứng
- `createAIResponse()` - Lưu AI response

**Export:**
```javascript
return {
  user,
  chatSession,
  messages,
  loading,
  selectedProblem,
  selectedSkinType,
  sendMessage,
  selectProblem,
  selectSkinType,
  addMessage,
};
```

---

#### **useImageAnalysis.js** (120 dòng)
**Quản lý:**
- Chọn ảnh từ device
- Preview ảnh
- Upload lên Cloudinary
- Tạo AI Analysis
- Lưu AI Response

**API sử dụng:**
- `uploadImageToCloudinary()` - Upload ảnh
- `createAIAnalysis()` - Tạo analysis record
- `createAIResponse()` - Lưu kết quả phân tích
- `createChatMessage()` - Lưu tin nhắn có ảnh

**Export:**
```javascript
return {
  selectedImage,
  imagePreview,
  analyzing,
  handleImageSelect,
  removeImage,
  analyzeImage,
};
```

---

#### **useRoutineCreation.js** (70 dòng)
**Quản lý:**
- Tạo routine mới
- Tạo routine instance
- Thông báo thành công

**API sử dụng:**
- `createRoutine()` - Tạo routine
- `createRoutineInstance()` - Bắt đầu routine
- `createChatMessage()` - Gửi thông báo

**Export:**
```javascript
return {
  creating,
  createSkincareRoutine,
};
```

---

### **3. UI Components** (Presentational)

#### **ChatMessages.jsx** (45 dòng)
Hiển thị danh sách messages với:
- User messages (tím, bên phải)
- AI messages (xám, bên trái)
- Ảnh trong message
- Timestamp
- Typing indicator

**Props:**
```javascript
<ChatMessages 
  messages={[...]}
  loading={boolean}
  messagesEndRef={ref}
/>
```

---

#### **ChatInput.jsx** (55 dòng)
Input box với:
- Camera button (upload ảnh)
- Text input
- Send button
- Enter key support

**Props:**
```javascript
<ChatInput
  value={string}
  onChange={function}
  onSend={function}
  onImageSelect={function}
  disabled={boolean}
/>
```

---

#### **ImagePreview.jsx** (25 dòng)
Preview ảnh đã chọn với:
- Ảnh preview
- Remove button
- Analyze button

**Props:**
```javascript
<ImagePreview
  imagePreview={string}
  onRemove={function}
  onAnalyze={function}
  analyzing={boolean}
/>
```

---

#### **FeatureCards.jsx** (35 dòng)
3 ô tính năng:
- Phân tích da
- Tư vấn sản phẩm
- Lộ trình chăm sóc

**Props:** Không có (static content)

---

#### **ProblemSelector.jsx** (35 dòng)
Chọn vấn đề da:
- 5 buttons
- Selected state
- Click handler

**Props:**
```javascript
<ProblemSelector
  selectedProblem={string}
  onSelect={function}
/>
```

---

#### **SkinTypeSelector.jsx** (30 dòng)
Chọn loại da:
- 5 buttons
- Selected state
- Click handler

**Props:**
```javascript
<SkinTypeSelector
  selectedSkinType={string}
  onSelect={function}
/>
```

---

#### **ConsultPanel.jsx** (55 dòng)
Panel bên phải tổng hợp:
- FeatureCards
- ProblemSelector
- SkinTypeSelector
- Create Routine button

**Props:**
```javascript
<ConsultPanel
  selectedProblem={string}
  selectedSkinType={string}
  onProblemSelect={function}
  onSkinTypeSelect={function}
  onCreateRoutine={function}
  creating={boolean}
/>
```

---

## 🎯 Lợi ích của việc refactor

### **1. Dễ bảo trì**
- Mỗi file có trách nhiệm rõ ràng
- Dễ tìm và sửa bug
- Code ngắn gọn, dễ đọc

### **2. Tái sử dụng**
- Components có thể dùng ở nơi khác
- Hooks có thể share giữa các pages
- Logic tách biệt khỏi UI

### **3. Dễ test**
- Test từng component riêng
- Test từng hook riêng
- Mock dễ dàng

### **4. Dễ mở rộng**
- Thêm tính năng mới không ảnh hưởng code cũ
- Thay đổi UI không ảnh hưởng logic
- Thay đổi logic không ảnh hưởng UI

---

## 📊 So sánh trước và sau

| Metric | Trước | Sau | Cải thiện |
|--------|-------|-----|-----------|
| **Tổng dòng code** | 637 | 126 | ⬇️ 80% |
| **Số file** | 1 | 11 | ⬆️ Tách nhỏ |
| **Độ phức tạp** | Cao | Thấp | ✅ |
| **Khả năng tái sử dụng** | Không | Có | ✅ |
| **Dễ test** | Khó | Dễ | ✅ |
| **Dễ bảo trì** | Khó | Dễ | ✅ |

---

## 🚀 Cách sử dụng

### **Thêm tính năng mới**

**Ví dụ: Thêm voice input**

1. Tạo hook mới:
```javascript
// hooks/useVoiceInput.js
export const useVoiceInput = () => {
  const [recording, setRecording] = useState(false);
  
  const startRecording = () => { ... };
  const stopRecording = () => { ... };
  
  return { recording, startRecording, stopRecording };
};
```

2. Tạo component mới:
```javascript
// components/VoiceInput.jsx
function VoiceInput({ onRecord }) {
  return <button onClick={onRecord}>🎤</button>;
}
```

3. Sử dụng trong ChatAi.jsx:
```javascript
const { recording, startRecording } = useVoiceInput();

return (
  <div>
    <VoiceInput onRecord={startRecording} />
  </div>
);
```

---

### **Sửa bug**

**Ví dụ: Fix lỗi scroll**

1. Mở `ChatMessages.jsx`
2. Sửa logic scroll
3. Không ảnh hưởng code khác

---

### **Thay đổi UI**

**Ví dụ: Đổi màu button**

1. Mở `ChatInput.module.scss` (nếu có)
2. Hoặc sửa trong `ChatAi.module.scss`
3. Không ảnh hưởng logic

---

## 📝 Best Practices

### **1. Separation of Concerns**
- **Hooks**: Business logic
- **Components**: UI rendering
- **Main file**: Kết nối hooks + components

### **2. Single Responsibility**
- Mỗi file chỉ làm 1 việc
- Mỗi function chỉ làm 1 việc

### **3. Props Drilling**
- Truyền props rõ ràng
- Không truyền quá nhiều props
- Dùng composition thay vì inheritance

### **4. Naming Convention**
- **Hooks**: `use` prefix (useChatSession)
- **Components**: PascalCase (ChatMessages)
- **Handlers**: `handle` prefix (handleSendMessage)
- **Props callbacks**: `on` prefix (onSend, onSelect)

---

## 🎓 Học từ refactor này

### **Khi nào nên tách file?**
- File > 300 dòng
- Có nhiều responsibilities
- Khó đọc, khó maintain
- Muốn tái sử dụng logic

### **Cách tách:**
1. Tách logic ra hooks
2. Tách UI ra components
3. Main file chỉ kết nối

### **Lưu ý:**
- Không tách quá nhỏ (< 20 dòng)
- Không tách nếu chỉ dùng 1 lần
- Cân nhắc giữa tách file vs độ phức tạp

---

**Tạo bởi:** AI Assistant  
**Ngày:** 2025-10-29  
**Version:** 2.0.0 (Refactored)

