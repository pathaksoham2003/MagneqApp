import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import SidebarLayout from '../../layout/SidebarLayout';
import useTheme from '../../hooks/useTheme';
import useRawMaterials from '../../services/useRawMaterials';

const RawMaterialDetail = () => {
    const { tw } = useTheme();
  
  const route = useRoute();
  const navigation = useNavigation();
  const { class_type, id } = route.params || {};
  const { getRawMaterialByClassAndId, transitionQuantity } = useRawMaterials();
  const queryClient = useQueryClient();

  const [transitionLoading, setTransitionLoading] = useState(false);
  const [fromStage, setFromStage] = useState('');
  const [toStage, setToStage] = useState('');
  const [transitionQty, setTransitionQty] = useState('1');

  const {
    data: material,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['rawMaterialDetail', class_type, id],
    queryFn: () => getRawMaterialByClassAndId(class_type, id),
    enabled: !!class_type && !!id,
  });

useEffect(() => {
  if (!material?.quantity) return;
  const quantityKeys = Object.keys(material.quantity);
  if (quantityKeys.length <= 1) return;

  if (!fromStage) {
    const keysWithQty = quantityKeys.filter(key => material.quantity[key] > 0);
    setFromStage(keysWithQty[0] || '');
    const toKeys = quantityKeys.filter(key => key !== keysWithQty[0]);
    setToStage(toKeys[0] || '');
    setTransitionQty('1');
  }
}, [material]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleTransitionSubmit = async () => {
    if (!fromStage || !toStage || fromStage === toStage) return;
    setTransitionLoading(true);
    try {
      await transitionQuantity(
        class_type,
        id,
        fromStage,
        toStage,
        Number(transitionQty),
      );
      await queryClient.invalidateQueries([
        'rawMaterialDetail',
        class_type,
        id,
      ]);
    } catch {
      // ignore error
    }
    setTransitionLoading(false);
  };

  const renderQuantityInfo = () => {
    if (!material?.quantity) return <Text>No quantity information</Text>;

    if (typeof material.quantity === 'object') {
      return Object.entries(material.quantity).map(([key, value]) => (
        <View key={key} style={tw`flex-row justify-between py-1`}>
          <Text style={tw`font-medium capitalize`}>{key}:</Text>
          <Text>{value}</Text>
        </View>
      ));
    }

    return <Text>{material.quantity.toString()}</Text>;
  };

  const renderSpecifications = () => {
    if (!material?.other_specification) return <Text>No specifications</Text>;

    return Object.entries(material.other_specification).map(([key, value]) => (
      <View key={key} style={tw`flex-row justify-between py-1`}>
        <Text style={tw`font-medium capitalize`}>{key}:</Text>
        <Text>{value}</Text>
      </View>
    ));
  };

  const getStockStatus = () => {
    if (!material?.quantity) return { status: 'Unknown', color: 'gray' };

    let currentQuantity = 0;
    let minQuantity = material.min_quantity || 0;

    if (typeof material.quantity === 'object' && material.quantity !== null) {
      currentQuantity = Object.values(material.quantity).reduce(
        (sum, val) => sum + (parseFloat(val) || 0),
        0,
      );
    } else {
      currentQuantity = parseFloat(material.quantity) || 0;
    }

    if (currentQuantity > minQuantity) {
      return { status: 'In Stock', color: 'green' };
    } else {
      return { status: 'Out of Stock', color: 'red' };
    }
  };

  const stockStatus = getStockStatus();

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" />
        <Text style={tw`mt-2`}>Loading raw material details...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={tw`p-4`}>
        <Text style={tw`text-red-600 text-lg mb-4`}>
          Error: {error?.message || 'Failed to load raw material details'}
        </Text>
        <TouchableOpacity
          onPress={handleBack}
          style={tw`bg-gray-300 rounded p-3`}
        >
          <Text>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!material) {
    return (
      <View style={tw`p-4`}>
        <Text style={tw`text-gray-500 text-lg mb-4`}>
          Raw material not found
        </Text>
        <TouchableOpacity
          onPress={handleBack}
          style={tw`bg-gray-300 rounded p-3`}
        >
          <Text>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SidebarLayout>
      <ScrollView style={tw`flex-1 bg-white p-4`}>
        {/* Header */}
        <View style={tw`flex-row justify-between items-center mb-6`}>
          <View>
            <Text style={tw`text-2xl font-semibold`}>Raw Material Details</Text>
            <Text style={tw`text-gray-600 mt-1`}>
              Class {class_type} - {material.name || 'Unnamed Material'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleBack}
            style={tw`border border-gray-500 rounded px-3 py-2`}
          >
            <Text>← Back to Store</Text>
          </TouchableOpacity>
        </View>

        {/* Basic Information */}
        <View style={tw`bg-gray-100 rounded-lg p-4 mb-8`}>
          <Text style={tw`text-lg font-semibold mb-4`}>Basic Information</Text>

          <View style={tw`flex-row justify-between mb-2`}>
            <Text style={tw`font-medium text-gray-700`}>Class Type:</Text>
            <View style={tw`bg-blue-500 rounded px-2 py-1`}>
              <Text style={tw`text-white`}>Class {material.class_type}</Text>
            </View>
          </View>

          {material.name && (
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`font-medium text-gray-700`}>Name:</Text>
              <Text>{material.name}</Text>
            </View>
          )}

          {material.type && (
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`font-medium text-gray-700`}>Type:</Text>
              <Text>{material.type}</Text>
            </View>
          )}

          <View style={tw`flex-row justify-between mb-2`}>
            <Text style={tw`font-medium text-gray-700`}>Stock Status:</Text>
            <View
              style={tw`rounded px-2 py-1 ${
                stockStatus.color === 'green' ? 'bg-green-600' : 'bg-red-600'
              }`}
            >
              <Text style={tw`text-white`}>{stockStatus.status}</Text>
            </View>
          </View>
        </View>

        {/* Quantity Information */}
        <View style={tw`bg-gray-100 rounded-lg p-4 mb-8`}>
          <Text style={tw`text-lg font-semibold mb-4`}>
            Quantity Information
          </Text>
          {renderQuantityInfo()}
          {material.min_quantity !== undefined && (
            <>
              <Text style={tw`text-md font-medium mt-4 mb-2`}>
                Minimum Quantity
              </Text>
              <View style={tw`bg-white rounded p-3`}>
                <Text>{material.min_quantity}</Text>
              </View>
            </>
          )}
        </View>

        {/* Specifications */}
        {material.other_specification &&
          Object.keys(material.other_specification).length > 0 && (
            <View style={tw`bg-gray-100 rounded-lg p-4 mb-8`}>
              <Text style={tw`text-lg font-semibold mb-4`}>Specifications</Text>
              {renderSpecifications()}
            </View>
          )}

        {/* Additional Info */}
        <View style={tw`grid grid-cols-1 md:grid-cols-2 gap-6 mb-8`}>
          {material.created_at && (
            <View style={tw`mb-4`}>
              <Text style={tw`text-md font-medium mb-2`}>Created At</Text>
              <View style={tw`bg-white rounded p-3`}>
                <Text>
                  {new Date(material.created_at).toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}

          {material.updated_at && (
            <View style={tw`mb-4`}>
              <Text style={tw`text-md font-medium mb-2`}>Last Updated</Text>
              <View style={tw`bg-white rounded p-3`}>
                <Text>
                  {new Date(material.updated_at).toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}

          {material.expiry_date && (
            <View style={tw`mb-4`}>
              <Text style={tw`text-md font-medium mb-2`}>Expiry Date</Text>
              <View style={tw`bg-white rounded p-3`}>
                <Text>
                  {new Date(material.expiry_date).toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Transition UI */}
        {material?.quantity && Object.keys(material.quantity).length > 1 && (
          <View style={tw`max-w-2xl mx-auto mt-8`}>
            <Text style={tw`text-lg font-semibold mb-4`}>
              Transition Quantity
            </Text>

            <View
              style={tw`border border-gray-300 rounded-lg bg-white p-4 flex-col md:flex-row items-center gap-4`}
            >
              {/* From Stage */}
              <View style={tw`flex flex-col gap-1 mb-4`}>
                <Text style={tw`text-sm font-medium mb-1`}>From</Text>
                <View style={tw`border rounded`}>
                  <Picker
                    enabled={!transitionLoading}
                    selectedValue={fromStage}
                    onValueChange={itemValue => {
                      setFromStage(itemValue);
                      const toKeys = Object.keys(material.quantity).filter(
                        k => k !== itemValue,
                      );
                      setToStage(toKeys[0] || '');
                      setTransitionQty('1');
                    }}
                  >
                    {Object.keys(material.quantity).map(stage => (
                      <Picker.Item
                        label={`${
                          stage.charAt(0).toUpperCase() + stage.slice(1)
                        } (Available: ${material.quantity[stage] || 0})`}
                        value={stage}
                        key={stage}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Arrow */}
              <Text style={tw`text-xl font-bold mb-4`}>→</Text>

              {/* To Stage */}
              <View style={tw`flex flex-col gap-1 mb-4`}>
                <Text style={tw`text-sm font-medium mb-1`}>To</Text>
                <View style={tw`border rounded`}>
                  <Picker
                    enabled={!transitionLoading}
                    selectedValue={toStage}
                    onValueChange={setToStage}
                  >
                    {Object.keys(material.quantity).map(stage => (
                      <Picker.Item
                        label={stage.charAt(0).toUpperCase() + stage.slice(1)}
                        value={stage}
                        key={stage}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Quantity Input */}
              <View style={tw`flex flex-col gap-1 mb-4`}>
                <Text style={tw`text-sm font-medium mb-1`}>Quantity</Text>
                <TextInput
                  style={tw`border rounded px-2 py-1 w-20`}
                  keyboardType="numeric"
                  editable={!transitionLoading}
                  value={transitionQty}
                  onChangeText={val => {
                    let num = Number(val);
                    if (isNaN(num) || num < 1) num = 1;
                    if (num > (material.quantity[fromStage] || 1))
                      num = material.quantity[fromStage] || 1;
                    setTransitionQty(String(num));
                  }}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleTransitionSubmit}
                disabled={
                  transitionLoading ||
                  !fromStage ||
                  !toStage ||
                  fromStage === toStage ||
                  Number(transitionQty) < 1 ||
                  Number(transitionQty) > (material.quantity[fromStage] || 0)
                }
                style={tw.style(
                  'rounded px-4 py-2',
                  transitionLoading ? 'bg-gray-400' : 'bg-blue-600',
                  (transitionLoading ||
                    !fromStage ||
                    !toStage ||
                    fromStage === toStage ||
                    Number(transitionQty) < 1 ||
                    Number(transitionQty) >
                      (material.quantity[fromStage] || 0)) &&
                    'opacity-50',
                )}
              >
                {transitionLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={tw`text-white font-semibold`}>Transition</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SidebarLayout>
  );
};

export default RawMaterialDetail;
