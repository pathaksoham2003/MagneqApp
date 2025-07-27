import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import usePurchase from '../../services/usePurchase';
import DynamicTable from '../../components/common/DynamicTable';
import useTheme from '../../hooks/useTheme';
import SidebarLayout from '../../layout/SidebarLayout';

const headers = [
  'Production Id',
  'Vendor Name',
  'Date of purchase',
  'Order Details',
  'Status',
];

const Purchase = () => {
  const { tw } = useTheme();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { getAllPurchaseOrders } = usePurchase();
  const navigation = useNavigation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['Purchases', page, search],
    queryFn: () => getAllPurchaseOrders(page, search),
    staleTime: 5 * 60 * 1000,
  });

  const handleRowClick = item => {
    navigation.navigate('PurchaseDetail', { id: item.item_id });
  };

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" />
        <Text style={tw`text-center mt-2`}>Loading purchase data...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-red-500`}>Error loading purchase data.</Text>
      </View>
    );
  }

  const tableData = {
    item: data?.item || [],
  };

  return (
    <SidebarLayout>
      <View style={tw`flex-1 px-4 py-2`}>
        <Text style={tw`text-2xl font-bold mt-4 mb-3`}>Purchase Orders</Text>
        <DynamicTable
          header={headers}
          tableData={tableData}
          onRowClick={handleRowClick}
        />
      </View>
    </SidebarLayout>
  );
};

export default Purchase;
