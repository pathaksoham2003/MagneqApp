import React from "react";
import { TextInput } from "react-native";
import useTheme from "../../hooks/useTheme";

const Input = ({
  id,
  name,
  type = "text", 
  placeholder = "",
  className = "",
  ...props
}) => {
  const {tw} = useTheme();
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={tw.color("gray-500")}
      style={tw.style(
        "w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-200",
        "shadow-sm",
        className
      )}
      {...props}
    />
  );
};

export default Input;
