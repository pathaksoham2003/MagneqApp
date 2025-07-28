import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useTheme from '../../hooks/useTheme';

const orderData = [
  {
    id: 'SO-123',
    date: '22/6/2025',
    customer: 'Mohan Kumar',
    model: '102',
    type: 'Flange',
    ratio: '18',
    qty: '1',
    status: 'Delivered',
  },
];

const TrackOrder = () => {
  const { tw } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = orderData.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={tw`flex-1 bg-white dark:bg-black px-4 py-6 mt-8`}>
      {/* Title */}
      <Text style={tw`text-2xl font-bold text-gray-800 dark:text-white mb-4`}>
        Track Order
      </Text>

      {/* Search Bar with Icon */}
      <View style={tw`flex-row items-center border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 mb-4`}>
        <Ionicons name="search-outline" size={20} color="#9CA3AF" />
        <TextInput
          placeholder="Search using Order ID"
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={tw`ml-2 flex-1 text-gray-800 dark:text-white`}
        />
      </View>

      {/* Bordered Container with horizontal ScrollView */}
      <View style={tw`border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden`}>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={tw`min-w-[950px]`}>

            {/* Header Row */}
            <View style={tw`flex-row border-b border-gray-200 dark:border-gray-700 px-4 py-3 bg-gray-100 dark:bg-gray-800`}>
              {['Order ID', 'Date of Creation', 'Customer Name', 'Model', 'Type', 'Ratio', 'Qty', 'Status'].map((header, index) => (
                <View key={index} style={tw`min-w-[120px]`}>
                  <Text style={tw`font-semibold text-gray-600 dark:text-gray-300`}>
                    {header}
                  </Text>
                </View>
              ))}
            </View>

            {/* Data Rows */}
            {filteredData.map((order, index) => (
              <View key={index} style={tw`flex-row px-4 py-3 border-t border-gray-100 dark:border-gray-800`}>
                <View style={tw`min-w-[120px]`}><Text style={tw`text-gray-800 dark:text-white`}>{order.id}</Text></View>
                <View style={tw`min-w-[120px]`}><Text style={tw`text-gray-800 dark:text-white`}>{order.date}</Text></View>
                <View style={tw`min-w-[120px]`}><Text style={tw`text-gray-800 dark:text-white`}>{order.customer}</Text></View>
                <View style={tw`min-w-[120px]`}><Text style={tw`text-gray-800 dark:text-white`}>{order.model}</Text></View>
                <View style={tw`min-w-[120px]`}><Text style={tw`text-gray-800 dark:text-white`}>{order.type}</Text></View>
                <View style={tw`min-w-[120px]`}><Text style={tw`text-gray-800 dark:text-white`}>{order.ratio}</Text></View>
                <View style={tw`min-w-[120px]`}><Text style={tw`font-bold text-gray-800 dark:text-white`}>{order.qty}</Text></View>
                <View style={tw`min-w-[120px]`}>
                  <Text style={tw`text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400 px-2 py-1 rounded-full text-center`}>
                    {order.status}
                  </Text>
                </View>
              </View>
            ))}

          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default TrackOrder;
