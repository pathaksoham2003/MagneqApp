import React from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

const Login = ({ onLogin }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Username" style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />
      <Button title="Login" onPress={onLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 20 },
  title: { fontSize: 24, marginBottom: 16, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
  },
});

export default Login;
