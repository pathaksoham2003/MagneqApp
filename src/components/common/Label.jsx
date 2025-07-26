import React from 'react';
import { Text } from 'react-native';
import useTheme from '../../hooks/useTheme';

const Label = ({ children, className = '' }) => {
  const { tw } = useTheme();
  return (
    <Text
      style={tw.style(
        'text-sm font-medium text-gray-700 dark:text-gray-300',
        className,
      )}
    >
      {children}
    </Text>
  );
};

export default Label;
