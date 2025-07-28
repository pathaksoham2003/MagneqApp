import React from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import SidebarLayout from '../../layout/SidebarLayout';
import Heading from '../../components/common/Heading';
import SubHeading from '../../components/common/SubHeading';
import useTheme from '../../hooks/useTheme';
import usePurchase from '../../services/usePurchase';

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

  console.log(purchase)

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

  const renderRow = (label, value) => (
    <View style={tw`mb-3`}>
      <Text style={tw`text-gray-500 text-sm`}>{label}</Text>
      <Text style={tw`text-gray-900 dark:text-gray-100 text-base`}>
        {value}
      </Text>
    </View>
  );

  return (
    <SidebarLayout>
      <ScrollView style={tw`p-4`}>
        <Heading>Purchase Order Details</Heading>

        {renderRow('PO Number', purchase.po_number || '-')}
        {renderRow('Vendor Name', purchase.vendor_name || '-')}
        {renderRow(
          'Purchase Date',
          new Date(purchase.purchasing_date).toLocaleDateString(),
        )}
        {renderRow('Status', purchase.status || '-')}
        {renderRow(
          'Total Price',
          `₹ ${Number(purchase.total_price?.$numberDecimal || 0).toFixed(2)}`,
        )}
        {renderRow(
          'Created At',
          new Date(purchase.created_at).toLocaleString(),
        )}

        <SubHeading title="Raw Material Items" />

        {(purchase.items || []).length === 0 ? (
          <Text style={tw`text-gray-600`}>No items found in this PO.</Text>
        ) : (
          (purchase.items || []).map((item, idx) => (
            <View
              key={`item-${idx}`}
              style={tw`border border-gray-300 rounded-lg p-3 mb-3 bg-white dark:bg-gray-800`}
            >
              {renderRow('Class', item.class || '-')}
              {renderRow('Name', item.name || '-')}
              {renderRow('Type', item.type || '-')}
              {renderRow('Quantity', item.quantity || '-')}
              {renderRow(
                'Price/Unit',
                `₹ ${Number(item.price_per_unit?.$numberDecimal || 0).toFixed(
                  2,
                )}`,
              )}
              {renderRow(
                'Subtotal',
                `₹ ${Number(
                  (item.quantity || 0) *
                    (item.price_per_unit?.$numberDecimal || 0),
                ).toFixed(2)}`,
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SidebarLayout>
  );
};

export default PurchaseDetail;
