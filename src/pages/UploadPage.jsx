// src/pages/UploadPage.jsx
import React, { useState } from 'react';
import { uploadImageToCloudinary } from '../services/upLoadService';
import imageApi from '../apis/imageApi'; // nếu muốn lưu vào BE

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // optional: validate file type & size
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSizeMB = 5;

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (!allowedTypes.includes(f.type)) return alert('Chỉ nhận JPG/PNG/WEBP');
    if (f.size > maxSizeMB * 1024 * 1024) return alert(`Kích thước tối đa ${maxSizeMB}MB`);
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return alert('Chưa chọn file');
    setLoading(true);
    setProgress(0);

    try {
      // Nếu muốn progress chính xác, cần dùng XMLHttpRequest / axios + onUploadProgress,
      // nhưng fetch không có onUploadProgress trên browser. Dùng axios alternative:
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'uploads'); // tuỳ chọn

      // dùng axios để có progress:
      // npm install axios
      // import axios from 'axios';
      // const cloudUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
      // const res = await axios.post(cloudUrl, formData, {
      //   onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
      // });
      //
      // const data = res.data;

      // hoặc nếu dùng fetch (không có progress):
      const data = await uploadImageToCloudinary(file, 'uploads');
      setUrl(data.secure_url);
      setProgress(100);

      // Tuỳ chọn: gửi URL về BE để lưu
      // await imageApi.saveImage({ url: data.secure_url, public_id: data.public_id });

      alert('Upload thành công');
    } catch (err) {
      console.error(err);
      alert('Upload lỗi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Upload image to Cloudinary</h3>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <div style={{ marginTop: 10 }}>
        <button onClick={handleUpload} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      <div style={{ marginTop: 10 }}>
        <div>Progress: {progress}%</div>
        {url && (
          <div style={{ marginTop: 10 }}>
            <img src={url} alt="uploaded" style={{ width: 200 }} />
            <div>
              <a href={url} target="_blank" rel="noreferrer">
                Open image
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
