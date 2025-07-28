import React from 'react';
import { View, ActivityIndicator, ScrollView,Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import SidebarLayout from '../../layout/SidebarLayout';
import Heading from '../../components/common/Heading';
import SubHeading from '../../components/common/SubHeading';

import useTheme from '../../hooks/useTheme';
import usePurchase from '../../services/usePurchase';
import LabelValueGrid from '../../components/common/LabelValueGrid';

const PurchaseDetail = () => {
  const route = useRoute();
  const { tw } = useTheme();
  const { id: purchaseId } = route.params;
  const { getPurchaseById } = usePurchase();

  const {
    isLoading,
    data: purchase,
    error,
  } = useQuery({
    queryKey: ['purchaseId', purchaseId],
    queryFn: () => getPurchaseById(purchaseId),
  });

  if (isLoading) {
    return (
      <SidebarLayout>
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" />
        </View>
      </SidebarLayout>
    );
  }

  if (error || !purchase) {
    return (
      <SidebarLayout>
        <View style={tw`p-4`}>
          <Text style={tw`text-red-500 text-center`}>
            Failed to fetch purchase details.
          </Text>
        </View>
      </SidebarLayout>
    );
  }

  // Format purchase data for LabelValueGrid
  const purchaseDetails = [
    {
      'PO Number': purchase.po_number || '-',
      'Vendor Name': purchase.vendor_name || '-',
      'Purchase Date': new Date(purchase.purchasing_date).toLocaleDateString(),
      'Status': purchase.status || '-',
      'Total Price': `₹ ${Number(purchase.total_price?.$numberDecimal || 0).toFixed(2)}`,
      'Created At': new Date(purchase.created_at).toLocaleString(),
    }
  ];

  const purchaseDetailHeaders = [
    'PO Number',
    'Vendor Name',
    'Purchase Date',
    'Status',
    'Total Price',
    'Created At'
  ];

  // Format items data for LabelValueGrid
  const formattedItems = (purchase.items || []).map(item => ({
    'Class': item.class || '-',
    'Name': item.name || '-',
    'Type': item.type || '-',
    'Quantity': item.quantity || '-',
    'Price/Unit': `₹ ${Number(item.price_per_unit?.$numberDecimal || 0).toFixed(2)}`,
    'Subtotal': `₹ ${Number(
      (item.quantity || 0) * (item.price_per_unit?.$numberDecimal || 0)
    ).toFixed(2)}`
  }));

  const itemHeaders = ['Class', 'Name', 'Type', 'Quantity', 'Price/Unit', 'Subtotal'];

  return (
    <SidebarLayout>
      <ScrollView style={tw`p-4`} contentContainerStyle={tw`pb-6`}>
        <Heading>Purchase Order Details</Heading>

        <LabelValueGrid
          header={purchaseDetailHeaders} 
          items={purchaseDetails} 
        />

        <SubHeading title="Raw Material Items" />

        {(purchase.items || []).length === 0 ? (
          <View style={tw`border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800`}>
            <Text style={tw`text-gray-600 dark:text-gray-400 text-center`}>
              No items found in this PO.
            </Text>
          </View>
        ) : (
          <LabelValueGrid 
            header={itemHeaders} 
            items={formattedItems} 
          />
        )}
      </ScrollView>
    </SidebarLayout>
  );
};

export default PurchaseDetail;