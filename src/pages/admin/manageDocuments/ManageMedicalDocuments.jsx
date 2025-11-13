import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../Admin.module.scss';
import { deleteMedia } from '../../../apis/mediaApi';
import { uploadFileToCloudinary } from '../../../services/upLoadService';
import {
  DOCUMENT_LIBRARY_EVENT,
  addDocumentLibraryItem,
  readDocumentLibrary,
  removeDocumentLibraryItem,
  updateDocumentLibraryItem,
} from '../../../utils/documentLibrary';

const cx = classNames.bind(styles);

const formatBytes = (bytes) => {
  if (!bytes || Number.isNaN(Number(bytes))) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = Number(bytes);
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

const formatDateTime = (value) => {
  if (!value) return '';
  try {
    const date = new Date(value);
    return date.toLocaleString();
  } catch {
    return value;
  }
};

function ManageMedicalDocuments() {
  const [library, setLibrary] = useState(() => readDocumentLibrary());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Media upload
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadFolder, setUploadFolder] = useState('routine-docs');
  const [lastUploaded, setLastUploaded] = useState(null);
  const [uploadError, setUploadError] = useState('');
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const sync = () => setLibrary(readDocumentLibrary());
    window.addEventListener(DOCUMENT_LIBRARY_EVENT, sync);
    return () => window.removeEventListener(DOCUMENT_LIBRARY_EVENT, sync);
  }, []);

  const filteredLibrary = useMemo(() => {
    if (!search) return library;
    const keyword = search.toLowerCase();
    return library.filter((item) => {
      const haystack = [item.title, item.originalFilename, item.note, item.publicId]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(keyword);
    });
  }, [library, search]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return alert('Vui lòng chọn một file trước');
    setUploading(true);
    setUploadError('');
    setLastUploaded(null);
    try {
      const resourceType = uploadFile.type?.startsWith('image/') ? 'image' : 'auto';
      const data = await uploadFileToCloudinary(
        uploadFile,
        uploadFolder || undefined,
        resourceType
      );
      const url = data?.secure_url || data?.url;
      if (!url) throw new Error('Không nhận được URL sau khi upload.');

      const id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `doc-${Date.now()}`;

      const entry = {
        id,
        title: uploadFile?.name || data.publicId || data.public_id || id,
        originalFilename: uploadFile?.name || data.original_filename || data.originalFilename,
        url,
        publicId: data.public_id || data.publicId,
        folder: data.folder || uploadFolder || '',
        bytes: data.bytes,
        format: data.format,
        resourceType: data.resource_type || data.resourceType || uploadFile?.type || 'file',
        uploadedAt: data.created_at || new Date().toISOString(),
        note: '',
      };

      const next = addDocumentLibraryItem(entry);
      setLibrary(next);
      setLastUploaded(entry);
      setUploadFile(null);

      try {
        await navigator.clipboard.writeText(url);
      } catch {
        // ignore clipboard failure
      }
    } catch (err) {
      setUploadError(err?.response?.data?.message || err.message || 'Upload thất bại');
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      console.error('Copy failed', err);
      alert('Không thể copy URL, vui lòng copy thủ công.');
    }
  };

  const handleRename = (item) => {
    const nextTitle = window.prompt('Nhập tên hiển thị cho tài liệu', item.title || '');
    if (!nextTitle || nextTitle === item.title) return;
    const next = updateDocumentLibraryItem(item.id, { title: nextTitle });
    setLibrary(next);
  };

  const handleNote = (item) => {
    const nextNote = window.prompt('Ghi chú (ví dụ tóm tắt nội dung)', item.note || '');
    if (nextNote === null) return;
    const next = updateDocumentLibraryItem(item.id, { note: nextNote });
    setLibrary(next);
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Xóa tài liệu này và file trên Cloudinary?')) return;
    setLoading(true);
    setError('');
    try {
      if (item.publicId) {
        await deleteMedia(item.publicId);
      }
      const next = removeDocumentLibraryItem(item.id);
      setLibrary(next);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Không thể xóa file');
    } finally {
      setLoading(false);
    }
  };

  const showImagePreview = Boolean(
    lastUploaded &&
      typeof lastUploaded.resourceType === 'string' &&
      lastUploaded.resourceType.toLowerCase().startsWith('image')
  );

  return (
    <div className={cx('tableCard')}>
      <div className={cx('tableHeader')}>
        <h3> Thư viện tài liệu</h3>
        <div className={cx('searchBox')}>
          <input
            type="text"
            placeholder="Tìm theo tên file, ghi chú hoặc publicId..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => setLibrary(readDocumentLibrary())}>Làm mới</button>
        </div>
      </div>

      {error && <div style={{ padding: '0 1.5rem', color: 'red' }}>{error}</div>}
      {loading && <div style={{ padding: '0 1.5rem' }}>Đang xử lý...</div>}

      <div style={{ padding: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
        <h4> Upload tài liệu </h4>
        <form
          onSubmit={handleUpload}
          style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}
        >
          <input type="file" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} />
          <input
            type="text"
            placeholder="Thư mục (folder)"
            value={uploadFolder}
            onChange={(e) => setUploadFolder(e.target.value)}
            style={{ minWidth: 200 }}
          />
          <button type="submit" className={cx('navItem')} disabled={uploading}>
            {uploading ? 'Đang upload...' : 'Upload'}
          </button>
        </form>
        {uploadError && <div style={{ marginTop: 8, color: 'red' }}>{uploadError}</div>}
        {lastUploaded && (
          <div style={{ marginTop: 12 }}>
            <div>
              <b>publicId:</b> {lastUploaded.publicId}
            </div>
            <div>
              <b>url:</b>{' '}
              <a href={lastUploaded.url} target="_blank" rel="noreferrer">
                {lastUploaded.url}
              </a>
            </div>
            {showImagePreview && (
              <div style={{ marginTop: 8 }}>
                <img
                  src={lastUploaded.url}
                  alt="uploaded"
                  style={{ maxWidth: 360, border: '1px solid #e5e7eb', borderRadius: 8 }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className={cx('tableWrapper')}>
        {filteredLibrary.length ? (
          <table>
            <thead>
              <tr>
                <th>Tên hiển thị</th>
                <th>Thông tin file</th>
                <th>Tải lên</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredLibrary.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div>{item.title || item.originalFilename || item.publicId}</div>
                    {item.note && <div style={{ color: '#6b7280', fontSize: 12 }}>{item.note}</div>}
                  </td>
                  <td>
                    <div>{item.originalFilename || '-'}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                      {(item.format || item.resourceType || '').toString().toUpperCase()}
                      {item.bytes ? ` • ${formatBytes(item.bytes)}` : ''}
                    </div>
                  </td>
                  <td>{formatDateTime(item.uploadedAt)}</td>
                  <td>
                    <div className={cx('actions')}>
                      <button
                        className={cx('edit')}
                        onClick={() => window.open(item.url, '_blank')}
                      >
                        Xem
                      </button>
                      <button className={cx('edit')} onClick={() => handleCopyUrl(item.url)}>
                        Copy URL
                      </button>
                      <button className={cx('edit')} onClick={() => handleRename(item)}>
                        Đổi tên
                      </button>
                      <button className={cx('edit')} onClick={() => handleNote(item)}>
                        Ghi chú
                      </button>
                      <button className={cx('delete')} onClick={() => handleDelete(item)}>
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '1rem', color: '#6b7280' }}>
            Chưa có tài liệu nào. Hãy upload file để sử dụng cho việc xây dựng routine.
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageMedicalDocuments;
