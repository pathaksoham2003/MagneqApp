import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import useSales from '../../services/useSales';
import useTheme from '../../hooks/useTheme';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

const RecentOrder = () => {
  const { tw } = useTheme();
  const navigation = useNavigation();
  const { getAllSales } = useSales();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: getAllSales,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <View style={tw`py-6`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={tw`py-6`}>
        <Text style={tw`text-red-500 text-center`}>Failed to load recent orders</Text>
      </View>
    );
  }

  const headers = data?.header || [];
  const orders = data?.item || [];

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'INPROCESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'DISPATCHED':
        return 'bg-blue-100 text-blue-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <View style={tw`mb-6`}>
      <Text style={tw`text-lg font-bold mb-4`}>Recent Orders</Text>

      {orders.map((order, index) => {
        const entry = order.data;

        return (
          <View
            key={order.id}
            style={tw`bg-white p-4 rounded-xl shadow-sm mb-4`}
          >
            {/* Header Row */}
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`font-semibold text-base`}>
                {headers[0]}: {entry[0]}
              </Text>
              <Text style={tw`${getStatusColor(entry[4])} px-2 py-1 rounded text-xs`}>
                {entry[4]}
              </Text>
            </View>

            {/* Two-column Grid */}
            <View style={tw`flex-row flex-wrap justify-between`}>
              {/* Skip 0 (Order ID) and 4 (Status) */}
              {headers.slice(1, 4).map((label, i) => {
                const value = entry[i + 1];
                let formatted = Array.isArray(value)
                  ? value.join(', ')
                  : label === 'Date of Creation'
                  ? moment(value).format('DD MMM YYYY')
                  : value || '—';

                return (
                  <View key={label} style={tw`w-[48%] mb-2`}>
                    <Text style={tw`text-xs text-gray-500 mb-1`}>{label}</Text>
                    <Text style={tw`text-sm font-medium text-gray-800`}>
                      {formatted}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}

      <TouchableOpacity onPress={()=>{navigation.navigate("Sales")}}>
        <Text style={tw`text-blue-500 mt-2 text-center`}>Load More</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RecentOrder;
