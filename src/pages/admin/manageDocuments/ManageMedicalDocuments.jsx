import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../Admin.module.scss';
import {
  getAllMedicalDocuments,
  createMedicalDocument,
  updateMedicalDocument,
  deleteMedicalDocument,
} from '../../../apis/medicalDocumentApi';

const cx = classNames.bind(styles);

const initialForm = {
  title: '',
  content: '',
  source: '',
  status: 'active',
};

function ManageMedicalDocuments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllMedicalDocuments();
      setDocuments(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Lỗi tải tài liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = documents.filter(
    (d) =>
      (d.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.source || '').toLowerCase().includes(search.toLowerCase())
  );

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        title: form.title || undefined,
        content: form.content || undefined,
        source: form.source || undefined,
        status: form.status || undefined,
      };
      await createMedicalDocument(payload);
      await load();
      setForm(initialForm);
      alert('Đã tạo tài liệu');
    } catch (e2) {
      setError(e2?.response?.data?.message || e2.message || 'Lỗi tạo tài liệu');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (doc) => {
    setEditingId(doc.id);
    setForm({
      title: doc.title || '',
      content: doc.content || '',
      source: doc.source || '',
      status: doc.status || 'active',
    });
  };

  const submitUpdate = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    setLoading(true);
    setError('');
    try {
      const payload = {
        title: form.title || undefined,
        content: form.content || undefined,
        source: form.source || undefined,
        status: form.status || undefined,
      };
      await updateMedicalDocument(editingId, payload);
      await load();
      setEditingId('');
      setForm(initialForm);
      alert('Đã cập nhật tài liệu');
    } catch (e2) {
      setError(e2?.response?.data?.message || e2.message || 'Lỗi cập nhật tài liệu');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Xóa tài liệu này?')) return;
    setLoading(true);
    setError('');
    try {
      await deleteMedicalDocument(id);
      await load();
      alert('Đã xóa');
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Lỗi xóa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx('tableCard')}>
      <div className={cx('tableHeader')}>
        <h3>📚 Quản lý Tài liệu Y khoa</h3>
        <div className={cx('searchBox')}>
          <input
            type="text"
            placeholder="Tìm theo tiêu đề hoặc nguồn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={load}>Làm mới</button>
        </div>
      </div>

      {error && <div style={{ padding: '0 1.5rem', color: 'red' }}>{error}</div>}
      {loading && <div style={{ padding: '0 1.5rem' }}>Đang xử lý...</div>}

      <div className={cx('tableWrapper')}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu đề</th>
              <th>Nguồn</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.title}</td>
                <td>{d.source}</td>
                <td>
                  <span className={cx('badge', d.status)}>{d.status}</span>
                </td>
                <td>
                  <div className={cx('actions')}>
                    <button className={cx('edit')} onClick={() => startEdit(d)}>
                      Sửa
                    </button>
                    <button className={cx('delete')} onClick={() => remove(d.id)}>
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <h4>{editingId ? 'Cập nhật tài liệu' : 'Tạo tài liệu mới'}</h4>
        <form onSubmit={editingId ? submitUpdate : submitCreate}>
          <div style={{ display: 'grid', gap: '0.75rem', maxWidth: 800 }}>
            <input
              type="text"
              name="title"
              placeholder="Tiêu đề"
              value={form.title}
              onChange={onChange}
            />
            <textarea
              name="content"
              placeholder="Nội dung"
              value={form.content}
              onChange={onChange}
              rows={4}
            />
            <input
              type="text"
              name="source"
              placeholder="Nguồn (URL, tạp chí,...)"
              value={form.source}
              onChange={onChange}
            />
            <select name="status" value={form.status} onChange={onChange}>
              <option value="active">active</option>
              <option value="inactive">inactive</option>
              <option value="draft">draft</option>
            </select>

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className={cx('navItem')} style={{ width: 'auto' }}>
                {editingId ? 'Cập nhật' : 'Tạo mới'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className={cx('navItem')}
                  onClick={() => {
                    setEditingId('');
                    setForm(initialForm);
                  }}
                >
                  Hủy
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManageMedicalDocuments;
