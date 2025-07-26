// screens/Sales/ViewSales.js
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useSales from '../../services/useSales';
import useTheme from '../../hooks/useTheme';
import SidebarLayout from '../../layout/SidebarLayout';

// Utility function for status formatting as React Native components
const formatStatus = (status,tw) => {
  
  if (typeof status === 'boolean') {
    return (
      <View
      style={[
        tw`px-2 py-1 rounded-full`,
        status ? tw`bg-green-100` : tw`bg-yellow-100`,
      ]}
      >
        <Text
          style={
            status ? tw`text-green-700 text-xs` : tw`text-yellow-700 text-xs`
          }
          >
          {status ? 'Completed' : 'Pending'}
        </Text>
      </View>
    );
  }
  if (typeof status === 'string') {
    return <Text style={tw`text-base`}>{status.replace(/_/g, ' ')}</Text>;
  }
  return <Text>{String(status)}</Text>;
};

const formatCurrency = value => {
  return Number(value).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  });
};

const ViewSales = ({ navigation }) => {
  const route = useRoute();
  const { tw } = useTheme();
  const { id } = route.params;
  const {
    getSaleById,
    approaveSale,
    rejectSale,
    getSaleStatus,
    saleRecievedAmt,
  } = useSales();
  const queryClient = useQueryClient();

  const [editPrices, setEditPrices] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [receivedInput, setReceivedInput] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['salesOrderById', id],
    queryFn: () => getSaleById(id),
  });

  // Setup editable prices when data loads
  useEffect(() => {
    if (data && data.itemLevelData?.items) {
      setEditPrices(
        data.itemLevelData.items.map(item => ({
          ...item,
          rate_per_unit: item.rate_per_unit?.toString() || '0',
          fg_id: item.fg_id,
        })),
      );
    }
  }, [data]);

  if (isLoading || !data) {
    return (
      <View style={[tw`flex-1 justify-center items-center`]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const { headerLevelData = {}, itemLevelData = {} } = data;

  const status = headerLevelData.Status;
  const isUnapproved = status === 'UN_APPROVED';
  // For simplicity, assuming roles come from your app context or Redux, adapt as needed
  // const userRole = useSelector(selectAuth)?.route?.role;
  // For now, let's assume a role that can approve:
  const userRole = 'SALES_EXEC'; // replace with your auth logic
  const canApprove =
    (userRole === 'SALES_EXEC' || userRole === 'ADMIN') && isUnapproved;

  const canUpdateStatus = status === 'PROCESSED' || status === 'DISPATCHED';
  const nextStatus = status === 'PROCESSED' ? 'DISPATCHED' : 'DELIVERED';

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      // Prevent approval if any rate_per_unit is 0 or empty
      const hasZero = (editPrices || []).some(
        item => !item.rate_per_unit || Number(item.rate_per_unit) === 0,
      );
      if (hasZero) {
        Alert.alert(
          'Validation',
          'All items must have a non-zero price before approval.',
        );
        setIsApproving(false);
        return;
      }
      // Prepare updated items with new prices
      const updatedItems = (editPrices || []).map(item => ({
        fg_id: item.fg_id,
        rate_per_unit: Number(item.rate_per_unit),
        quantity: item.quantity,
        item_total_price: Number(item.rate_per_unit) * Number(item.quantity),
      }));
      await approaveSale(id, { finished_goods: updatedItems });
      await queryClient.invalidateQueries(['salesOrderById', id]);
      setIsApproving(false);
      Alert.alert('Success', 'Sales order approved.');
      navigation.goBack();
    } catch (e) {
      setIsApproving(false);
      Alert.alert('Error', 'Approval failed');
    }
  };

  const handleReject = async () => {
    setIsApproving(true);
    try {
      await rejectSale(id);
      await queryClient.invalidateQueries(['salesOrderById', id]);
      setIsApproving(false);
      Alert.alert('Success', 'Sales order rejected.');
      navigation.goBack();
    } catch {
      setIsApproving(false);
      Alert.alert('Error', 'Rejection failed');
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await getSaleStatus(id, { status: nextStatus });
      await queryClient.invalidateQueries(['salesOrderById', id]);
      await queryClient.invalidateQueries(['sales']);
      Alert.alert('Success', `Status updated to ${nextStatus}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const handleAmountSubmit = async () => {
    try {
      await saleRecievedAmt(id, { recieved_amt: Number(receivedInput) });
      await queryClient.invalidateQueries(['salesOrderById', id]);
      setReceivedInput('');
      Alert.alert('Success', 'Received amount updated');
      // No navigation here, stay on the same page and show updated data
    } catch {
      Alert.alert('Error', 'Failed to update received amount');
    }
  };

  return (
    <SidebarLayout>
      <ScrollView contentContainerStyle={tw`p-4 bg-white`}>
        <Text style={tw`text-2xl font-semibold mb-4`}>Sales Order Details</Text>

        {/* Header info grid */}
        <View style={tw`mb-6`}>
          {Object.entries(headerLevelData).map(([key, val]) => {
            let displayValue = val;
            if (key === 'Date of Creation') {
              displayValue = new Date(val).toLocaleDateString();
            } else if (key === 'Status') {
              return (
                <View key={key} style={tw`flex-row justify-between mb-2`}>
                  <Text style={tw`font-semibold`}>{key}</Text>
                  {formatStatus(val,tw)}
                </View>
              );
            } else if (key === 'Total Price' || key === 'Recieved Amount') {
              displayValue = formatCurrency(val);
            } else if (Array.isArray(val)) {
              displayValue = val.join(', ');
            }

            return (
              <View key={key} style={tw`flex-row justify-between mb-2`}>
                <Text style={tw`font-semibold`}>{key}</Text>
                <Text>{displayValue}</Text>
              </View>
            );
          })}
        </View>

        <Text style={tw`text-xl font-semibold mb-2`}>Order Items</Text>

        {/* Items Table or Editable inputs */}
        {canApprove ? (
          <>
            {(editPrices || []).map((item, idx) => (
              <View
                key={idx}
                style={tw`flex-row justify-between items-center mb-3 border border-gray-200 rounded p-2`}
              >
                <Text style={tw`flex-1`}>{item.quantity}</Text>
                <Text style={tw`flex-2`}>{item.finished_good}</Text>
                <TextInput
                  style={[
                    tw`flex-1 border rounded px-2 py-1`,
                    { minWidth: 60 },
                  ]}
                  keyboardType="numeric"
                  value={item.rate_per_unit}
                  onChangeText={text => {
                    setEditPrices(prices =>
                      prices.map((r, i) =>
                        i === idx ? { ...r, rate_per_unit: text } : r,
                      ),
                    );
                  }}
                />
                <Text style={tw`flex-1`}>
                  {(
                    Number(item.quantity) * Number(item.rate_per_unit || 0)
                  ).toFixed(2)}
                </Text>
                {formatStatus(item.status,tw)}
              </View>
            ))}

            <View style={tw`flex-row justify-around mt-4`}>
              <TouchableOpacity
                onPress={handleApprove}
                disabled={isApproving}
                style={[
                  tw`bg-blue-600 px-4 py-2 rounded`,
                  isApproving && tw`opacity-50`,
                ]}
              >
                <Text style={tw`text-white`}>
                  {isApproving ? 'Approving...' : 'Approve'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleReject}
                disabled={isApproving}
                style={[
                  tw`bg-red-600 px-4 py-2 rounded`,
                  isApproving && tw`opacity-50`,
                ]}
              >
                <Text style={tw`text-white`}>
                  {isApproving ? 'Rejecting...' : 'Reject'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {(itemLevelData.items || []).map((item, idx) => (
              <View
                key={idx}
                style={tw`flex-row justify-between items-center mb-3 border border-gray-200 rounded p-2`}
              >
                <Text style={tw`flex-1`}>{item.quantity}</Text>
                <Text style={tw`flex-2`}>{item.finished_good}</Text>
                <Text style={tw`flex-1`}>{item.rate_per_unit}</Text>
                <Text style={tw`flex-1`}>{item.item_total_price}</Text>
                {formatStatus(item.status,tw)}
              </View>
            ))}
          </>
        )}

        {/* Update status button */}
        {canUpdateStatus && (
          <TouchableOpacity
            onPress={handleStatusUpdate}
            style={tw`bg-indigo-600 rounded mt-4 py-2 items-center`}
          >
            <Text style={tw`text-white text-lg`}>Mark as {nextStatus}</Text>
          </TouchableOpacity>
        )}

        {/* Add Received Amount */}
        {headerLevelData['Recieved Amount'] <
          headerLevelData['Total Price'] && (
          <View style={tw`mt-6`}>
            <Text style={tw`text-lg font-medium mb-2`}>
              Add Received Amount
            </Text>
            <View style={tw`flex-row items-center`}>
              <TextInput
                style={[
                  tw`border rounded px-2 py-1`,
                  { width: 100, marginRight: 10 },
                ]}
                keyboardType="numeric"
                min={1}
                max={
                  headerLevelData['Total Price'] -
                  headerLevelData['Recieved Amount']
                }
                placeholder={`Due Amount: ₹${
                  Number(headerLevelData['Total Price']) -
                  Number(headerLevelData['Recieved Amount'])
                }`}
                value={receivedInput}
                onChangeText={setReceivedInput}
              />
              <TouchableOpacity
                onPress={handleAmountSubmit}
                disabled={!receivedInput}
                style={[
                  tw`bg-green-600 px-4 py-2 rounded`,
                  !receivedInput && tw`opacity-50`,
                ]}
              >
                <Text style={tw`text-white`}>Submit Amount</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SidebarLayout>
  );
};

export default ViewSales;
