import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import Input from '../../components/common/Input';
import Label from '../../components/common/Label';
import Select from '../../components/common/Select';
import Checkbox from '../../components/common/Checkbox';
import Button from '../../components/common/Button';
import logo from '../../assets/images/black_logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectAuth } from '../../reducer/authSlice';
import useAuth from '../../services/useAuth';
import { useMutation } from '@tanstack/react-query';
import { setItem } from '../../utils/localStorage';
import useTheme from '../../hooks/useTheme';
import Dropdown from '../../components/common/DropDown';

// Updated Login component's navigateBasedOnRole function
const Login = ({ navigation, onLogin }) => {
  const dispatch = useDispatch();
  const { tw } = useTheme();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    user_name: '',
    password: '',
    role: 'STAFF',
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
    if (user?.token) {
      const route = getRouteBasedOnRole(user.route?.role);
      onLogin(route);
    }
  }, []);

  const getRouteBasedOnRole = userRole => {
    switch (userRole?.toUpperCase()) {
      case 'SALES':
        return 'CreateSales';
      case 'CUSTOMER':
        return 'CreateSales';
      case 'PRODUCTION':
        return 'Production';
      case 'PURCHASE':
        return 'Store';
      case 'ADMIN':
        return 'Dashboard';
      default:
        console.log('Unknown role, defaulting to Dashboard');
        return 'Dashboard';
    }
  };

  const navigateBasedOnRole = userRole => {
    console.log('Navigating based on role:', userRole);
    const route = getRouteBasedOnRole(userRole);
    onLogin(route);
  };

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: ({ data: data }) => {
      if (data?.token) {
        dispatch(loginUser(data));
        console.log('ROLE OF THE USER', data?.route?.role);
        setItem('token', data.token);

        // Navigate based on user role with the correct route
        navigateBasedOnRole(data?.route?.role);
      } else {
        console.error('Invalid credentials');
      }
    },
    onError: err => {
      console.error('Login failed:', err?.response?.data || err.message);
    },
  });

  const handleLogin = () => {
    console.log(formData);
    mutation.mutate(formData);
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView
        contentContainerStyle={tw`flex-1 items-center justify-center px-6 py-12`}
      >
        <View style={tw`w-full max-w-md bg-white p-6 rounded-2xl shadow-lg`}>
          <Image
            source={logo}
            style={tw`w-40 h-16 mx-auto mb-6`}
            resizeMode="contain"
          />

          <Label>Username</Label>
          <Input
            value={formData.user_name}
            onChangeText={val => handleChange('user_name', val)}
            placeholder="John Doe"
          />

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

          <Label>Login As</Label>

          <Dropdown
            label="Role"
            data={['CUSTOMER', 'STAFF']}
            value={formData.role}
            setValue={val => handleChange('role', val)}
            placeholder="Search Vendor"
          />
          <View style={tw`flex-row items-center mt-2`}>
            <Checkbox
              value={formData.active}
              onValueChange={val => handleChange('active', val)}
            />
            <Label style={tw`ml-2`}>Active</Label>
          </View>

          <Button
            fullWidth
            onPress={handleLogin}
            disabled={mutation.isLoading}
            style={tw`mt-5`}
          >
            {mutation.isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default Login;
