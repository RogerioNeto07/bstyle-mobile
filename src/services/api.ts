import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://192.168.0.8:8080',
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@BStyle:token');
      
      if (token && config.headers) {
        config.headers.Authorization = `Basic ${token}`;
      }
    } catch (error) {
      console.error('Erro ao recuperar token do AsyncStorage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;