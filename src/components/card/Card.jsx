// Card.js
import React from 'react';
import { View, Text } from 'react-native';

import Badge from '../common/Badge';
import { tw } from '../../App';

const Card = ({ title, iconName, iconLib: IconLib, value, percent }) => {
  const isPositive = typeof percent === 'string' && percent.trim().startsWith('+');
  const trendColor = isPositive ? 'bg-[#f6fef9]' : 'bg-red-100';
  const trendIconName = isPositive ? 'arrow-up' : 'arrow-down';

  return (
    <View style={tw`rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 min-h-[170px] w-[48%] shadow-sm`}>
      <View style={tw`w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-700 items-center justify-center`}>
        <IconLib name={iconName} size={24} color="#333" />
      </View>

      <View style={tw`flex-row justify-between items-end mt-6`}>
        <View>
          <Text style={tw`text-sm text-gray-700 dark:text-gray-300`}>{title}</Text>
          <Text style={tw`mt-1 text-lg font-bold text-black dark:text-white`}>
            {value ?? '—'}
          </Text>
        </View>

        <Badge color={trendColor}>
          <IconLib name={trendIconName} size={16} color="#000" />
          <Text style={tw`ml-1 text-black`}>{percent ?? '—'}</Text>
        </Badge>
      </View>
    </View>
  );
};

export default Card;
