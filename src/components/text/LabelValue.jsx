import React from 'react';
import { View, Text } from 'react-native';
import useTheme from '../../hooks/useTheme';
import Label from '../common/Label';
import { themeText } from '../../utils/helper';
const LabelValue = ({ label, value }) => {
  const { tw } = useTheme();
  
  return <View>
    <Text style={tw`text-xs text-gray-500 dark:text-gray-400`}>{label}</Text>
    <Text
      numberOfLines={1}
      ellipsizeMode="tail"
      style={tw`text-base text-black dark:text-white`}
    >
      {value || '—'}
    </Text>
  </View>
};

export default LabelValue;
