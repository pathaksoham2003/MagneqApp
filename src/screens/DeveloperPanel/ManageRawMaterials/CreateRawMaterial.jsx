import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Button from '../../../components/common/Button';
import useRawMaterials from '../../../services/useRawMaterials';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import Input from '../../../components/forms/Input';
import useTheme from '../../hooks/useTheme';

const CreateRawMaterial = () => {
  const { tw } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { class_type } = route.params;

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [specs, setSpecs] = useState([]);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const { createRawMaterial } = useRawMaterials();

  useEffect(() => {
    setName("");
    setType("");
    setSpecs([]);
    setNewKey("");
    setNewValue("");
  }, [class_type]);

  const handleAddSpec = () => {
    if (!newKey || !newValue) return;
    setSpecs([...specs, { key: newKey, value: newValue }]);
    setNewKey("");
    setNewValue("");
  };

  const handleRemoveSpec = (index) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index, field, value) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  const { mutate: createMutation, isLoading } = useMutation({
    mutationFn: createRawMaterial,
    onSuccess: () => {
      toast.success("Raw Material Created!");
      navigation.navigate("ManageRawMaterials", { class_type });
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("Creation failed: " + (error?.response?.data?.error || "Unknown error"));
    },
  });

  const handleSubmit = () => {
    if (!name || !type) {
      Alert.alert("Error", "Name and Type are required.");
      return;
    }

    const quantity = specs.reduce((acc, curr) => {
      if (curr.key) acc[curr.key] = curr.value;
      return acc;
    }, {});

    const payload = {
      class_type,
      name,
      type,
      quantity,
    };

    createMutation(payload);
  };

  return (
    <ScrollView style={tw`flex-1 bg-white`}>
      <View style={tw`p-6 max-w-3xl`}>
        <Text style={tw`text-2xl font-bold mb-6`}>
          Create Raw Material (Class {class_type})
        </Text>

        <View style={tw`space-y-4`}>
          <View>
            <Text style={tw`text-sm font-medium mb-2`}>Name</Text>
            <Input
              value={name}
              onChangeText={setName}
              placeholder="Enter name"
            />
          </View>

          <View>
            <Text style={tw`text-sm font-medium mb-2`}>Type</Text>
            <Input
              value={type}
              onChangeText={setType}
              placeholder="Enter type"
            />
          </View>

          <View style={tw`mt-6`}>
            <Text style={tw`text-sm font-semibold mb-3`}>
              Specifications (Key - Value)
            </Text>

            <View style={tw`flex-row gap-4 mb-4`}>
              <View style={tw`flex-1`}>
                <Input
                  placeholder="Key"
                  value={newKey}
                  onChangeText={setNewKey}
                />
              </View>
              <View style={tw`flex-1`}>
                <Input
                  placeholder="Value"
                  value={newValue}
                  onChangeText={setNewValue}
                />
              </View>
              <Button size="sm" onClick={handleAddSpec}>
                + Add
              </Button>
            </View>

            {specs.length === 0 ? (
              <Text style={tw`text-sm text-gray-400`}>
                No specifications added.
              </Text>
            ) : (
              <View style={tw`space-y-2`}>
                {specs.map((spec, idx) => (
                  <View key={idx} style={tw`flex-row gap-4 items-center`}>
                    <View style={tw`flex-1`}>
                      <Input
                        value={spec.key}
                        onChangeText={(value) => handleSpecChange(idx, "key", value)}
                        placeholder="Key"
                      />
                    </View>
                    <View style={tw`flex-1`}>
                      <Input
                        value={spec.value}
                        onChangeText={(value) => handleSpecChange(idx, "value", value)}
                        placeholder="Value"
                      />
                    </View>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleRemoveSpec(idx)}
                    >
                      Delete
                    </Button>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={tw`flex-row justify-end gap-4 pt-6`}>
          <Button variant="outline" onClick={() => navigation.goBack()}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default CreateRawMaterial;