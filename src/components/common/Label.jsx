import React from "react";
import { Text } from "react-native";
import { tw } from "../../App";

const Label = ({ children, className = "" }) => (
  <Text style={tw.style("text-sm font-medium text-gray-700 dark:text-gray-300", className)}>
    {children}
  </Text>
);

export default Label;
