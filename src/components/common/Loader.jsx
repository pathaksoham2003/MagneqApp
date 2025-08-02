import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import tw from 'twrnc';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <ActivityIndicator size="large" color="#4F46E5" />
      <Text style={tw`mt-2 text-base text-gray-700`}>{message}</Text>
    </View>
  );
};

export default Loader;
