import React from 'react';
import { View } from 'react-native';
import useTheme from '../../hooks/useTheme';

const Badge = ({ children, color }) => {
  const { tw } = useTheme();
  return (
    <View style={tw`${color} px-2 py-1 rounded-full flex-row items-center`}>
      {children}
    </View>
  );
};

export default Badge;
