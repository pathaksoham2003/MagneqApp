import React, { useState } from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useProduction from '../../services/useProduction';
import Button from '../../components/common/Button';
import SidebarLayout from '../../layout/SidebarLayout';
import DynamicTable from '../../components/common/DynamicTable';

const Production = ({ onLogout }) => {
  const header = ['Order ID', 'Date of Creation', 'Customer'];

  const [page, setPage] = useState(1);
  const { searchQuery } = useState('');
  const { getPendingProductions } = useProduction();
  const navigate = useNavigation();
  const queryClient = useQueryClient();

  const {
    data: productionData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['pendingProductions', page, searchQuery],
    queryFn: () => getPendingProductions(page, searchQuery),
    staleTime: 5 * 60 * 1000,
  });

  // Safely map only required columns: Order ID, Date of Creation, Customer
  const tableData = {
    item: (productionData?.item || []).map(row => ({
      id: row.id,
      data: [
        row.data[0], // Order ID
        row.data[2], // Date of Creation
        row.data[1], // Customer
      ],
    })),
  };

  return (
    <SidebarLayout onLogout={onLogout}>
      <View style={tw`px-4 pt-2`}>
        {/* Success Message Card */}
        <View
          style={tw`bg-green-100 border border-green-300 px-4 py-3 rounded-xl mb-4`}
        >
          <Text style={tw`text-green-800 font-semibold`}>
            ✅ 2 orders created today
          </Text>
          <Text style={tw`text-gray-700`}>moved in production</Text>
        </View>

        {/* Table */}
        <Text style={tw`text-lg font-bold mb-2`}>Production Table</Text>
        <DynamicTable
          header={header}
          tableData={tableData}
          onRowClick={({item_id}) => {
            navigate.navigate('ViewProduction', { id: item_id });
          }}
        />
      </View>
    </SidebarLayout>
  );
};

export default Production;
