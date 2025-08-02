import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import useTheme from '../../hooks/useTheme';
import useFinishedGoods from '../../services/useFinishedGoods';
import { useQuery } from '@tanstack/react-query';
import Dropdown from '../../components/common/DropDown';

const OrderItemsForm = ({
  items,
  setItems,
  model,
  setModel,
  type,
  setType,
  ratio,
  setRatio,
  quantity,
  setQuantity,
  power,
  setPower,
}) => {
  const { getModalConfig } = useFinishedGoods();
  const [availablePowers, setAvailablePowers] = useState([]);
  const [availableRatios, setAvailableRatios] = useState([]);
  const { tw } = useTheme();
  const {
    data: modelConfig,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['modalConfig'],
    queryFn: async () => {
      const data = await getModalConfig();
      Object.keys(data).forEach(modelKey => {
        data[modelKey].powers = data[modelKey].powers.map(item=>item);
        const ratios = data[modelKey].ratios;
        const normalizedRatios = {};
        Object.keys(ratios).forEach(powerKey => {
          normalizedRatios[powerKey.toString()] = ratios[powerKey];
        });
        data[modelKey].ratios = normalizedRatios;
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (modelConfig?.[model]) {
      setAvailablePowers(modelConfig[model].powers);
    } else {
      setAvailablePowers([]);
    }
    setPower('');
    setRatio('');
  }, [model]);

  useEffect(() => {
    const ratios = modelConfig?.[model]?.ratios?.[power];
    setAvailableRatios(ratios || []);
    setRatio('');
  }, [power]);

  const handleAdd = () => {
    if (!model || !type || !ratio || !quantity || !power) {
      return Alert.alert('Missing Fields', 'Fill all fields');
    }

    setItems(prev => [
      ...prev,
      {
        id: Date.now(),
        model,
        type,
        ratio,
        power: power,
        quantity: parseFloat(quantity),
      },
    ]);

    setModel('');
    setType('');
    setRatio('');
    setPower('');
    setQuantity('');
  };

  if (isLoading) return <Text style={tw`text-center mt-10`}>Loading...</Text>;
  if (isError)
    return (
      <Text style={tw`text-center mt-10 text-red-500`}>
        Error loading config
      </Text>
    );

  return (
    <ScrollView style={tw`mt-4`}>
      <View style={tw`gap-4`}>
        <Dropdown
          label="Model"
          data={Object.keys(modelConfig)}
          value={model}
          setValue={setModel}
        />
        <Dropdown
          label="Power"
          data={availablePowers.map(String)}
          value={power}
          setValue={setPower}
        />
        <Dropdown
          label="Ratio"
          data={availableRatios}
          value={ratio}
          setValue={setRatio}
        />
        <Dropdown
          label="Type"
          data={['Base (Foot)', 'Vertical (Flange)']}
          value={type}
          setValue={setType}
        />

        <Text style={tw`text-sm text-gray-700`}>Quantity</Text>
        <TextInput
          value={quantity}
          keyboardType="numeric"
          onChangeText={setQuantity}
          style={tw`border border-gray-300 p-2 rounded mb-4`}
        />

        <TouchableOpacity
          onPress={handleAdd}
          style={tw`bg-green-500 px-4 py-2 rounded`}
        >
          <Text style={tw`text-white text-center`}>+ Add Item</Text>
        </TouchableOpacity>

        {items.length > 0 && (
          <View style={tw`mt-6`}>
            {items.map(({ id, model, power, ratio, type, quantity }) => (
              <View
                key={id}
                style={tw`flex-row justify-between items-center border p-3 rounded mb-2`}
              >
                <Text>{`${model} | ${power} | ${ratio} | ${type} | ${quantity}`}</Text>
                <TouchableOpacity
                  onPress={() =>
                    setItems(prev => prev.filter(i => i.id !== id))
                  }
                >
                  <Text style={tw`text-red-500`}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default OrderItemsForm;
