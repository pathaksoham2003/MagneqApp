import { View, Text } from 'react-native';
import React from 'react';
import useTheme from '../../hooks/useTheme';
import { themeColorText, themeText } from '../../utils/helper';

const Heading = ({ children = "Heading" , style=""}) => {
  const { tw } = useTheme();
  return (
      <Text style={tw`text-2xl font-semibold ${themeText} ${style}`}>
        {children}
      </Text>
    
  );
};

export default Heading;
