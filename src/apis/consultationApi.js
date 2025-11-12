import axiosClient from '../services/axiosClient';

/**
 * Submit a consultation (text/image) to BE for analysis and optional routine generation
 * Backend spec: POST /consultations (multipart/form-data)
 * Fields:
 *  - Text: string (required)
 *  - Image: file (optional)
 *  - ImageUrl: string (optional)
 *  - GenerateRoutine: boolean (optional)
 */
export const submitConsultation = async ({
  text,
  imageFile,
  imageUrl,
  generateRoutine = false,
}) => {
  try {
    const form = new FormData();
    if (text) form.append('Text', text);
    if (imageFile) form.append('Image', imageFile);
    if (imageUrl) form.append('ImageUrl', imageUrl);
    form.append('GenerateRoutine', String(!!generateRoutine));

    const res = await axiosClient.post('/consultations', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data; // { success, data: { analysisId, routineId?, routineGenerated, advice, ... } }
  } catch (error) {
    console.error('Error submitting consultation:', error);
    throw error;
  }
};

/**
 * Optional helper: get consultations by user (if needed later)
 * Endpoint guess: GET /consultations/user/{userId}
 */
export const getConsultationsByUser = async (userId) => {
  try {
    const res = await axiosClient.get(`/consultations/user/${userId}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching consultations by user:', error);
    throw error;
  }
};
