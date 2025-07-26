import React from 'react';
import { Pressable, View } from 'react-native';
import useTheme from '../../hooks/useTheme';

const Checkbox = ({ checked, onChange, className = '', ...props }) => {
  const { tw } = useTheme();
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      style={tw.style(
        'w-5 h-5 rounded border border-gray-300 dark:bg-gray-800 dark:border-gray-600',
        checked && 'bg-brand-500',
        className,
      )}
      {...props}
    >
      {checked && <View style={tw`w-full h-full rounded bg-brand-500`} />}
    </Pressable>
  );
};

export default Checkbox;
