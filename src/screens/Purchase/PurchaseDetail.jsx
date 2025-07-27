import { View, Text } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';
import SidebarLayout from '../../layout/SidebarLayout';

const PurchaseDetail = () => {
  const route = useRoute();
  const { id: purchaseId } = route.params;
  console.log(purchaseId)
  return (
    <SidebarLayout>
      <View>
        <Text>PurchaseDetail {purchaseId}</Text>
      </View>
    </SidebarLayout>
  );
};

export default PurchaseDetail;
