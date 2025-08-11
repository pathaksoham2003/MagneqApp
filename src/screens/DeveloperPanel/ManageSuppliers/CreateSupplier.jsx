import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { toast } from 'react-hot-toast';
import Button from '../../../components/buttons/Button';
import useManage from '../../../services/useManage';
import Input from '../../../components/forms/Input';
import { useQueryClient } from '@tanstack/react-query';
import useTheme from '../../hooks/useTheme';

const CreateSupplier = () => {
  const { tw } = useTheme();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    role: "SUPPLIER",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const { createUser } = useManage();
  const queryClient = useQueryClient();

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    setError("");

    if (!form.name || !form.phone) {
      const errorMsg = "Name and phone number are required";
      setError(errorMsg);
      Alert.alert("Error", errorMsg);
      return;
    }

    setLoading(true);
    try {
      await createUser(form);
      queryClient.invalidateQueries({ queryKey: ["SUPPLIER"] });
      toast.success("Supplier created successfully!");
      navigation.navigate("ManageSuppliers");
    } catch (err) {
      const errorMessage = err.message || "Failed to create supplier";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={tw`flex-1 bg-white`}>
      <View style={tw`p-6 mx-auto bg-white rounded-lg shadow-md`}>
        <Text style={tw`text-xl font-semibold mb-4`}>Create Supplier</Text>
        
        {error ? (
          <Text style={tw`text-red-500 mb-2`}>{error}</Text>
        ) : null}

        <View style={tw`space-y-4`}>
          <View style={tw`flex-row gap-3`}>
            <View style={tw`flex-1`}>
              <Input
                placeholder="Name"
                value={form.name}
                onChangeText={(value) => handleChange('name', value)}
              />
            </View>
            <View style={tw`flex-1`}>
              <Input
                placeholder="Phone Number"
                value={form.phone}
                onChangeText={(value) => handleChange('phone', value)}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        <View style={tw`flex-row justify-end gap-2 mt-6`}>
          <Button
            variant="outline"
            onPress={() => navigation.goBack()}
          >
            Cancel
          </Button>
          <Button 
            onPress={handleSubmit} 
            loading={loading} 
            disabled={loading}
          >
            Create
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default CreateSupplier;