
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import { APIS } from '../../api/apiUrls';
import useTheme from '../../hooks/useTheme';

const DashboardMetrics = () => {
  const { tw } = useTheme();
  const api = useAxios();

  const [metrics, setMetrics] = useState([]);

  const { isLoading, data: headerData } = useQuery({
    queryKey: ['dashboard/top-stats'],
    queryFn: () => api.get(`${APIS.dashboard}/top-stats`),
  });

  useEffect(() => {
    if (!headerData) return;

    const formatCurrency = value =>
      `₹${(parseFloat(value || 0) / 10000000).toFixed(2)} Cr`;

    const formatLakh = value =>
      `₹${(parseFloat(value || 0) / 100000).toFixed(2)} L`;

    const percentArrow = change =>
      change >= 0 ? `↑ ${change.toFixed(2)}%` : `↓ ${Math.abs(change).toFixed(2)}%`;

    setMetrics([
      {
        title: 'Total Sales',
        value: formatCurrency(headerData.total_sales),
        icon: 'trending-up',
        change: percentArrow(headerData.total_sales_change),
        color: headerData.total_sales_change >= 0 ? 'text-green-500' : 'text-red-500',
      },
      {
        title: 'Total Purchases',
        value: formatLakh(headerData.total_purchases),
        icon: 'trending-down',
        change: percentArrow(headerData.total_purchases_change),
        color: headerData.total_purchases_change >= 0 ? 'text-green-500' : 'text-red-500',
      },
      {
        title: 'Ongoing Production',
        value: `${headerData.ongoing_production_orders ?? 0}`,
        icon: 'construct-outline',
        change: percentArrow(headerData.production_order_change),
        color: headerData.production_order_change >= 0 ? 'text-green-500' : 'text-red-500',
      },
      {
        title: 'Current FG Inventory',
        value: `${headerData.current_fg_inventory ?? 0}`,
        icon: 'cube-outline',
        change: '',
        color: 'text-gray-400',
      },
    ]);
  }, [headerData]);

  if (isLoading) {
    return (
      <View style={tw`justify-center items-center py-10`}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={tw`flex-row flex-wrap justify-between gap-3 mb-6`}>
      {metrics.map((item, index) => (
        <View key={index} style={tw`w-[48%] bg-white p-4 rounded-xl shadow-sm`}>
          <Icon name={item.icon} size={26} color="#888" style={tw`mb-5`} />
          <View style={tw`flex-row items-center justify-between mb-2`}>
            <Text style={tw`text-gray-700 font-medium`}>{item.title}</Text>
          </View>
          <Text style={tw`text-xl font-bold mb-1`}>{item.value}</Text>
          {item.change ? (
            <Text style={tw`${item.color} text-sm`}>{item.change}</Text>
          ) : null}
        </View>
      ))}
    </View>
  );
};

export default DashboardMetrics;
