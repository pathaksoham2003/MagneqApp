import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useToast } from "react-native-toast-notifications";
import tw from "twrnc";
import useManage from "../../../services/useManage";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";

const CreateUserPage = () => {
  const toast = useToast();
  const navigation = useNavigation();
  const { createUser } = useManage();

  const [form, setForm] = useState({
    name: "",
    role: "",
    user_name: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    setError("");

    if (!form.name || !form.role || !form.user_name || !form.password) {
      setError("All fields are required");
      toast.show("All fields are required", { type: "danger" });
      return;
    }

    setLoading(true);
    try {
      await createUser(form);
      toast.show("User created successfully!", { type: "success" });
      navigation.navigate("ManageUsers"); // navigate to your users list screen
    } catch (err) {
      const errorMessage = err.message || "Failed to create user";
      setError(errorMessage);
      toast.show(errorMessage, { type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={tw`p-6 bg-white dark:bg-gray-800 rounded-lg`}
    >
      <Text style={tw`text-xl font-semibold mb-4`}>Create User</Text>
      {error ? <Text style={tw`text-red-500 mb-2`}>{error}</Text> : null}

      <View style={tw`flex-row flex-wrap -mx-1`}>
        <View style={tw`w-1/2 px-1`}>
          <Input
            placeholder="Name"
            value={form.name}
            onChangeText={(text) => handleChange("name", text)}
          />
        </View>
        <View style={tw`w-1/2 px-1`}>
          <Input
            placeholder="Role"
            value={form.role}
            onChangeText={(text) => handleChange("role", text)}
          />
        </View>
        <View style={tw`w-1/2 px-1`}>
          <Input
            placeholder="Username"
            value={form.user_name}
            onChangeText={(text) => handleChange("user_name", text)}
          />
        </View>
        <View style={tw`w-1/2 px-1`}>
          <Input
            placeholder="Password"
            secureTextEntry
            value={form.password}
            onChangeText={(text) => handleChange("password", text)}
          />
        </View>
      </View>

      <View style={tw`flex-row justify-end mt-4`}>
        <Button
          size="lg"
          variant="outline"
          onPress={() => navigation.goBack()}
          style={tw`mr-2`}
        >
          Cancel
        </Button>
        <Button loading={loading} disabled={loading} onPress={handleSubmit}>
          Create
        </Button>
      </View>
    </ScrollView>
  );
};

export default CreateUserPage;
