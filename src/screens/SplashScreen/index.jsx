import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, StatusBar } from 'react-native';
import useTheme from '../../hooks/useTheme';
import logo from '../../assets/images/black_logo.png';
import { getItem } from '../../utils/localStorage';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../reducer/authSlice';
import { getRouteBasedOnRole } from '../../utils/helper';

const SplashScreen = ({ setIsLoading, setIsLoggedIn, navigation , initialRoute , setInitialRoute }) => {
  const { tw } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const user = useSelector(selectAuth);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const checkAuth = async () => {
      await new Promise(res => setTimeout(res, 1500)); // wait for animation

      const token = await getItem('token');

      if (token) {
        setIsLoggedIn(true);

        // Decide first screen from sidebar
        let firstRoute = user?.route?.role;
        console.log("User first route:", firstRoute);
        if (firstRoute === '') {
        } else {
          const capitalised = getRouteBasedOnRole(firstRoute);
          console.log("GOING TO ",capitalised)
          setInitialRoute(()=>capitalised)
        }

      } else {
        setIsLoggedIn(false);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [fadeAnim, scaleAnim]);

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
