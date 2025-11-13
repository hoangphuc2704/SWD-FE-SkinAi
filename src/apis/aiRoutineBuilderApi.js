import axiosClient from '../services/axiosClient';

// Admin/Specialist – Generate routine draft (multipart) with optional images
// POST /api/ai/routines/drafts (Consumes multipart/form-data)
export const generateRoutineDraft = async ({
  query,
  targetSkinType,
  targetConditions, // string[] | string (csv)
  maxSteps,
  numVariants,
  autoSaveAsDraft = true,
  images = [],
} = {}) => {
  const form = new FormData();
  if (query) form.append('query', query);
  if (targetSkinType) form.append('targetSkinType', targetSkinType);
  if (Array.isArray(targetConditions)) {
    targetConditions.forEach((c) => form.append('targetConditions', c));
  } else if (typeof targetConditions === 'string' && targetConditions.trim()) {
    // allow csv; backend splits by , or ;
    form.append('targetConditions', targetConditions);
  }
  if (typeof maxSteps === 'number') form.append('maxSteps', String(maxSteps));
  if (typeof numVariants === 'number') form.append('numVariants', String(numVariants));
  form.append('autoSaveAsDraft', String(!!autoSaveAsDraft));
  (images || []).forEach((file) => file && form.append('images', file));

  const res = await axiosClient.post('/api/ai/routines/drafts', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data?.data ?? res.data;
};

// Admin/Specialist – Generate from uploaded documents (multipart)
// POST /api/ai/routines/drafts/documents
export const generateRoutineFromDocuments = async ({
  query,
  targetSkinType,
  targetConditions,
  autoSaveAsDraft = true,
  files = [],
} = {}) => {
  const form = new FormData();
  if (query) form.append('query', query);
  if (targetSkinType) form.append('targetSkinType', targetSkinType);
  if (Array.isArray(targetConditions)) {
    targetConditions.forEach((c) => form.append('targetConditions', c));
  } else if (typeof targetConditions === 'string' && targetConditions.trim()) {
    form.append('targetConditions', targetConditions);
  }
  form.append('autoSaveAsDraft', String(!!autoSaveAsDraft));
  (files || []).forEach((f) => f && form.append('files', f));

  const res = await axiosClient.post('/api/ai/routines/drafts/documents', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data?.data ?? res.data;
};

// Admin/Specialist – Generate from text (multipart, optional images)
// POST /api/ai/routines/drafts/text
export const generateRoutineFromText = async ({
  prompt,
  context,
  targetSkinType,
  targetConditions,
  autoSaveAsDraft = true,
  images = [],
} = {}) => {
  const form = new FormData();
  if (prompt) form.append('prompt', prompt);
  if (context) form.append('context', context);
  if (targetSkinType) form.append('targetSkinType', targetSkinType);
  if (Array.isArray(targetConditions)) {
    targetConditions.forEach((c) => form.append('targetConditions', c));
  } else if (typeof targetConditions === 'string' && targetConditions.trim()) {
    form.append('targetConditions', targetConditions);
  }
  form.append('autoSaveAsDraft', String(!!autoSaveAsDraft));
  (images || []).forEach((file) => file && form.append('images', file));

  const res = await axiosClient.post('/api/ai/routines/drafts/text', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data?.data ?? res.data;
};

// Admin/Specialist – Update/Publish/Archive AI routine draft
export const updateAiRoutine = async (routineId, update) => {
  const res = await axiosClient.put(`/api/ai/routines/${routineId}`, update);
  return res.data?.data ?? res.data;
};

export const publishAiRoutine = async (routineId) => {
  const res = await axiosClient.post(`/api/ai/routines/${routineId}/publish`);
  return res.data?.data ?? res.data;
};

export const archiveAiRoutine = async (routineId) => {
  const res = await axiosClient.post(`/api/ai/routines/${routineId}/archive`);
  return res.data?.data ?? res.data;
};
