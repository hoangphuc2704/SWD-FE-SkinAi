import React, { useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../ManageRoutine.module.scss';
import {
  generateRoutineDraft,
  generateRoutineFromDocuments,
} from '../../../../apis/aiRoutineBuilderApi';

const cx = classNames.bind(styles);

const parseConditions = (value) => {
  if (!value) return undefined;
  if (Array.isArray(value)) return value;
  return value
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeArray = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  if (!value) return [];
  return value
    .toString()
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const initialDraftForm = {
  query: '',
  targetSkinType: '',
  targetConditions: '',
  maxSteps: '',
  numVariants: '',
  autoSaveAsDraft: true,
  images: [],
};

const initialDocForm = {
  query: '',
  targetSkinType: '',
  targetConditions: '',
  autoSaveAsDraft: true,
  files: [],
};

function AiRoutineGenerator({ onSuccess }) {
  const [draftForm, setDraftForm] = useState(initialDraftForm);
  const [docForm, setDocForm] = useState(initialDocForm);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [status, setStatus] = useState(null);
  const [preview, setPreview] = useState(null);

  const draftFileInputRef = useRef(null);
  const docFileInputRef = useRef(null);

  const resetDraftFiles = () => {
    if (draftFileInputRef.current) {
      draftFileInputRef.current.value = '';
    }
  };

  const resetDocFiles = () => {
    if (docFileInputRef.current) {
      docFileInputRef.current.value = '';
    }
  };

  const handleDraftFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDraftForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDraftImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setDraftForm((prev) => ({ ...prev, images: files }));
  };

  const handleDocFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDocForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDocFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setDocForm((prev) => ({ ...prev, files }));
  };

  const toNumber = (value) => {
    if (!value && value !== 0) return undefined;
    const num = Number(value);
    return Number.isFinite(num) && num > 0 ? num : undefined;
  };

  const handleDraftSubmit = async (e) => {
    e.preventDefault();
    if (!draftForm.query.trim()) {
      setStatus({ type: 'error', message: 'Vui lòng nhập mô tả tình trạng da hoặc nhu cầu.' });
      return;
    }

    setLoadingDraft(true);
    setStatus(null);
    try {
      const result = await generateRoutineDraft({
        query: draftForm.query.trim(),
        targetSkinType: draftForm.targetSkinType.trim() || undefined,
        targetConditions: parseConditions(draftForm.targetConditions),
        maxSteps: toNumber(draftForm.maxSteps),
        numVariants: toNumber(draftForm.numVariants),
        autoSaveAsDraft: draftForm.autoSaveAsDraft,
        images: draftForm.images,
      });

      setPreview(result);
      if (result?.routineId) {
        setStatus({ type: 'success', message: 'AI đã tạo routine và lưu bản nháp thành công.' });
        if (onSuccess) {
          await onSuccess(result.routineId);
        }
      } else {
        setStatus({
          type: 'success',
          message: 'AI đã tạo routine nháp. Kiểm tra xem trước bên dưới.',
        });
      }

      setDraftForm((prev) => ({
        ...initialDraftForm,
        targetSkinType: prev.targetSkinType,
        targetConditions: prev.targetConditions,
        autoSaveAsDraft: prev.autoSaveAsDraft,
      }));
      resetDraftFiles();
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error?.response?.data?.message || error.message || 'Không thể tạo routine từ mô tả/ảnh.',
      });
    } finally {
      setLoadingDraft(false);
    }
  };

  const handleDocSubmit = async (e) => {
    e.preventDefault();
    if (!docForm.files.length) {
      setStatus({ type: 'error', message: 'Vui lòng chọn ít nhất một tài liệu để tải lên.' });
      return;
    }

    setLoadingDocs(true);
    setStatus(null);
    try {
      const result = await generateRoutineFromDocuments({
        query: docForm.query.trim() || undefined,
        targetSkinType: docForm.targetSkinType.trim() || undefined,
        targetConditions: parseConditions(docForm.targetConditions),
        autoSaveAsDraft: docForm.autoSaveAsDraft,
        files: docForm.files,
      });

      setPreview(result);
      if (result?.routineId) {
        setStatus({ type: 'success', message: 'AI đã tạo routine từ tài liệu và lưu bản nháp.' });
        if (onSuccess) {
          await onSuccess(result.routineId);
        }
      } else {
        setStatus({
          type: 'success',
          message: 'AI đã sinh routine từ tài liệu. Xem trước bên dưới.',
        });
      }

      setDocForm((prev) => ({
        ...initialDocForm,
        targetSkinType: prev.targetSkinType,
        targetConditions: prev.targetConditions,
        autoSaveAsDraft: prev.autoSaveAsDraft,
      }));
      resetDocFiles();
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error?.response?.data?.message || error.message || 'Không thể tạo routine từ tài liệu.',
      });
    } finally {
      setLoadingDocs(false);
    }
  };

  const previewRoutine = preview?.routine || null;
  const previewSteps = Array.isArray(previewRoutine?.steps)
    ? previewRoutine.steps.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];
  const previewConditions = normalizeArray(previewRoutine?.targetConditions);
  const busy = loadingDraft || loadingDocs;

  return (
    <div className={cx('aiContent')}>
      <div className={cx('aiIntro')}>
        <h3>AI Routine Builder</h3>
        <p>
          Gửi yêu cầu để AI gợi ý routine template tự động. Bạn có thể mô tả tình trạng da, cung cấp
          ảnh hoặc upload tài liệu tham khảo. Kết quả sẽ được lưu thành bản nháp nếu bật chế độ auto
          save.
        </p>
      </div>

      {status && (
        <div className={cx('aiStatus', status.type === 'error' ? 'error' : 'success')}>
          {status.message}
        </div>
      )}

      <div className={cx('aiForms')}>
        <form className={cx('formCard', 'aiForm')} onSubmit={handleDraftSubmit}>
          <h4>Tạo từ mô tả + ảnh</h4>
          <div className={cx('formRow')}>
            <label>Mô tả yêu cầu *</label>
            <textarea
              name="query"
              value={draftForm.query}
              onChange={handleDraftFieldChange}
              placeholder="Ví dụ: Da dầu, nhiều mụn viêm vùng cằm, muốn giảm thâm"
              required
            />
          </div>
          <div className={cx('formRow')}>
            <label>Loại da mục tiêu</label>
            <input
              name="targetSkinType"
              value={draftForm.targetSkinType}
              onChange={handleDraftFieldChange}
              placeholder="Ví dụ: oily, dry, sensitive..."
            />
          </div>
          <div className={cx('formRow')}>
            <label>Vấn đề chính</label>
            <input
              name="targetConditions"
              value={draftForm.targetConditions}
              onChange={handleDraftFieldChange}
              placeholder="acne; redness"
            />
            <small>Ngăn cách bằng dấu phẩy hoặc chấm phẩy.</small>
          </div>
          <div className={cx('formRow', 'inline')}>
            <div>
              <label>Số bước tối đa</label>
              <input
                type="number"
                name="maxSteps"
                min="1"
                max="20"
                value={draftForm.maxSteps}
                onChange={handleDraftFieldChange}
                placeholder="<= 20"
              />
            </div>
            <div>
              <label>Số phương án</label>
              <input
                type="number"
                name="numVariants"
                min="1"
                max="3"
                value={draftForm.numVariants}
                onChange={handleDraftFieldChange}
                placeholder="<= 3"
              />
            </div>
          </div>
          <div className={cx('formRow')}>
            <label>Ảnh da (tùy chọn)</label>
            <input
              key={draftForm.images.length}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              ref={draftFileInputRef}
              onChange={handleDraftImagesChange}
            />
            {draftForm.images.length > 0 && (
              <ul className={cx('aiFileList')}>
                {draftForm.images.map((file) => (
                  <li key={file.name}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>
          <div className={cx('aiCheckbox')}>
            <input
              id="draftAutoSave"
              type="checkbox"
              name="autoSaveAsDraft"
              checked={draftForm.autoSaveAsDraft}
              onChange={handleDraftFieldChange}
            />
            <label htmlFor="draftAutoSave">Tự động lưu thành draft</label>
          </div>
          <div className={cx('actions')}>
            <button className={cx('btn', 'primary')} type="submit" disabled={busy}>
              {loadingDraft ? 'Đang gọi AI...' : 'Gọi AI tạo routine'}
            </button>
            <button
              className={cx('btn')}
              type="button"
              onClick={() => {
                setDraftForm(initialDraftForm);
                resetDraftFiles();
              }}
              disabled={busy}
            >
              Xóa thông tin
            </button>
          </div>
        </form>

        <form className={cx('formCard', 'aiForm')} onSubmit={handleDocSubmit}>
          <h4>Tạo từ tài liệu</h4>
          <div className={cx('formRow')}>
            <label>Ghi chú cho AI</label>
            <textarea
              name="query"
              value={docForm.query}
              onChange={handleDocFieldChange}
              placeholder="Tùy chọn: nêu mong muốn chính để AI đọc tài liệu có mục tiêu hơn"
            />
          </div>
          <div className={cx('formRow')}>
            <label>Loại da mục tiêu</label>
            <input
              name="targetSkinType"
              value={docForm.targetSkinType}
              onChange={handleDocFieldChange}
              placeholder="Ví dụ: combination"
            />
          </div>
          <div className={cx('formRow')}>
            <label>Vấn đề chính</label>
            <input
              name="targetConditions"
              value={docForm.targetConditions}
              onChange={handleDocFieldChange}
              placeholder="hyperpigmentation, sensitivity"
            />
            <small>Ngăn cách bằng dấu phẩy hoặc chấm phẩy.</small>
          </div>
          <div className={cx('formRow')}>
            <label>Tài liệu chuyên sâu *</label>
            <input
              key={docForm.files.length}
              type="file"
              accept=".pdf,.doc,.docx,.txt,.md,.html"
              multiple
              ref={docFileInputRef}
              onChange={handleDocFilesChange}
              required
            />
            {docForm.files.length > 0 && (
              <ul className={cx('aiFileList')}>
                {docForm.files.map((file) => (
                  <li key={file.name}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>
          <div className={cx('aiCheckbox')}>
            <input
              id="docAutoSave"
              type="checkbox"
              name="autoSaveAsDraft"
              checked={docForm.autoSaveAsDraft}
              onChange={handleDocFieldChange}
            />
            <label htmlFor="docAutoSave">Tự động lưu thành draft</label>
          </div>
          <div className={cx('actions')}>
            <button className={cx('btn', 'primary')} type="submit" disabled={busy}>
              {loadingDocs ? 'Đang phân tích...' : 'Gọi AI từ tài liệu'}
            </button>
            <button
              className={cx('btn')}
              type="button"
              onClick={() => {
                setDocForm(initialDocForm);
                resetDocFiles();
              }}
              disabled={busy}
            >
              Xóa thông tin
            </button>
          </div>
        </form>
      </div>

      {previewRoutine ? (
        <div className={cx('aiPreview')}>
          <div className={cx('aiPreviewHeader')}>
            <h4>Kết quả gần nhất</h4>
            <div className={cx('aiPreviewMeta')}>
              {preview?.routineId && (
                <span className={cx('aiTag')}>Routine ID: {preview.routineId}</span>
              )}
              {preview?.source && <span className={cx('aiTag')}>Nguồn: {preview.source}</span>}
              <span className={cx('aiTag')}>
                {preview?.isRagBased ? 'Có dùng tài liệu RAG' : 'LLM thuần'}
              </span>
              {Array.isArray(preview?.citations) && preview.citations.length > 0 && (
                <span className={cx('aiTag')}>{preview.citations.length} citation(s)</span>
              )}
            </div>
          </div>
          {previewRoutine.description && (
            <p className={cx('aiPreviewDesc')}>{previewRoutine.description}</p>
          )}
          <div className={cx('aiPreviewTargets')}>
            {previewRoutine.targetSkinType && (
              <span className={cx('aiTag')}>Skin type: {previewRoutine.targetSkinType}</span>
            )}
            {previewConditions.map((condition) => (
              <span key={condition} className={cx('aiTag')}>
                {condition}
              </span>
            ))}
          </div>
          <div className={cx('aiPreviewSteps')}>
            {previewSteps.length ? (
              previewSteps.map((step, index) => (
                <div key={step.stepId || step.order || index} className={cx('aiStepItem')}>
                  <div className={cx('aiStepItemHeader')}>
                    <span># {step.order ?? index + 1}</span>
                    <strong>{step.instruction || 'Không có hướng dẫn'}</strong>
                  </div>
                  <div className={cx('aiStepMeta')}>
                    {step.timeOfDay && <span className={cx('aiTag')}>{step.timeOfDay}</span>}
                    {step.frequency && <span className={cx('aiTag')}>{step.frequency}</span>}
                  </div>
                </div>
              ))
            ) : (
              <div className={cx('aiEmpty')}>Routine chưa có bước nào.</div>
            )}
          </div>
        </div>
      ) : (
        <div className={cx('aiEmpty')}>
          Chưa có kết quả AI nào. Gửi yêu cầu để xem preview routine tại đây.
        </div>
      )}
    </div>
  );
}

export default AiRoutineGenerator;
