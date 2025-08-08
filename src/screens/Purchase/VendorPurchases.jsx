import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import usePurchase from '../../services/usePurchase';
import DynamicTable from '../../components/common/DynamicTable';
import useTheme from '../../hooks/useTheme';
import SidebarLayout from '../../layout/SidebarLayout';

const VendorPurchases = () => {
  const { tw } = useTheme();
  const { getAllVendorPurchases } = usePurchase();
  const route = useRoute();
  const { id } = route.params;
  const [currentPage, setCurrentPage] = useState(1);
  console.log(route.params)
  const { data, isLoading, isError } = useQuery({
    queryKey: ['vendor-purchases', id, currentPage],
    queryFn: () => getAllVendorPurchases({ id, page: currentPage }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  const purchaseData = {
    header: ['Production ID', 'Vendor Name', 'Purchase Date', 'Order Details', 'Status'],
    item:
      data?.item?.map(entry => ({
        id: entry.id,
        data: entry.data,
      })) || [],
  };

  return (
    <SidebarLayout>
      <ScrollView style={tw`p-4`}>
        <Text style={tw`text-lg font-bold mb-4`}>Vendor Purchases</Text>
        <DynamicTable
          header={purchaseData.header}
          tableData={purchaseData}
        />
      </ScrollView>
    </SidebarLayout>
  );
};

export default VendorPurchases;
