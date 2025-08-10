// screens/quality/CreateTicket.jsx

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import Button from '../../components/common/Button';
import SuccessModel from '../../components/common/SuccessModel';
import Icon from 'react-native-vector-icons/Ionicons';
import useTheme from '../../hooks/useTheme';
import SidebarLayout from '../../layout/SidebarLayout';
import useFinishedGoods from '../../services/useFinishedGoods';
import useQuality from '../../services/useQuality';

const issueTypes = [
  { value: "Material", label: "Material" },
  { value: "Delivery", label: "Delivery" },
  { value: "Process", label: "Process" },
  { value: "Employee", label: "Employee" },
];

const typeOptions = [
  { value: "Base (Foot)", label: "Base (Foot)" },
  { value: "Vertical (Flange)", label: "Vertical (Flange)" },
];

const initialItem = () => ({
  model: "",
  power: "",
  ratio: "",
  type: "",
  order_number: "",
});

const CreateTicket = () => {
  const { tw } = useTheme();
  const navigation = useNavigation();
  const modalTimeoutRef = useRef(null);
  const queryClient = useQueryClient();
  const { getModalConfig } = useFinishedGoods();
  const { createQualityIssue } = useQuality();

  // State management
  const [issueType, setIssueType] = useState("Material");
  const [items, setItems] = useState([initialItem()]);
  const [description, setDescription] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // React Query for model configuration
  const {
    data: modelConfig,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["modalConfig"],
    queryFn: async () => {
      const data = await getModalConfig();
      Object.keys(data).forEach((modelKey) => {
        data[modelKey].powers = data[modelKey].powers.map(item => item);
        const normalizedRatios = {};
        Object.keys(data[modelKey].ratios).forEach((powerKey) => {
          normalizedRatios[powerKey.toString()] =
            data[modelKey].ratios[powerKey];
        });
        data[modelKey].ratios = normalizedRatios;
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Mutation for creating quality issue
  const mutation = useMutation({
    mutationFn: createQualityIssue,
    onSuccess: () => {
      setShowSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["quality-issues"] });
      if (modalTimeoutRef.current) clearTimeout(modalTimeoutRef.current);
      modalTimeoutRef.current = setTimeout(() => {
        setShowSuccess(false);
        navigation.goBack('TicketDetails');
      }, 2000);
    },
    onError: (error) => {
      console.error("Failed to create quality issue:", error);
      Alert.alert('Error', 'Failed to submit ticket. Please try again.');
    },
  });

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (modalTimeoutRef.current) clearTimeout(modalTimeoutRef.current);
    };
  }, []);

  const handleItemChange = (idx, key, value) => {
    const newItems = [...items];
    newItems[idx][key] = value;

    // Reset dependent fields when parent field changes
    if (key === "model") {
      newItems[idx].power = "";
      newItems[idx].ratio = "";
      newItems[idx].type = "";
    } else if (key === "power") {
      newItems[idx].ratio = "";
      newItems[idx].type = "";
    } else if (key === "ratio") {
      newItems[idx].type = "";
    }

    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, initialItem()]);
  };

  const handleRemoveItem = (idx) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== idx));
    }
  };

  const isFormValid = () => {
    return issueType === "Material"
      ? items.every(
          (item) => item.model && item.power && item.ratio && item.type
        )
      : description.trim() !== "";
  };

  const handleCreate = (e) => {
    if (e) e.preventDefault();
    if (!isFormValid()) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    const payload = issueType === "Material"
      ? {
          issue_type: issueType,
          items: items.map((item) => ({
            model: item.model,
            power: item.power,
            ratio: item.ratio,
            type: item.type,
            order_number: item.order_number,
          })),
          description,
        }
      : {
          issue_type: issueType,
          description,
        };

    mutation.mutate(payload);
  };

  const modelOptions = modelConfig
    ? Object.keys(modelConfig).map((model) => ({
        value: model,
        label: model,
      }))
    : [];

  if (isLoading) {
    return (
      <SidebarLayout>
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#4F7FFF" />
          <Text style={tw`mt-2 text-gray-600`}>Loading configuration...</Text>
        </View>
      </SidebarLayout>
    );
  }

  if (isError) {
    return (
      <SidebarLayout>
        <View style={tw`flex-1 justify-center items-center px-4`}>
          <Text style={tw`text-red-600 text-center mb-4`}>
            Failed to load configuration. Please try again.
          </Text>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["modalConfig"] })}>
            Retry
          </Button>
        </View>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <View style={tw`flex-1 bg-white`}>
        {/* Header */}
        <View style={tw`px-4 pt-10 pb-4`}>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-xl font-bold text-gray-900`}>Quality Concerns</Text>
            <Icon name="search" size={22} color="#000" />
          </View>
        </View>

        {/* Scrollable Form Content */}
        <ScrollView 
          style={tw`flex-1 px-4`}
          contentContainerStyle={tw`pb-4`}
          showsVerticalScrollIndicator={false}
        >
          <View style={tw`border border-gray-200 rounded-2xl p-4`}>
            <Text style={tw`text-lg font-semibold mb-4`}>Create Ticket</Text>

            {/* Issue Type */}
            <Text style={tw`text-sm mb-1`}>Issue Type</Text>
            <View style={tw`border border-gray-300 rounded-md mb-3`}>
              <Picker
                selectedValue={issueType}
                onValueChange={setIssueType}
              >
                {issueTypes.map((opt) => (
                  <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                ))}
              </Picker>
            </View>

            {/* Material-specific fields */}
            {issueType === "Material" && items.map((item, idx) => {
              const powers = modelConfig && item.model
                ? modelConfig[item.model]?.powers || []
                : [];

              const ratios = modelConfig && item.model && item.power
                ? modelConfig[item.model]?.ratios?.[item.power] || []
                : [];

              return (
                <View key={idx} style={tw`mb-4 p-3 border border-gray-100 rounded-lg`}>
                  <View style={tw`flex-row justify-between items-center mb-2`}>
                    <Text style={tw`text-sm font-medium`}>Item {idx + 1}</Text>
                    {items.length > 1 && (
                      <TouchableOpacity
                        onPress={() => handleRemoveItem(idx)}
                        style={tw`p-1`}
                      >
                        <Icon name="trash-outline" size={16} color="#ef4444" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Model */}
                  <Text style={tw`text-sm mb-1`}>Model</Text>
                  <View style={tw`border border-gray-300 rounded-md mb-2`}>
                    <Picker
                      selectedValue={item.model}
                      onValueChange={(value) => handleItemChange(idx, "model", value)}
                    >
                      <Picker.Item label="Select Model" value="" />
                      {modelOptions.map((opt) => (
                        <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                      ))}
                    </Picker>
                  </View>

                  {/* Power */}
                  <Text style={tw`text-sm mb-1`}>Power</Text>
                  <View style={tw`border border-gray-300 rounded-md mb-2 ${!item.model && 'opacity-50'}`}>
                    <Picker
                      selectedValue={item.power}
                      onValueChange={(value) => handleItemChange(idx, "power", value)}
                      enabled={!!item.model}
                    >
                      <Picker.Item label="Select Power" value="" />
                      {powers.map((power) => (
                        <Picker.Item key={power} label={power} value={power} />
                      ))}
                    </Picker>
                  </View>

                  {/* Ratio */}
                  <Text style={tw`text-sm mb-1`}>Ratio</Text>
                  <View style={tw`border border-gray-300 rounded-md mb-2 ${!item.power && 'opacity-50'}`}>
                    <Picker
                      selectedValue={item.ratio}
                      onValueChange={(value) => handleItemChange(idx, "ratio", value)}
                      enabled={!!item.power}
                    >
                      <Picker.Item label="Select Ratio" value="" />
                      {ratios.map((ratio) => (
                        <Picker.Item key={ratio} label={ratio} value={ratio} />
                      ))}
                    </Picker>
                  </View>

                  {/* Type */}
                  <Text style={tw`text-sm mb-1`}>Type</Text>
                  <View style={tw`border border-gray-300 rounded-md mb-2 ${!item.ratio && 'opacity-50'}`}>
                    <Picker
                      selectedValue={item.type}
                      onValueChange={(value) => handleItemChange(idx, "type", value)}
                      enabled={!!item.ratio}
                    >
                      <Picker.Item label="Select Type" value="" />
                      {typeOptions.map((opt) => (
                        <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
                      ))}
                    </Picker>
                  </View>

                  {/* Order Number */}
                  <Text style={tw`text-sm mb-1`}>Order Number</Text>
                  <TextInput
                    value={item.order_number}
                    onChangeText={(value) => handleItemChange(idx, "order_number", value)}
                    placeholder="ORD-XXX"
                    style={tw`border border-gray-300 rounded-md p-3 mb-2`}
                  />
                </View>
              );
            })}

            {/* Add Item Button for Material type */}
            {issueType === "Material" && (
              <TouchableOpacity
                onPress={handleAddItem}
                style={tw`flex-row items-center justify-center p-3 border border-dashed border-gray-300 rounded-lg mb-4`}
              >
                <Icon name="add-outline" size={20} color="#4F7FFF" />
                <Text style={tw`ml-2 text-blue-600 font-medium`}>Add Another Item</Text>
              </TouchableOpacity>
            )}

            {/* Description / Other Details */}
            <Text style={tw`text-sm mb-1`}>
              {issueType === "Material" ? "Description / Other Details" : "Description"}
            </Text>
            <TextInput
              multiline
              value={description}
              onChangeText={setDescription}
              placeholder={issueType === "Material" ? "Write additional details here" : "Please describe the issue in detail"}
              style={tw`border border-gray-300 rounded-md p-3 h-24 text-top`}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        {/* Fixed Bottom Submit Button */}
        <View style={tw`px-4 py-4 bg-white border-t border-gray-200`}>
          <Button
            size="lg"
           fullWidth
            variant="primary"
            disabled={!isFormValid() || mutation.isPending}
            onClick={handleCreate}
            style={tw`w-full ${(!isFormValid() || mutation.isPending) && 'opacity-50'}`}
          >
            {mutation.isPending ? (
              <View style={tw`flex-row items-center justify-center`}>
                <ActivityIndicator size="small" color="#fff" style={tw`mr-2`} />
                <Text style={tw`text-white font-medium`}>Submitting...</Text>
              </View>
            ) : (
              'Submit Ticket'
            )}
          </Button>
        </View>
      </View>

      {/* Success Modal */}
      <SuccessModel
        visible={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          navigation.navigate('TicketDetails');
        }}
        message="Congratulations, Quality Ticket created Successfully"
      />
    </SidebarLayout>
  );
};

export default CreateTicket