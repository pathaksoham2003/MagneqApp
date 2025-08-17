import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import usePurchase from '../../services/usePurchase';
import useTheme from '../../hooks/useTheme';
import DynamicTable from '../../components/common/DynamicTable';
import SidebarLayout from '../../layout/SidebarLayout';

const TrackVendors = () => {
  const { tw } = useTheme();
  const { getAllVendors } = usePurchase();
  const navigation = useNavigation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => getAllVendors(),
    staleTime: 5 * 60 * 1000,
  });

  const handleRowClick = (item) => {
    console.log(item)
    navigation.navigate('VendorPurchases', { id: item.item_id });
  };
  console.log("fhjf",data);
  const vendorData = {
    header: ['Vendor Name'],
    item:
      data?.item?.map(vendor => ({
        id: vendor.id, 
        data: [vendor.data[0]],
      })) || [],
  };

  return (
    <SidebarLayout>
      <ScrollView style={tw`p-4`}>
        <Text style={tw`text-lg font-bold mb-4`}>All Vendors</Text>
        <DynamicTable
          onRowClick={handleRowClick}
          header={vendorData.header}
          tableData={vendorData}
        />
      </ScrollView>
    </SidebarLayout>
  );
};

export default TrackVendors;
