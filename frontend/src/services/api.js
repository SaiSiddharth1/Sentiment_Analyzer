import axios from 'axios';

// Update with the correct URL once backend is hosted or if port changes
const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const detectEmotion = async (text) => {
  const response = await api.post('/detect-emotion', { text });
  return response.data;
};

export const rewriteMessage = async (text, targetEmotion = null, format = null, scenario = null) => {
  const payload = { text };
  if (targetEmotion) payload.target_emotion = targetEmotion;
  if (format) payload.format = format;
  if (scenario) payload.scenario = scenario;
  const response = await api.post('/rewrite-message', payload);
  return response.data;
};

export const speakMessage = async (text) => {
  const response = await api.post('/speak', { text }, {
    responseType: 'blob'
  });
  return response.data;
};

export default api;
