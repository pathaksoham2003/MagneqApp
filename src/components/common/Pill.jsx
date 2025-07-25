import React from 'react';
import { View, Text } from 'react-native';
import { tw } from '../../App';

const Pill = ({ children, color = 'green' }) => {
  const bgColorMap = {
    green: '#22c55e33',   // Green with ~20% opacity
    red: '#ef444433',     // Red with ~20% opacity
    blue: '#3b82f633',    // Blue with ~20% opacity
    yellow: '#eab30833',  // Yellow with ~20% opacity
    gray: '#6b728033',    // Gray with ~20% opacity
  };

  const textColorMap = {
    green: '#15803d',
    red: '#b91c1c',
    blue: '#1e3a8a',
    yellow: '#92400e',
    gray: '#374151',
  };

  const backgroundColor = bgColorMap[color] || bgColorMap.green;
  const textColor = textColorMap[color] || textColorMap.green;

  return (
    <View style={[tw`px-3 py-1 rounded-full `, { backgroundColor }]}>
      <Text style={[tw`font-medium`, { color: textColor }]}>
        {children}
      </Text>
    </View>
  );
};

export default Pill;
