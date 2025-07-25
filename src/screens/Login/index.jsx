import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { tw } from '../../App';
import Input from '../../components/common/Input';
import Label from '../../components/common/Label';
import Select from '../../components/common/Select';
import Checkbox from '../../components/common/Checkbox';
import Button from '../../components/common/Button';
import loginBG from '../../assets/images/loginPageBGImage.png';
import logo from '../../assets/images/black_logo.png'; // updated
import backgroundTexture from '../../assets/images/rectangle_4209.png'; // updated
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectAuth } from '../../reducer/authSlice';
import useAuth from '../../services/useAuth';
import { useMutation } from '@tanstack/react-query';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5'; // Optional in RN
import { getItem, setItem } from '../../utils/localStorage';

const LoginScreen = ({ navigation, onLogin }) => {
  const dispatch = useDispatch();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    user_name: '',
    password: '',
    role: 'ADMIN',
    active: false,
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const user = useSelector(selectAuth);

  useEffect(() => {
    if (user?.token) onLogin();
  }, []);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: data => {
      if (data?.data?.token) {
        dispatch(loginUser(data.data));
        setItem('token',data.data.token);
        // Use react-navigation or any route jump
        onLogin();
      } else {
        console.error('Invalid credentials');
      }
    },
    onError: err => {
      console.error('Login failed:', err?.response?.data || err.message);
      console.log(err);
    },
  });

  const handleSubmit = () => {
    mutation.mutate(formData);
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView
        contentContainerStyle={tw`flex-1 items-center justify-center px-6 py-12 bg-white`}
      >
        <View style={tw`w-full max-w-md bg-white p-6 rounded-2xl shadow-lg`}>
          <Image
            source={logo}
            style={tw`w-40 h-16 mx-auto mb-6`}
            resizeMode="contain"
          />

          {/* Username */}
          <Label>Username</Label>
          <Input
            value={formData.user_name}
            onChangeText={val => handleChange('user_name', val)}
            placeholder="John Doe"
          />

          {/* Password */}
          <Label>Password</Label>
          <View style={tw`relative`}>
            <Input
              value={formData.password}
              onChangeText={val => handleChange('password', val)}
              placeholder="••••••••"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={tw`absolute right-3 top-3`}
            >
              <Text style={tw`text-gray-500 text-lg`}>
                {showPassword ? '🙈' : '👁️'}
              </Text>
            </TouchableOpacity>
          </View>

          {/*
          <Label>Role</Label>
          <Select
            value={formData.role}
            onValueChange={val => handleChange('role', val)}
            options={[
              { label: 'Admin', value: 'ADMIN' },
              { label: 'Sales Executive', value: 'EXECUTIVE' },
              { label: 'Customer', value: 'CUSTOMER' },
            ]}
          /> */}

          {/* Active */}
          <View style={tw`flex-row items-center mt-2`}>
            <Checkbox
              value={formData.active}
              onValueChange={val => handleChange('active', val)}
            />
            <Label style={tw`ml-2`}>Active</Label>
          </View>

          {/* Submit */}
          <Button
            fullWidth
            title={mutation.isLoading ? 'Signing In...' : 'Sign In'}
            onPress={handleSubmit}
            disabled={mutation.isLoading}
            style={tw`mt-5`}
          >
            Sign in
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;
