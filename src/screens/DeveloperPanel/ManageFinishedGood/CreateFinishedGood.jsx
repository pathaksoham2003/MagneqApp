import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import useFinishedGoods from '../../../services/useFinishedGoods';
import useTheme from '../../../hooks/useTheme';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';

const CreateFinishedGood = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { createFinishedGood } = useFinishedGoods();
  const { tw } = useTheme();

  const [form, setForm] = useState({
    model: "",
    power: "",
    type: "",
    ratio: "",
    motor_shaft_diameter: "",
    motor_frame_size: "",
    rpm: "",
    nm: "",
    sf: "",
    base_price: "",
    overhead_load: "",
  });

  const mutation = useMutation({
    mutationFn: (data) => createFinishedGood(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["finishedGoods"]);
      toast.success("Finished good created successfully.");
      navigation.navigate("FinishedGoods");
    },
    onError: (err) => {
      toast.error("Error creating finished good: " + err.message);
    },
  });

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const {
      model,
      power,
      type,
      ratio,
      base_price,
      motor_shaft_diameter,
      motor_frame_size,
      rpm,
      nm,
      sf,
      overhead_load,
    } = form;

    if (!model || !power || !type || !ratio) {
      Alert.alert("Error", "Model, Power, Type and Ratio are required.");
      return;
    }

    const payload = {
      model,
      power,
      type,
      ratio,
      base_price,
      other_specification: {
        motor_shaft_diameter,
        motor_frame_size,
        rpm,
        nm,
        sf,
        overhead_load,
      },
    };

    mutation.mutate(payload);
  };

  const typeOptions = [
    { label: "Select Type", value: "" },
    { label: "Base (Foot)", value: "Base (Foot)" },
    { label: "Vertical (Flange)", value: "Vertical (Flange)" }
  ];

  return (
    <ScrollView style={tw`flex-1 bg-white`}>
      <View style={tw`p-6 max-w-3xl`}>
        <Text style={tw`text-2xl font-bold mb-6`}>Create Finished Good</Text>

        <View style={tw`space-y-4`}>
          {/* Row 1 */}
          <View style={tw`flex-row gap-4`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-sm font-medium mb-2`}>Model</Text>
              <Input
                value={form.model} 
                onChangeText={(value) => handleChange('model', value)} 
              />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-sm font-medium mb-2`}>Power</Text>
              <Input 
                value={form.power} 
                onChangeText={(value) => handleChange('power', value)} 
              />
            </View>
          </View>

          {/* Row 2 */}
          <View style={tw`flex-row gap-4`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-sm font-medium mb-2`}>Ratio</Text>
              <Input 
                value={form.ratio} 
                onChangeText={(value) => handleChange('ratio', value)} 
              />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-sm font-medium mb-2`}>Type</Text>
              <Select
                value={form.type}
                onValueChange={(value) => handleChange('type', value)}
                options={typeOptions}
              />
            </View>
          </View>

          {/* Row 3 */}
          <View style={tw`flex-row gap-4`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-sm font-medium mb-2`}>Motor Shaft Diameter</Text>
              <Input 
                value={form.motor_shaft_diameter} 
                onChangeText={(value) => handleChange('motor_shaft_diameter', value)} 
              />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-sm font-medium mb-2`}>Motor Frame Size</Text>
              <Input 
                value={form.motor_frame_size} 
                onChangeText={(value) => handleChange('motor_frame_size', value)} 
              />
            </View>
          </View>

          {/* Row 4 */}
          <View style={tw`flex-row gap-4`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-sm font-medium mb-2`}>RPM</Text>
              <Input 
                value={form.rpm} 
                onChangeText={(value) => handleChange('rpm', value)} 
              />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-sm font-medium mb-2`}>Nm</Text>
              <Input 
                value={form.nm} 
                onChangeText={(value) => handleChange('nm', value)} 
              />
            </View>
          </View>

          {/* Row 5 */}
          <View style={tw`flex-row gap-4`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-sm font-medium mb-2`}>SF</Text>
              <Input 
                value={form.sf} 
                onChangeText={(value) => handleChange('sf', value)} 
              />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-sm font-medium mb-2`}>Overhead Load</Text>
              <Input 
                value={form.overhead_load} 
                onChangeText={(value) => handleChange('overhead_load', value)} 
              />
            </View>
          </View>

          {/* Base Price */}
          <View>
            <Text style={tw`text-sm font-medium mb-2`}>Base Price</Text>
            <Input 
              value={form.base_price} 
              onChangeText={(value) => handleChange('base_price', value)} 
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={tw`flex-row justify-end gap-4 pt-6`}>
          <Button
            variant="outline" 
            onPress={() => navigation.goBack()}
          >
            Cancel
          </Button>
          <Button
            onPress={handleSubmit} 
            loading={mutation.isLoading}
          >
            Submit
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default CreateFinishedGood;
