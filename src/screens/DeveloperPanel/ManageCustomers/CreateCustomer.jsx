import React, { useState } from "react";
import { View, Text, TextInput, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import useTheme from "../../../hooks/useTheme";
import useManage from "../../../services/useManage";
import { useToast } from "react-native-toast-notifications";
import Button from "../../../components/common/Button";

const CreateCustomer = () => {
  const { tw } = useTheme();
  const toast = useToast();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { createUser } = useManage();

  const [form, setForm] = useState({
    name: "",
    role: "CUSTOMER",
    user_name: "",
    password: "",
    address: "",
    gst_no: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    setError("");

    if (!form.name || !form.user_name || !form.password) {
      const msg = "Name, username, and password are required";
      setError(msg);
      toast.show(msg);
      return;
    }

    setLoading(true);
    try {
      await createUser(form);
      queryClient.invalidateQueries({ queryKey: ["CUSTOMER"] });
      toast.show("Customer created successfully!");
      navigation.goBack();
    } catch (err) {
      const errorMessage = err.message || "Failed to create customer";
      setError(errorMessage);
      toast.show(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 p-4`}>
      <Text style={tw`text-lg font-semibold mb-4`}>Create Customer</Text>
      {error ? <Text style={tw`text-red-500 mb-2`}>{error}</Text> : null}

      <View style={tw`flex flex-col gap-3`}>
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-3 py-2`}
          placeholder="Name"
          value={form.name}
          onChangeText={(text) => handleChange("name", text)}
        />
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-3 py-2`}
          placeholder="Username"
          value={form.user_name}
          onChangeText={(text) => handleChange("user_name", text)}
        />
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-3 py-2`}
          placeholder="Password"
          secureTextEntry
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
        />
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-3 py-2`}
          placeholder="Address"
          value={form.address}
          onChangeText={(text) => handleChange("address", text)}
        />
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-3 py-2`}
          placeholder="GST Number"
          value={form.gst_no}
          onChangeText={(text) => handleChange("gst_no", text)}
        />
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-3 py-2`}
          placeholder="Phone Number"
          value={form.phone}
          onChangeText={(text) => handleChange("phone", text)}
        />
      </View>

      <View style={tw`flex-row justify-end gap-2 mt-4`}>
        <Button
          variant="outline"
          onClick={() => navigation.goBack()}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : "Create"}
        </Button>
      </View>
    </View>
  );
};

export default CreateCustomer;
