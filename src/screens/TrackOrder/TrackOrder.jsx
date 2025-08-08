import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useTheme from '../../hooks/useTheme';
import useSales from '../../services/useSales';
import SidebarLayout from '../../layout/SidebarLayout';

const TrackOrder = () => {
  const { tw } = useTheme();
  const { getAllSales } = useSales();

  const [searchQuery, setSearchQuery] = useState('');
  const [orderData, setOrderData] = useState({ header: [], item: [] });
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllSales(1, searchQuery);
      setOrderData({
        header: response?.header || [],
        item: response?.item || [],
      });
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [searchQuery]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'UN_APPROVED':
        return tw`bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400`;
      case 'INPROCESS':
        return tw`bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400`;
      case 'PROCESSED':
      case 'DELIVERED':
        return tw`bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400`;
      case 'DISPATCHED':
        return tw`bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400`;
      case 'CANCELLED':
        return tw`bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-300`;
      default:
        return tw`bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400`;
    }
  };

  const formatCell = (cell, index) => {
    if (index === 1 && typeof cell === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(cell)) {
      return new Date(cell).toLocaleDateString();
    }

    if (Array.isArray(cell)) {
      return cell.join(' | ');
    }

    return cell ?? '—';
  };

  return (
    <SidebarLayout>
    <ScrollView style={tw`flex-1 bg-white dark:bg-black px-4 py-6 mt-8`}>
      <Text style={tw`text-2xl font-bold text-gray-800 dark:text-white mb-4`}>
        Track Order
      </Text>

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

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" style={tw`mt-6`} />
      ) : (
        <View style={tw`border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden`}>
          <ScrollView horizontal showsHorizontalScrollIndicator>
            <View style={tw`min-w-[700px]`}>
              {/* Table Header */}
              <View style={tw`flex-row px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700`}>
                {orderData.header.map((col, idx) => (
                  <View key={idx} style={tw`min-w-[140px]`}>
                    <Text style={tw`font-semibold text-gray-600 dark:text-gray-300`}>
                      {col}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Table Rows */}
              {orderData.item.map((row, index) => (
                <TouchableOpacity
                  key={row.id || index}
                  style={tw`flex-row px-4 py-3 border-t border-gray-100 dark:border-gray-800`}
                  activeOpacity={0.8}
                  onPress={() => {}}
                >
                  {row.data.map((cell, cellIdx) => (
                    <View key={cellIdx} style={tw`min-w-[140px]`}>
                      <Text style={tw`text-gray-800 dark:text-white`}>
                        {cellIdx === 4 ? (
                          <Text
                            style={[tw`px-2 py-1 rounded-full text-center text-xs`, getStatusStyle(cell)]}
                          >
                            {cell?.replace(/_/g, ' ') ?? '—'}
                          </Text>
                        ) : (
                          formatCell(cell, cellIdx)
                        )}
                      </Text>
                    </View>
                  ))}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </ScrollView>
    </SidebarLayout>
  );
};

export default TrackOrder;
