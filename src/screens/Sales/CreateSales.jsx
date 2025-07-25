// CreateSales.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { tw } from '../../App';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useSales from '../../services/useSales';
import OrderItemsForm from './OrderItemForm';

const CreateSales = ({ navigation }) => {
  const { createSale } = useSales(); // custom hook for API call
  const queryClient = useQueryClient();

  const [repName, setRepName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState([]);

  const [model, setModel] = useState('');
  const [type, setType] = useState('');
  const [ratio, setRatio] = useState('');
  const [power, setPower] = useState('');
  const [quantity, setQuantity] = useState('');

  const mutation = useMutation({
    mutationFn: orderPayload => createSale(orderPayload),
    onSuccess: () => {
      queryClient.invalidateQueries(['sales']);
      Alert.alert('Success', 'Order submitted successfully!');
      resetForm();
      navigation.goBack();
    },
    onError: error => {
      Alert.alert('Error', 'Failed to submit order. Please try again.');
      console.error(error);
    },
  });

  const resetForm = () => {
    setRepName('');
    setCustomerName('');
    setDescription('');
    setItems([]);
    setModel('');
    setType('');
    setRatio('');
    setPower('');
    setQuantity('');
  };

  const handleSubmit = () => {
    if (items.length === 0) {
      Alert.alert('No Items', 'Add at least one item before submitting.');
      return;
    }
    if (!customerName.trim()) {
      Alert.alert('Missing Customer Name', 'Please enter customer name.');
      return;
    }

    const payload = {
      customer_name: customerName,
      magneq_user: repName,
      description,
      delivery_date: new Date().toISOString().split('T')[0],
      // Assume you have user info from context or redux; use placeholder here
      created_by: 'userIdPlaceholder',
      finished_goods: items.map(item => ({
        model: item.model,
        type: item.type,
        ratio: item.ratio,
        power: item.power,
        quantity: item.quantity,
      })),
    };

    mutation.mutate(payload);
  };

  return (
    <ScrollView style={tw`flex-1 p-4 bg-white`}>
      <Text style={tw`text-2xl font-bold mb-4`}>Create Order</Text>

      {/* Rep Name */}
      <Text style={tw`mb-1`}>Representative Name</Text>
      <TextInput
        style={tw`border border-gray-300 rounded p-2 mb-4`}
        placeholder="Enter representative name"
        value={repName}
        onChangeText={setRepName}
      />

      {/* Customer Name */}
      <Text style={tw`mb-1`}>Customer Name</Text>
      <TextInput
        style={tw`border border-gray-300 rounded p-2 mb-4`}
        placeholder="Enter customer name"
        value={customerName}
        onChangeText={setCustomerName}
      />

      {/* Description */}
      <Text style={tw`mb-1`}>Order Description</Text>
      <TextInput
        multiline
        numberOfLines={3}
        style={tw`border border-gray-300 rounded p-2 mb-4`}
        placeholder="Enter order description"
        value={description}
        onChangeText={setDescription}
      />

      {/* Order Items Form */}
      <OrderItemsForm
        items={items}
        setItems={setItems}
        model={model}
        setModel={setModel}
        type={type}
        setType={setType}
        ratio={ratio}
        setRatio={setRatio}
        power={power}
        setPower={setPower}
        quantity={quantity}
        setQuantity={setQuantity}
      />

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={mutation.isLoading || items.length === 0}
        style={tw.style(
          'p-4 rounded mt-6',
          mutation.isLoading || items.length === 0
            ? 'bg-gray-400'
            : 'bg-blue-600',
        )}
      >
        {mutation.isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={tw`text-white text-center text-lg`}>Submit Order</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateSales;
