import { useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth, logoutUser } from '../reducer/authSlice'; // adjust path

const useAxios = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { token } = useSelector(selectAuth);

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api/', // Change to your server's IP for physical devices
  });

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        let authToken = token;

        // If token not in Redux, try AsyncStorage
        if (!authToken) {
          authToken = await AsyncStorage.getItem('token');
        }

        if (authToken) {
          config.headers.Authorization = `Bearer ${authToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        if (error.response && error.response.status === 403) {
          await AsyncStorage.removeItem('token');
          dispatch(logoutUser());

          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [token, navigation, dispatch]);

  return axiosInstance;
};

export default useAxios;
