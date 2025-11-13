# 🧪 Hướng dẫn Test API cho Chat AI

## 📋 Checklist Test

### ✅ 1. Test Authentication & User Profile
```javascript
// Test 1: Lấy thông tin user
import { getProfile } from '../../../apis/userApi';

const testGetProfile = async () => {
  try {
    const result = await getProfile();
    console.log('✅ User Profile:', result.data);
    return result.data;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};
```

**Expected Response:**
```json
{
  "data": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

---

### ✅ 2. Test Chat Session
```javascript
// Test 2: Tạo chat session
import { createChatSession } from '../../../apis/chatApi';

const testCreateChatSession = async (userId) => {
  try {
    const result = await createChatSession({
      userId: userId,
      title: 'Tư vấn chăm sóc da',
    });
    console.log('✅ Chat Session Created:', result.data);
    return result.data;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};
```

**Expected Response:**
```json
{
  "data": {
    "id": "session123",
    "userId": "user123",
    "title": "Tư vấn chăm sóc da",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

---

### ✅ 3. Test Chat Messages
```javascript
// Test 3: Gửi tin nhắn
import { createChatMessage } from '../../../apis/chatApi';

const testSendMessage = async (sessionId) => {
  try {
    const result = await createChatMessage(sessionId, {
      role: 'user',
      content: 'Xin chào, tôi muốn tư vấn về da mụn',
    });
    console.log('✅ Message Sent:', result.data);
    return result.data;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};
```

**Expected Response:**
```json
{
  "data": {
    "id": "msg123",
    "sessionId": "session123",
    "role": "user",
    "content": "Xin chào, tôi muốn tư vấn về da mụn",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

---

### ✅ 4. Test User Symptoms
```javascript
// Test 4: Lưu triệu chứng
import { createUserSymptom } from '../../../apis/symptomApi';

const testCreateSymptom = async (userId) => {
  try {
    const result = await createUserSymptom({
      userId: userId,
      symptomName: 'Mụn trứng cá và mụn đầu đen',
      severity: 'moderate',
    });
    console.log('✅ Symptom Created:', result.data);
    return result.data;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};
```

**Expected Response:**
```json
{
  "data": {
    "id": "symptom123",
    "userId": "user123",
    "symptomName": "Mụn trứng cá và mụn đầu đen",
    "severity": "moderate",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

---

### ✅ 5. Test Image Upload & AI Analysis
```javascript
// Test 5a: Upload ảnh lên Cloudinary
import { uploadImageToCloudinary } from '../../../services/upLoadService';

const testUploadImage = async (file) => {
  try {
    const result = await uploadImageToCloudinary(file, 'skin-analysis');
    console.log('✅ Image Uploaded:', result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

// Test 5b: Tạo AI Analysis
import { createAIAnalysis } from '../../../apis/aiApi';

const testCreateAIAnalysis = async (userId, imageUrl) => {
  try {
    const result = await createAIAnalysis({
      userId: userId,
      imageUrl: imageUrl,
      analysisType: 'skin_condition',
    });
    console.log('✅ AI Analysis Created:', result.data);
    return result.data;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};
```

**Expected Response:**
```json
{
  "data": {
    "id": "analysis123",
    "userId": "user123",
    "imageUrl": "https://res.cloudinary.com/.../image.jpg",
    "analysisType": "skin_condition",
    "status": "pending",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

---

### ✅ 6. Test AI Response
```javascript
// Test 6: Lưu AI response
import { createAIResponse } from '../../../apis/aiApi';

const testCreateAIResponse = async (analysisId) => {
  try {
    const result = await createAIResponse({
      analysisId: analysisId,
      responseText: 'Dựa trên phân tích, da bạn thuộc loại da hỗn hợp...',
      confidence: 0.85,
    });
    console.log('✅ AI Response Created:', result.data);
    return result.data;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};
```

**Expected Response:**
```json
{
  "data": {
    "id": "response123",
    "analysisId": "analysis123",
    "responseText": "Dựa trên phân tích, da bạn thuộc loại da hỗn hợp...",
    "confidence": 0.85,
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

---

### ✅ 7. Test Create Routine
```javascript
// Test 7: Tạo routine
import { createRoutine } from '../../../apis/routineApi';

const testCreateRoutine = async (userId) => {
  try {
    const result = await createRoutine({
      userId: userId,
      name: 'Lộ trình chăm sóc Da hỗn hợp - Mụn trứng cá',
      description: 'Lộ trình được AI tư vấn dựa trên phân tích da',
      skinType: 'Da hỗn hợp',
      targetProblem: 'Mụn trứng cá và mụn đầu đen',
      duration: 30,
    });
    console.log('✅ Routine Created:', result.data);
    return result.data;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};
```

**Expected Response:**
```json
{
  "data": {
    "id": "routine123",
    "userId": "user123",
    "name": "Lộ trình chăm sóc Da hỗn hợp - Mụn trứng cá",
    "description": "Lộ trình được AI tư vấn dựa trên phân tích da",
    "skinType": "Da hỗn hợp",
    "targetProblem": "Mụn trứng cá và mụn đầu đen",
    "duration": 30,
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

---

### ✅ 8. Test Create Routine Instance
```javascript
// Test 8: Tạo routine instance
import { createRoutineInstance } from '../../../apis/routineInstanceApi';

const testCreateRoutineInstance = async (userId, routineId) => {
  try {
    const result = await createRoutineInstance({
      userId: userId,
      routineId: routineId,
      startDate: new Date().toISOString(),
      status: 'active',
    });
    console.log('✅ Routine Instance Created:', result.data);
    return result.data;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};
```

**Expected Response:**
```json
{
  "data": {
    "id": "instance123",
    "userId": "user123",
    "routineId": "routine123",
    "startDate": "2025-01-01T00:00:00Z",
    "status": "active",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

---

## 🔄 Full Flow Test

```javascript
// Test toàn bộ flow từ đầu đến cuối
const testFullChatFlow = async () => {
  console.log('🚀 Starting Full Chat Flow Test...\n');

  // 1. Get user profile
  console.log('1️⃣ Getting user profile...');
  const user = await testGetProfile();
  if (!user) return;

  // 2. Create chat session
  console.log('\n2️⃣ Creating chat session...');
  const session = await testCreateChatSession(user.id);
  if (!session) return;

  // 3. Send welcome message
  console.log('\n3️⃣ Sending welcome message...');
  await testSendMessage(session.id);

  // 4. Save symptom
  console.log('\n4️⃣ Saving user symptom...');
  await testCreateSymptom(user.id);

  // 5. Upload image (giả sử có file)
  console.log('\n5️⃣ Uploading skin image...');
  // const imageUrl = await testUploadImage(file);

  // 6. Create AI analysis
  console.log('\n6️⃣ Creating AI analysis...');
  const imageUrl = 'https://example.com/skin-image.jpg'; // Mock URL
  const analysis = await testCreateAIAnalysis(user.id, imageUrl);
  if (!analysis) return;

  // 7. Create AI response
  console.log('\n7️⃣ Creating AI response...');
  await testCreateAIResponse(analysis.id);

  // 8. Create routine
  console.log('\n8️⃣ Creating skincare routine...');
  const routine = await testCreateRoutine(user.id);
  if (!routine) return;

  // 9. Create routine instance
  console.log('\n9️⃣ Creating routine instance...');
  await testCreateRoutineInstance(user.id, routine.id);

  console.log('\n✅ Full Chat Flow Test Completed!');
};

// Run test
testFullChatFlow();
```

---

## 🐛 Common Errors & Solutions

### Error 1: 401 Unauthorized
```
Error: Request failed with status code 401
```
**Solution:** User chưa đăng nhập. Kiểm tra token trong localStorage.

### Error 2: 404 Not Found
```
Error: Request failed with status code 404
```
**Solution:** API endpoint không tồn tại. Kiểm tra lại URL trong file API.

### Error 3: 500 Internal Server Error
```
Error: Request failed with status code 500
```
**Solution:** Lỗi server. Kiểm tra backend logs hoặc payload gửi lên.

### Error 4: Network Error
```
Error: Network Error
```
**Solution:** Backend không chạy hoặc CORS issue. Kiểm tra baseURL trong axiosClient.

---

## 📊 Test Checklist

- [ ] User profile load thành công
- [ ] Chat session được tạo
- [ ] Tin nhắn được gửi và lưu
- [ ] Symptom được lưu khi chọn vấn đề da
- [ ] Ảnh upload lên Cloudinary thành công
- [ ] AI Analysis được tạo
- [ ] AI Response được lưu
- [ ] Routine được tạo với đầy đủ thông tin
- [ ] Routine Instance được tạo và active
- [ ] UI hiển thị đúng messages
- [ ] Loading state hoạt động
- [ ] Error handling hoạt động

---

## 🎯 Performance Metrics

| Action | Expected Time |
|--------|--------------|
| Load user profile | < 500ms |
| Create chat session | < 300ms |
| Send message | < 200ms |
| Upload image | < 2s |
| AI analysis | < 3s |
| Create routine | < 500ms |

---

**Note:** Đảm bảo backend API đang chạy và có dữ liệu test trước khi chạy các test này!

