// CreateSales.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import useTheme from '../../hooks/useTheme';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useSales from '../../services/useSales';
import OrderItemsForm from './OrderItemForm';
import useDebounce from '../../hooks/useDebounce';
import useManage from '../../services/useManage';
import SearchableDropdown from '../../components/common/SearchableDropdown';
import SidebarLayout from '../../layout/SidebarLayout';

const CreateSales = ({ navigation }) => {
  const { tw } = useTheme();

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

  const [page, setPage] = useState(0);
  const { getAllCustomers } = useManage();

  const [customer, setCustomer] = useState('');

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search.trim(), 150);

  const { data, isLoading } = useQuery({
    queryKey: ['customers', debouncedSearch],
    queryFn: () => getAllCustomers({ limit: 20, search: debouncedSearch }),
    staleTime: 5 * 60 * 1000,
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
    if (!customer.trim()) {
      Alert.alert('Missing Customer Name', 'Please enter customer name.');
      return;
    }

    const payload = {
      customer_name: customer,
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
    console.log(payload);
    mutation.mutate(payload);
  };

  return (
    <SidebarLayout>
      <ScrollView style={tw`flex-1 p-4 bg-white`}>
        <Text style={tw`text-2xl font-bold mb-4`}>Create Order</Text>

        <Text style={tw`text-sm mb-1`}>Customer Name</Text>

        <SearchableDropdown
          data={(data?.item || []).map(v => ({
            id: v.id,
            label: v.data[0], // Vendor Name
          }))}
          selectedValue={customer ? { label: customer } : null}
          onSelect={item => setCustomer(item.label)}
          placeholder="Search Vendor"
          containerStyle="mb-4"
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
    </SidebarLayout>
  );
};

export default CreateSales;
