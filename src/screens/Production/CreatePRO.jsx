import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import useProduction from '../../services/useProduction';
import OrderItemsForm from '../Sales/OrderItemForm';
import useTheme from '../../hooks/useTheme';
import SidebarLayout from '../../layout/SidebarLayout';

const CreatePRO = ({ navigation }) => {
  const { tw } = useTheme();
  const { createProductionOrder } = useProduction();
  const queryClient = useQueryClient();
  const user = useSelector(state => state.auth.user);

  const [items, setItems] = useState([]);
  const [model, setModel] = useState('');
  const [type, setType] = useState('');
  const [ratio, setRatio] = useState('');
  const [quantity, setQuantity] = useState('');
  const [power, setPower] = useState('');

  const mutation = useMutation({
    mutationFn: orderPayload => createProductionOrder(orderPayload),
    onSuccess: () => {
      queryClient.invalidateQueries(['pendingProductions']);
      Alert.alert('Success', 'Production order submitted successfully!');
      resetForm();
      navigation.goBack();
    },
    onError: err => {
      console.error('Order creation failed:', err);
      Alert.alert('Error', 'Failed to create production order. Please try again.');
    },
  });

  const resetForm = () => {
    setItems([]);
    setModel('');
    setType('');
    setRatio('');
    setQuantity('');
    setPower('');
  };

  const handleSubmit = () => {
    if (items.length === 0) {
      Alert.alert('Validation', 'Please add at least one item before submitting.');
      return;
    }

    const payload = {
      created_by: user?._id || null,
      finished_goods: items.map(item => ({
        model: item.model,
        type: item.type,
        ratio: item.ratio,
        power: item.power,
        quantity: item.quantity,
      })),
    };

    console.log('Submitting payload:', payload);
    mutation.mutate(payload);
  };

  return (
    <SidebarLayout>
      <ScrollView style={tw`flex-1 p-4 bg-white`}>
        <Text style={tw`text-2xl font-bold mb-4`}>Create Production Order</Text>

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

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={mutation.isLoading || items.length === 0}
          style={tw.style(
            'p-4 rounded mt-6',
            mutation.isLoading || items.length === 0
              ? 'bg-gray-400'
              : 'bg-green-600',
          )}
        >
          {mutation.isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={tw`text-white text-center text-lg`}>
              Submit Production Order
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SidebarLayout>
  );
};

export default CreatePRO;
