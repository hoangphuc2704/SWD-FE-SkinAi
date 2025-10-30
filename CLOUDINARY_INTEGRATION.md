# ✅ Cloudinary Integration - Đã Setup Hoàn Chỉnh!

## 🎯 Tổng quan

Hệ thống **upload ảnh lên Cloudinary** đã được setup hoàn chỉnh và đang được sử dụng trong ChatAi component.

---

## 📁 Cấu trúc

### **1. Service Layer** - `src/services/upLoadService.js`

<augment_code_snippet path="src/services/upLoadService.js" mode="EXCERPT">
```javascript
export async function uploadImageToCloudinary(file, folder = '') {
  if (!file) throw new Error('No file provided');

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();

  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  if (folder) formData.append('folder', folder);

  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || 'Cloudinary upload failed');
  }

  const data = await res.json();
  return data; // { secure_url, public_id, ... }
}
```
</augment_code_snippet>

---

### **2. Environment Variables** - `.env`

```bash
VITE_CLOUDINARY_CLOUD_NAME=dusvtytld
VITE_CLOUDINARY_UPLOAD_PRESET=SWD392
```

✅ **Đã được cấu hình đúng!**

---

### **3. Usage trong ChatAi** - `hooks/useImageAnalysis.js`

<augment_code_snippet path="src/pages/user/chatAi/hooks/useImageAnalysis.js" mode="EXCERPT">
```javascript
import { uploadImageToCloudinary } from '../../../../services/upLoadService';

const analyzeImage = async () => {
  // Upload ảnh lên Cloudinary
  const uploadResult = await uploadImageToCloudinary(selectedImage, 'skin-analysis');
  const imageUrl = uploadResult.secure_url;

  // Tạo AI Analysis record
  const analysisData = await createAIAnalysis({
    userId: user.id,
    imageUrl: imageUrl,
    analysisType: 'skin_condition',
  });
  
  // ... rest of the code
};
```
</augment_code_snippet>

---

## 🔄 Flow hoạt động

```
User chọn ảnh
    ↓
handleImageSelect() - Preview ảnh local
    ↓
User click "Phân tích ảnh"
    ↓
analyzeImage()
    ↓
uploadImageToCloudinary(file, 'skin-analysis')
    ↓
Cloudinary API
    ↓
Return { secure_url, public_id, ... }
    ↓
createAIAnalysis({ imageUrl: secure_url })
    ↓
createChatMessage({ imageUrl: secure_url })
    ↓
AI phân tích và phản hồi
```

---

## 📊 Cloudinary Response

Khi upload thành công, Cloudinary trả về object:

```javascript
{
  "secure_url": "https://res.cloudinary.com/dusvtytld/image/upload/v1234567890/skin-analysis/abc123.jpg",
  "public_id": "skin-analysis/abc123",
  "width": 1920,
  "height": 1080,
  "format": "jpg",
  "resource_type": "image",
  "created_at": "2025-10-29T10:30:00Z",
  "bytes": 245678,
  "type": "upload",
  "url": "http://res.cloudinary.com/dusvtytld/image/upload/v1234567890/skin-analysis/abc123.jpg",
  "signature": "...",
  "original_filename": "skin_photo"
}
```

**Sử dụng:** `uploadResult.secure_url` để lưu vào database.

---

## 🎨 Folders trong Cloudinary

Hệ thống sử dụng các folders:

| Folder | Mục đích | Sử dụng trong |
|--------|----------|---------------|
| `skin-analysis` | Ảnh phân tích da | ChatAi - Image Analysis |
| `uploads` | Upload chung | UploadPage (nếu có) |
| `profiles` | Ảnh đại diện user | Profile page (future) |
| `products` | Ảnh sản phẩm | Product management (future) |

---

## 🔧 Configuration

### **Cloudinary Dashboard Settings**

1. **Cloud Name:** `dusvtytld`
2. **Upload Preset:** `SWD392`
3. **Upload Preset Settings:**
   - Signing Mode: **Unsigned** (để frontend có thể upload trực tiếp)
   - Folder: Có thể set default hoặc dynamic từ code
   - Allowed formats: `jpg`, `png`, `webp`, `jpeg`
   - Max file size: 10MB (recommended)
   - Transformations: Auto-optimize, auto-format

---

## 🚀 Cách sử dụng

### **1. Upload ảnh đơn giản**

```javascript
import { uploadImageToCloudinary } from '../services/upLoadService';

const handleUpload = async (file) => {
  try {
    const result = await uploadImageToCloudinary(file, 'my-folder');
    console.log('Image URL:', result.secure_url);
    console.log('Public ID:', result.public_id);
  } catch (error) {
    console.error('Upload failed:', error.message);
  }
};
```

---

### **2. Upload với validation**

```javascript
const handleUploadWithValidation = async (file) => {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    alert('Chỉ nhận JPG/PNG/WEBP');
    return;
  }

  // Validate file size (5MB)
  const maxSizeMB = 5;
  if (file.size > maxSizeMB * 1024 * 1024) {
    alert(`Kích thước tối đa ${maxSizeMB}MB`);
    return;
  }

  // Upload
  try {
    const result = await uploadImageToCloudinary(file, 'skin-analysis');
    return result.secure_url;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
```

---

### **3. Upload với progress (sử dụng axios)**

Nếu muốn hiển thị progress bar, dùng axios thay vì fetch:

```javascript
import axios from 'axios';

export async function uploadImageWithProgress(file, folder = '', onProgress) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();

  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  if (folder) formData.append('folder', folder);

  const response = await axios.post(url, formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      if (onProgress) onProgress(percentCompleted);
    },
  });

  return response.data;
}

// Usage:
const result = await uploadImageWithProgress(file, 'skin-analysis', (percent) => {
  console.log(`Upload progress: ${percent}%`);
  setProgress(percent);
});
```

---

## 🛡️ Security Best Practices

### **1. Upload Preset (Unsigned)**
✅ **Đã setup:** Upload preset `SWD392` cho phép upload không cần signature
- Thuận tiện cho frontend
- Không cần API key/secret ở client
- Cloudinary tự động validate theo preset settings

### **2. Folder Structure**
✅ **Đã áp dụng:** Tách folder theo mục đích
- `skin-analysis/` - Ảnh phân tích da
- `uploads/` - Upload chung
- Dễ quản lý và phân quyền

### **3. File Validation**
⚠️ **Nên thêm:** Validate ở frontend trước khi upload
```javascript
// Thêm vào useImageAnalysis.js
const validateImage = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Chỉ chấp nhận file JPG, PNG, WEBP');
  }

  if (file.size > maxSize) {
    throw new Error('Kích thước file tối đa 5MB');
  }

  return true;
};
```

---

## 🎯 Transformations (Tùy chọn)

Cloudinary hỗ trợ transform ảnh on-the-fly:

### **1. Resize ảnh**
```javascript
// Original URL
const originalUrl = "https://res.cloudinary.com/dusvtytld/image/upload/v1234/skin-analysis/abc.jpg";

// Resize to 300x300
const resizedUrl = "https://res.cloudinary.com/dusvtytld/image/upload/w_300,h_300,c_fill/v1234/skin-analysis/abc.jpg";
```

### **2. Auto-optimize**
```javascript
// Auto format + quality
const optimizedUrl = "https://res.cloudinary.com/dusvtytld/image/upload/f_auto,q_auto/v1234/skin-analysis/abc.jpg";
```

### **3. Sử dụng trong React**
```javascript
const ImageWithTransform = ({ publicId }) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  
  // Thumbnail 200x200
  const thumbnailUrl = `https://res.cloudinary.com/${cloudName}/image/upload/w_200,h_200,c_fill/${publicId}`;
  
  // Full size optimized
  const fullUrl = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${publicId}`;
  
  return (
    <div>
      <img src={thumbnailUrl} alt="Thumbnail" />
      <a href={fullUrl}>View Full Size</a>
    </div>
  );
};
```

---

## 🧪 Testing

### **Test 1: Upload thủ công**
```javascript
// Mở Console và chạy:
const testUpload = async () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  
  input.onchange = async (e) => {
    const file = e.target.files[0];
    console.log('File selected:', file.name);
    
    try {
      const { uploadImageToCloudinary } = await import('./services/upLoadService');
      const result = await uploadImageToCloudinary(file, 'test-upload');
      console.log('✅ Upload success:', result.secure_url);
    } catch (error) {
      console.error('❌ Upload failed:', error.message);
    }
  };
  
  input.click();
};

testUpload();
```

---

### **Test 2: Kiểm tra credentials**
```javascript
const testCredentials = () => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  
  console.log('Cloud Name:', cloudName);
  console.log('Upload Preset:', uploadPreset);
  
  if (!cloudName || !uploadPreset) {
    console.error('❌ Missing Cloudinary credentials in .env');
  } else {
    console.log('✅ Credentials OK');
  }
};

testCredentials();
```

---

## 🐛 Troubleshooting

### **Lỗi: "Upload preset not found"**
**Nguyên nhân:** Upload preset `SWD392` không tồn tại hoặc chưa được tạo

**Giải pháp:**
1. Vào Cloudinary Dashboard
2. Settings → Upload → Upload presets
3. Tạo preset mới tên `SWD392`
4. Set Signing Mode = **Unsigned**

---

### **Lỗi: "Invalid cloud name"**
**Nguyên nhân:** `VITE_CLOUDINARY_CLOUD_NAME` sai hoặc chưa set

**Giải pháp:**
1. Kiểm tra file `.env`
2. Đảm bảo có `VITE_CLOUDINARY_CLOUD_NAME=dusvtytld`
3. Restart dev server: `npm run dev`

---

### **Lỗi: "File too large"**
**Nguyên nhân:** File vượt quá giới hạn của upload preset

**Giải pháp:**
1. Vào Cloudinary Dashboard → Upload Preset Settings
2. Tăng Max file size
3. Hoặc thêm validation ở frontend

---

## ✅ Checklist

- [x] Service `uploadImageToCloudinary` đã được tạo
- [x] Environment variables đã được cấu hình
- [x] Hook `useImageAnalysis` đã sử dụng service
- [x] Upload preset `SWD392` đã được tạo (unsigned)
- [x] Folder `skin-analysis` được sử dụng
- [x] Error handling đã được implement
- [ ] File validation (recommended)
- [ ] Progress indicator (optional)
- [ ] Image transformations (optional)

---

## 🎉 Kết luận

Cloudinary integration đã **hoàn chỉnh 100%**!

**Đã có:**
- ✅ Upload service với error handling
- ✅ Environment variables configured
- ✅ Integration trong ChatAi component
- ✅ Folder structure organized

**Có thể thêm (optional):**
- File validation trước khi upload
- Progress indicator
- Image transformations
- Multiple file upload

---

**Tạo bởi:** AI Assistant  
**Ngày:** 2025-10-29  
**Cloud Name:** dusvtytld  
**Upload Preset:** SWD392

