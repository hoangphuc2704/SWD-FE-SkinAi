import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../Admin.module.scss';
import {
  getDocumentChunksByDocumentId,
  createDocumentChunk,
  updateDocumentChunk,
  deleteDocumentChunk,
} from '../../../apis/documentChunkApi';

const cx = classNames.bind(styles);

const initialForm = {
  docId: '',
  chunkText: '',
};

function ManageDocumentChunks() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chunks, setChunks] = useState([]);
  const [filterDocId, setFilterDocId] = useState('');
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState('');

  // Basic UUID validator
  const isUUID = (v) =>
    typeof v === 'string' &&
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      if (!filterDocId) {
        setChunks([]);
        return;
      }
      if (!isUUID(filterDocId)) {
        setError('Document ID không hợp lệ (UUID)');
        setChunks([]);
        return;
      }
      const data = await getDocumentChunksByDocumentId(filterDocId);
      setChunks(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Lỗi tải document chunks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDocId]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitCreate = async (e) => {
    e.preventDefault();
    if (!form.docId) return alert('Cần nhập docId');
    setLoading(true);
    setError('');
    try {
      const payload = {
        docId: form.docId,
        chunkText: form.chunkText || undefined,
      };
      await createDocumentChunk(payload);
      await load();
      setForm(initialForm);
      alert('Đã tạo chunk');
    } catch (e2) {
      setError(e2?.response?.data?.message || e2.message || 'Lỗi tạo chunk');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setForm({
      docId: c.docId || '',
      chunkText: c.chunkText || '',
    });
  };

  const submitUpdate = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    setLoading(true);
    setError('');
    try {
      const payload = {
        chunkText: form.chunkText || undefined,
      };
      await updateDocumentChunk(editingId, payload);
      await load();
      setEditingId('');
      setForm(initialForm);
      alert('Đã cập nhật chunk');
    } catch (e2) {
      setError(e2?.response?.data?.message || e2.message || 'Lỗi cập nhật chunk');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Xóa chunk này?')) return;
    setLoading(true);
    setError('');
    try {
      await deleteDocumentChunk(id);
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
        <h3>🧩 Quản lý Document Chunks</h3>
        <div className={cx('searchBox')}>
          <input
            type="text"
            placeholder="Lọc theo Document ID (UUID)"
            value={filterDocId}
            onChange={(e) => setFilterDocId(e.target.value)}
          />
          <button onClick={load}>Làm mới</button>
        </div>
      </div>

      {error && <div style={{ padding: '0 1.5rem', color: 'red' }}>{error}</div>}
      {loading && <div style={{ padding: '0 1.5rem' }}>Đang xử lý...</div>}

      {!filterDocId && (
        <div style={{ padding: '0 1.5rem 1rem', color: '#6b7280' }}>
          Nhập Document ID (UUID) để xem các chunks.
        </div>
      )}

      <div className={cx('tableWrapper')}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Doc ID</th>
              <th>Chunk Text</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {chunks.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.docId}</td>
                <td
                  style={{
                    maxWidth: 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {c.chunkText}
                </td>
                <td>
                  <div className={cx('actions')}>
                    <button className={cx('edit')} onClick={() => startEdit(c)}>
                      Sửa
                    </button>
                    <button className={cx('delete')} onClick={() => remove(c.id)}>
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
        <h4>{editingId ? 'Cập nhật chunk' : 'Tạo chunk mới'}</h4>
        <form onSubmit={editingId ? submitUpdate : submitCreate}>
          <div style={{ display: 'grid', gap: '0.75rem', maxWidth: 800 }}>
            <input
              type="text"
              name="docId"
              placeholder="Document ID (UUID)"
              value={form.docId}
              onChange={onChange}
              disabled={!!editingId}
            />
            <textarea
              name="chunkText"
              placeholder="Chunk text"
              value={form.chunkText}
              onChange={onChange}
              rows={3}
            />
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

export default ManageDocumentChunks;
