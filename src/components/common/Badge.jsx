import React from 'react';
import { View } from 'react-native';
import { tw } from '../../App';

const Badge = ({ children, color }) => {
  return (
    <View style={tw`${color} px-2 py-1 rounded-full flex-row items-center`}>
      {children}
    </View>
  );
};

export default Badge;
