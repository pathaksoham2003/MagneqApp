import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import {
  themePrimary,
  themeText,
} from '../../utils/helper';
import useTheme from '../../hooks/useTheme';
const Button = ({
  children,
  fullWidth = false,
  variant = 'primary',
  startIcon,
  endIcon,
  loading = false,
  onClick,
  disabled = false,
  style = {},
  ...props
}) => {
  const { tw } = useTheme();
  const isDisabled = disabled || loading;

  const baseStyle = `flex-row items-center justify-center px-2 py-1 rounded-md mt-2 mb-2`;
  const widthStyle = fullWidth ? 'w-full' : 'self-start';

  const variantStyle =
    variant === 'primary'
      ? 'bg-blue-600'
      : variant === 'outline'
      ? 'border border-gray-300 bg-white'
      : '';

  const textColor =
    variant === 'primary' ? 'text-white' : themeText;

  return (
    <TouchableOpacity
      disabled={isDisabled}
      onPress={onClick}
      activeOpacity={0.7}
      style={tw`${baseStyle} ${widthStyle} ${variantStyle} ${isDisabled ? 'opacity-50' : ''}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#000'} />
      ) : (
        <View style={tw`flex-row items-center`}>
          {startIcon && <View style={tw`mr-1`}>{startIcon}</View>}
          <Text style={tw`${textColor} font-medium`}>
            {children}
          </Text>
          {endIcon && <View style={tw`ml-1`}>{endIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;
