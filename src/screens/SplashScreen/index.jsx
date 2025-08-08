import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, StatusBar } from 'react-native';
import useTheme from '../../hooks/useTheme';
import logo from '../../assets/images/black_logo.png';
import { getItem } from '../../utils/localStorage';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../reducer/authSlice';

const SplashScreen = ({ setIsLoading, setIsLoggedIn, navigation }) => {
  const { tw } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const user = useSelector(selectAuth);

useEffect(() => {
  const checkAuth = async () => {
    await new Promise(res => setTimeout(res, 1500)); // animation delay

    const token = await getItem('token');

    // If no token → go to login
    if (!token) {
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }

    // If token exists but user data not ready → wait
    if (!user?.route?.sidebar) {
      return;
    }

    // Now we have both token and user data
    setIsLoggedIn(true);

    let firstRoute = user.route.sidebar[0] || '';
    if (firstRoute === '') {
      navigation.replace('Dashboard');
    } else {
      navigation.replace(
        firstRoute.charAt(0).toUpperCase() + firstRoute.slice(1)
      );
    }

    setIsLoading(false);
  };

  checkAuth();
}, [user]); // rerun when user data changes


  return (
    <View style={tw`flex-1 bg-white items-center justify-center`}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Animated.View
        style={[
          tw`items-center`,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image source={logo} style={tw`w-48 h-20 mb-8`} resizeMode="contain" />
        <Text style={tw`text-4xl font-bold text-gray-800 mb-2 tracking-wide`}>
          MAGNEQ
        </Text>
        <Text style={tw`text-lg text-gray-600 text-center px-8 mb-8`}>
          Manufacturing Excellence
        </Text>
        <View style={tw`flex-row items-center`}>
          <View style={tw`w-2 h-2 bg-blue-500 rounded-full mx-1 animate-pulse`} />
          <View style={tw`w-2 h-2 bg-blue-500 rounded-full mx-1 animate-pulse`} />
          <View style={tw`w-2 h-2 bg-blue-500 rounded-full mx-1 animate-pulse`} />
        </View>
      </Animated.View>
      <View style={tw`absolute bottom-12 items-center`}>
        <Text style={tw`text-sm text-gray-500`}>
          Powered by Innovation
        </Text>
      </View>
    </View>
  );
};

export default SplashScreen;
