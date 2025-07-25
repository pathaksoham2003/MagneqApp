import { View, Text } from 'react-native';
import React from 'react';
import { tw } from '../../App';

const Heading = ({ children = "Heading" }) => {
  return (
    <View style={tw`mb-4`}>
      <Text style={tw`text-xl font-semibold text-gray-800 dark:text-white`}>
        {children}
      </Text>
    </View>
  );
};

export default Heading;
