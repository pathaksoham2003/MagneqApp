import React from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import useTheme from '../../hooks/useTheme';

const Select = ({
  selectedValue,
  onValueChange,
  items = [],
  className = '',
  ...props
}) => {
  const { tw } = useTheme();
  return (
    <View
      style={tw.style(
        'w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-800',
        className,
      )}
    >
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={tw`text-sm text-gray-700 dark:text-gray-200 px-3 py-2`}
        dropdownIconColor={tw.color('gray-700')}
        {...props}
      >
        {items.map(({ label, value }, idx) => (
          <Picker.Item key={idx} label={label} value={value} />
        ))}
      </Picker>
    </View>
  );
};

export default Select;
