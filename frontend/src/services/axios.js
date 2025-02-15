import axios from 'axios';

export const api = axios.create({
  baseURL: '/api', // จะถูก proxy ไป backend
  headers: {
    'Content-Type': 'application/json',
  },
});
