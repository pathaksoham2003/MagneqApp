import { View, Text } from 'react-native';
import React from 'react';
import useTheme from '../../hooks/useTheme';
import { themeColorText, themeText } from '../../utils/helper';

const Heading = ({ children = "Heading" }) => {
  const { tw } = useTheme();
  return (
    <View style={tw`mb-4`}>
      <Text style={tw`text-xl font-semibold ${themeText}`}>
        {children}
      </Text>
    </View>
  );
};

export default Heading;
