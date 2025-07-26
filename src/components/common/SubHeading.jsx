import { View, Text } from 'react-native';
import React from 'react';
import useTheme from '../../hooks/useTheme';

const SubHeading = ({ title = "Subheading" }) => {
  const { tw } = useTheme();
  return (
    <View style={tw`mb-2`}>
      <Text style={tw`text-base font-medium text-gray-600 dark:text-gray-300`}>
        {title}
      </Text>
    </View>
  );
};

export default SubHeading;
