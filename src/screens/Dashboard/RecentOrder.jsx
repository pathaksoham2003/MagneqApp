import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import useTheme from '../../hooks/useTheme';

const orders = [
  {
    id: 'SO-123',
    name: 'Mohan Kumar - Flange (102)',
    date: '22/6/2025',
    status: 'In Process',
    color: 'bg-yellow-100 text-yellow-800',
  },
  {
    id: 'SO-123',
    name: 'Ravi Sharma - Nut (250)',
    date: '22/6/2025',
    status: 'FG',
    color: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'SO-123',
    name: 'Mohan Kumar - Flange (102)',
    date: '22/6/2025',
    status: 'Dispatched',
    color: 'bg-green-100 text-green-800',
  },
];

const RecentOrder = () => {
  const { tw } = useTheme();

  return (
    <View style={tw`mb-6`}>
      <Text style={tw`text-lg font-bold mb-4`}>Recent Orders</Text>
      {orders.map((order, index) => (
        <View
          key={index}
          style={tw`bg-white p-4 rounded-xl shadow-sm mb-2`}
        >
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`font-semibold`}>{order.id}</Text>
            <Text style={tw`${order.color} px-2 py-1 rounded text-xs`}>
              {order.status}
            </Text>
          </View>
          <Text style={tw`text-sm text-gray-700 mt-1`}>{order.name}</Text>
          <Text style={tw`text-xs text-gray-500`}>{order.date}</Text>
        </View>
      ))}
      <TouchableOpacity>
        <Text style={tw`text-blue-500 mt-2 text-center`}>Load More</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RecentOrder;
