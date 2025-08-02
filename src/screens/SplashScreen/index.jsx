import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, StatusBar } from 'react-native';
import useTheme from '../../hooks/useTheme';
import logo from '../../assets/images/black_logo.png';

const SplashScreen = () => {
  const { tw } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start animations
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
        {/* Logo */}
        <Image
          source={logo}
          style={tw`w-48 h-20 mb-8`}
          resizeMode="contain"
        />
        
        {/* Company Name */}
        <Text style={tw`text-4xl font-bold text-gray-800 mb-2 tracking-wide`}>
          MAGNEQ
        </Text>
        
        {/* Tagline */}
        <Text style={tw`text-lg text-gray-600 text-center px-8 mb-8`}>
          Manufacturing Excellence
        </Text>
        
        {/* Loading indicator */}
        <View style={tw`flex-row items-center`}>
          <View style={tw`w-2 h-2 bg-blue-500 rounded-full mx-1 animate-pulse`} />
          <View style={tw`w-2 h-2 bg-blue-500 rounded-full mx-1 animate-pulse`} />
          <View style={tw`w-2 h-2 bg-blue-500 rounded-full mx-1 animate-pulse`} />
        </View>
      </Animated.View>
      
      {/* Footer */}
      <View style={tw`absolute bottom-12 items-center`}>
        <Text style={tw`text-sm text-gray-500`}>
          Powered by Innovation
        </Text>
      </View>
    </View>
  );
};

export default SplashScreen;