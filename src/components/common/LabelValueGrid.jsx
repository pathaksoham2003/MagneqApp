// components/card/LabelValueGrid.js
import React from 'react';
import { View } from 'react-native';
import useTheme from '../../hooks/useTheme';
import { themeBackground, themeBorder } from '../../utils/helper';
import LabelValue from '../text/LabelValue';

const LabelValueGrid = ({ header, items }) => {
  const { tw } = useTheme();
  return (
    <View style={tw`border ${themeBorder} rounded-xl p-4 ${themeBackground}`}>
      {items.map((item, itemIndex) => (
        <View key={itemIndex} style={tw`mb-4`}>
          <View style={tw`flex-row flex-wrap justify-between`}>
            {header.map((label, idx) => {
              const value = Object.values(item)[idx];
              return (
                <View key={label + idx} style={tw`w-[48%] mb-2`}>
                  <LabelValue
                    label={label}
                    value={
                      typeof value === 'boolean'
                        ? value
                          ? '✓'
                          : '✗'
                        : String(value)
                    }
                  />
                </View>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
};

export default LabelValueGrid;
