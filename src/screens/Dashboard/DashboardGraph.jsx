
import React, { useState, useMemo } from 'react';
import { View, Text, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/Ionicons';
import useTheme from '../../hooks/useTheme';
import useAxios from '../../hooks/useAxios';
import { APIS } from '../../api/apiUrls';
import { useQuery } from '@tanstack/react-query';

const chartTabs = ['Overview', 'Sales', 'Revenue'];

const DashboardGraph = () => {
  const { tw } = useTheme();
  const api = useAxios();
  const [activeTab, setActiveTab] = useState('Overview');

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard/statistics'],
    queryFn: () => api.get(`${APIS.dashboard}/statistics`),
    staleTime: 5 * 60 * 1000,
  });

  const selectedData = useMemo(() => {
    if (!data) return { datasets: [] };

    const sales = data.sales ?? [];
    const revenue = data.revenue?.map(Number) ?? [];
    const months = data.months ?? [];

    if (activeTab === 'Sales') {
      return {
        labels: months,
        datasets: [
          {
            data: sales,
            color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, // green-500
            strokeWidth: 2,
          },
        ],
      };
    } else if (activeTab === 'Revenue') {
      return {
        labels: months,
        datasets: [
          {
            data: revenue,
            color: (opacity = 1) => `rgba(249, 115, 22, ${opacity})`, // orange-500
            strokeWidth: 2,
          },
        ],
      };
    } else {
      return {
        labels: months,
        datasets: [
          {
            data: sales,
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // blue-500
            strokeWidth: 2,
          },
          {
            data: revenue,
            color: (opacity = 1) => `rgba(147, 197, 253, ${opacity})`, // blue-300
            strokeWidth: 2,
          },
        ],
      };
    }
  }, [activeTab, data]);

  return (
    <View style={tw`mb-10`}>
      <Text style={tw`text-lg font-bold mb-1`}>Statistics</Text>
      <Text style={tw`text-gray-500 mb-3`}>Target you’ve set for each month</Text>
      {/* Tabs */}
      <View style={tw`flex-row mb-3`}>
        {chartTabs.map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={tw`px-4 py-2 rounded-t-md mr-2 ${activeTab === tab ? 'bg-white shadow-sm' : 'bg-gray-100'}`}
          >
            <Text style={tw`${activeTab === tab ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart */}
      <View style={tw`bg-white p-4 rounded-xl shadow-sm`}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#2563eb" />
        ) : (
          <LineChart
            data={selectedData}
            width={Dimensions.get('window').width - 40}
            height={260}
            withDots={false}
            withInnerLines={true}
            withOuterLines={true}
            withShadow={true}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
              labelColor: () => '#6b7280',
              propsForBackgroundLines: {
                stroke: '#e5e7eb',
                strokeWidth: 1,
              },
              propsForLabels: {
                fontSize: 12,
              },
            }}
            bezier
            style={tw`rounded-lg`}
          />
        )}
      </View>
    </View>
  );
};

export default DashboardGraph;
