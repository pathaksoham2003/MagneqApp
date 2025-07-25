import { View, Text } from 'react-native';
import React from 'react';
import { tw } from '../../App';

const SubHeading = ({ title = "Subheading" }) => {
  return (
    <View style={tw`mb-2`}>
      <Text style={tw`text-base font-medium text-gray-600 dark:text-gray-300`}>
        {title}
      </Text>
    </View>
  );
};

export default SubHeading;
