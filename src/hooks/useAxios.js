import axios from 'axios';
import { clearItem, getItem } from '../utils/localStorage';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../api/apiUrls';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../reducer/authSlice';
/**
 * Custom hook to get the configured Axios instance.
 * @returns {import('axios').AxiosInstance} The configured Axios instance.
 */
const useAxios = () => {
  const navigate = useNavigation();
  const dispatch = useDispatch();
  const axiosInstance = axios.create({
    baseURL: API_URL,
  });

  axiosInstance.interceptors.request.use(
    async config => {
      const token = await getItem('token'); //TODO: update the token with exact token name
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  axiosInstance.interceptors.response.use(
    response => {
      return response.data;
    },
    async error => {
      if (error.response && error.response.status === 403) {
        await clearItem(); //TODO: update the token with exact token name
        await dispatch(logoutUser())
        // We are refreshing the page and redirecting to login.
        await navigate.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
      return Promise.reject(error);
    },
  );
  return axiosInstance;
};

export default useAxios;
