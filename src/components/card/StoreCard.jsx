import React from 'react';
import { View, Text } from 'react-native';
import useTheme from '../../hooks/useTheme';
import { themeBackground, themeText } from '../../utils/helper';

const StoresCard = ({ title, percent, borderColor }) => {

  const { tw } = useTheme();

  const isPositive =
    typeof percent === 'string' &&
    percent.trim().toLowerCase().includes('in stock');

  const badgeBg = isPositive ? '#dcfce7' : '#fee2e2';
  const badgeText = isPositive ? '#15803d' : '#b91c1c';

  return (
    <View
      style={[
        tw`rounded-2xl p-4 justify-between ${themeBackground}`,
        {
          borderColor: borderColor || '#e5e7eb',
          borderWidth: 1,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 4,
        },
      ]}
    >
      {/* Title and Badge */}
      <View style={tw`justify-between items-end`}>
        <Text style={tw`text-xl font-bold ${themeText}`}>{title}</Text>
        <View
          style={[
            tw`flex-row items-center px-1 py-1 rounded`,
            { backgroundColor: badgeBg },
          ]}
        >
          <Text style={[tw`ml-1 text-xs font-medium`, { color: badgeText }]}>
            {percent}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default StoresCard;
