import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from "react-native";

const Button = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  loading = false,
  onClick,
  disabled = false,
  style = {},
  type = "button", // Not applicable in React Native, but kept for parity
  ...props
}) => {
  const isDisabled = disabled || loading;

  const sizeStyles = {
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg,
  };

  const variantStyles = {
    primary: styles.primary,
    outline: styles.outline,
  };

  return (
    <TouchableOpacity
      disabled={isDisabled}
      onPress={onClick}
      activeOpacity={0.7}
      style={[
        styles.buttonBase,
        sizeStyles[size],
        variantStyles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#fff" : "#000"} />
      ) : (
        <View style={styles.contentWrapper}>
          {startIcon && <View style={styles.icon}>{startIcon}</View>}
          <Text style={[styles.text, variant === "outline" && styles.textOutline]}>
            {children}
          </Text>
          {endIcon && <View style={styles.icon}>{endIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  sizeSm: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  sizeMd: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  sizeLg: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  primary: {
    backgroundColor: "#1d4ed8", // Tailwind brand-600
  },
  outline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db", // Tailwind gray-300
  },
  disabled: {
    opacity: 0.5,
  },
  contentWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginHorizontal: 4,
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
  textOutline: {
    color: "#000",
  },
});

export default Button;
