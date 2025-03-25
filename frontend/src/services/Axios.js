import axios from 'axios';

export const api = axios.create({
  baseURL: '/api', // จะถูก proxy ไป backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ เพิ่ม interceptor เพื่อส่ง token ในทุก request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // หรือดึงจาก state เช่น Redux
    if (token) {
      config.headers['x-access-token'] = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
