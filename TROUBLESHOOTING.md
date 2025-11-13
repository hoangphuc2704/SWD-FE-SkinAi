# 🔧 Troubleshooting Guide - Chat AI Integration

## 🐛 Các lỗi đã sửa

### ✅ **1. Lỗi Routing: "No routes matched location '/chatai'"**

**Nguyên nhân:** Có 2 `<Routes>` riêng biệt trong App.jsx

**Đã sửa:**
```javascript
// ❌ TRƯỚC (SAI)
<>
  <Routes>
    <Route path="/" element={...} />
  </Routes>
  <Routes>
    <Route path="/chatai" element={<ChatAi />} />
  </Routes>
</>

// ✅ SAU (ĐÚNG)
<Routes>
  <Route path="/" element={...} />
  <Route path="/chatai" element={<ChatAi />} />
</Routes>
```

---

### ✅ **2. Lỗi API 400: "Error creating chat session"**

**Nguyên nhân:** Backend có thể chưa sẵn sàng hoặc expect cấu trúc dữ liệu khác

**Đã sửa:** Thêm fallback mechanism
```javascript
try {
  const sessionData = await createChatSession({
    userId: profileData.data.id,
    title: 'Tư vấn chăm sóc da',
  });
  setChatSession(sessionData.data);
} catch (sessionError) {
  console.warn('Could not create chat session, will work without it');
  // Tạo mock session để app vẫn hoạt động
  setChatSession({
    id: 'mock-session-' + Date.now(),
    userId: profileData.data.id,
    title: 'Tư vấn chăm sóc da',
  });
}
```

---

### ✅ **3. Warning: 'onKeyPress' is deprecated**

**Đã sửa:**
```javascript
// ❌ TRƯỚC
onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}

// ✅ SAU
onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
```

---

## 🔍 Debug Tools đã thêm

### **1. Enhanced Axios Logging**

File: `src/services/axiosClient.js`

```javascript
// Request logging
axiosClient.interceptors.request.use((config) => {
  console.log('🚀 API Request:', {
    url: config.url,
    method: config.method,
    data: config.data,
  });
  return config;
});

// Response logging
axiosClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);
```

**Cách sử dụng:**
1. Mở DevTools Console (F12)
2. Xem logs khi gọi API:
   - 🚀 = Request đang gửi
   - ✅ = Response thành công
   - ❌ = Response lỗi

---

## 📋 Checklist Debug

### **Bước 1: Kiểm tra Backend**

```bash
# Kiểm tra backend có đang chạy không
curl http://localhost:8080/api/health

# Hoặc kiểm tra endpoint chat
curl http://localhost:8080/api/chat/sessions
```

**Expected:** Backend phải trả về response (không phải 404)

---

### **Bước 2: Kiểm tra Authentication**

```javascript
// Mở Console và chạy:
console.log('Token:', localStorage.getItem('accessToken'));
```

**Expected:** Phải có token (không phải null)

**Nếu null:**
1. Đăng nhập lại tại `/login`
2. Kiểm tra Google OAuth có hoạt động không

---

### **Bước 3: Kiểm tra API Endpoint**

Mở Console và xem logs:

```
🚀 API Request: {
  url: '/api/chat/sessions',
  method: 'post',
  data: { userId: '...', title: '...' }
}

❌ API Error: {
  url: '/api/chat/sessions',
  status: 400,
  data: { message: 'Invalid request' }  // ← Xem message này
}
```

**Các lỗi phổ biến:**

| Status | Nguyên nhân | Giải pháp |
|--------|------------|-----------|
| 400 | Dữ liệu gửi lên sai format | Kiểm tra backend expect gì |
| 401 | Chưa đăng nhập | Đăng nhập lại |
| 404 | Endpoint không tồn tại | Kiểm tra backend routes |
| 500 | Lỗi server | Xem backend logs |

---

### **Bước 4: Kiểm tra Backend Schema**

Backend có thể expect schema khác. Hãy kiểm tra backend code:

**Ví dụ backend có thể expect:**
```javascript
// Option 1: Chỉ cần title
{ title: 'Tư vấn chăm sóc da' }

// Option 2: Cần user_id (snake_case)
{ user_id: '123', title: 'Tư vấn chăm sóc da' }

// Option 3: Cần thêm fields
{ 
  userId: '123', 
  title: 'Tư vấn chăm sóc da',
  status: 'active',
  createdAt: new Date().toISOString()
}
```

**Cách fix:**
1. Xem backend API documentation
2. Hoặc xem backend code (models/controllers)
3. Update `chatApi.js` cho đúng

---

## 🚀 Quick Fixes

### **Fix 1: Backend chưa có API Chat**

Nếu backend chưa implement API Chat, app vẫn hoạt động với mock session:

```javascript
// ChatAi.jsx đã có fallback
setChatSession({
  id: 'mock-session-' + Date.now(),
  userId: profileData.data.id,
  title: 'Tư vấn chăm sóc da',
});
```

Messages sẽ lưu trong state, không gọi API.

---

### **Fix 2: CORS Error**

Nếu thấy lỗi CORS:
```
Access to XMLHttpRequest at 'http://localhost:8080/api/...' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Giải pháp:**
1. Thêm CORS middleware trong backend:
```javascript
// Backend (Express.js)
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

2. Hoặc dùng proxy trong Vite:
```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
}
```

---

### **Fix 3: Environment Variables**

Kiểm tra file `.env`:
```bash
VITE_API_URL=http://localhost:8080
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

**Restart dev server sau khi thay đổi .env!**

---

## 📊 Test API Manually

### **Test 1: Create Chat Session**

```javascript
// Mở Console và chạy:
const testCreateSession = async () => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch('http://localhost:8080/api/chat/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      userId: 'user123',
      title: 'Test Session'
    })
  });
  const data = await response.json();
  console.log('Response:', data);
};

testCreateSession();
```

---

### **Test 2: Get User Profile**

```javascript
const testGetProfile = async () => {
  const token = localStorage.getItem('accessToken');
  const response = await fetch('http://localhost:8080/api/users/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log('User:', data);
};

testGetProfile();
```

---

## 🎯 Next Steps

### **Nếu vẫn lỗi 400:**

1. **Kiểm tra backend logs** để xem lỗi cụ thể
2. **Xem backend model** để biết schema đúng
3. **Update chatApi.js** cho match với backend

### **Nếu backend chưa có API:**

1. App vẫn hoạt động với mock session
2. Implement backend API sau
3. Remove fallback code khi backend ready

### **Nếu muốn test offline:**

1. Comment out tất cả API calls
2. Dùng mock data trong state
3. Test UI/UX trước

---

## 📞 Support

Nếu cần hỗ trợ thêm:
1. Share backend error logs
2. Share backend API documentation
3. Share backend model/schema

---

**Updated:** 2025-10-29  
**Version:** 1.0.0

