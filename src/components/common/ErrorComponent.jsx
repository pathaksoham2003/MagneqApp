import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';

const ErrorComponent = ({ message = 'Something went wrong. Please try again.' }) => {
  return (
    <View style={tw`flex-1 justify-center items-center px-4`}>
      <Text style={tw`text-red-600 text-center text-base font-medium`}>
        {message}
      </Text>
    </View>
  );
};

export default ErrorComponent;
