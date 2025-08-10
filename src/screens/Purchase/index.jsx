import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import usePurchase from '../../services/usePurchase';
import Button from '../../components/common/Button';
import DynamicTable from '../../components/common/DynamicTable';
import useTheme from '../../hooks/useTheme';
import Icon from 'react-native-vector-icons/Ionicons';
import CreatePurchase from './CreatePurchase';
import PurchaseOrderDetails from './PurchaseOrderDetails';
import SuccessModel from '../../components/common/SuccessModel';
import SidebarLayout from '../../layout/SidebarLayout';

const Purchase = () => {
  const { tw } = useTheme();
  const { getAllPurchaseOrders } = usePurchase();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['purchase'],
    queryFn: () => getAllPurchaseOrders(),
    staleTime: 5 * 60 * 1000,
  });
  const navigation = useNavigation();

  const handleRowClick = item => {
    navigation.navigate('PurchaseDetail', { id: item.item_id });
  };
console.log(data)
  const purchaseData = {
    header: ['Vendor Name', 'Order Details', 'Status'],
    item:
      data?.item?.map(entry => ({
        id: entry.id,
        data: [
          entry.data?.[1] || 'N/A', // Vendor Name
          Array.isArray(entry.data?.[3]) ? entry.data[3].join(', ') : 'N/A', // Order Details
          entry.data?.[4] || 'N/A', // Status
        ],
      })) || [],
  };

  const handleCreatePurchase = () => {
    setShowCreateModal(false);
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      setShowOrderDetails(true);
    }, 2000);
  };

  return (
    <SidebarLayout>
      <ScrollView
        style={tw`p-4`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Text style={tw`text-lg font-bold mb-4`}>Purchase</Text>

        {/* Top Buttons */}
        <View style={tw`gap-2 mb-3`}>
          <Button
            fullWidth
            onPress={() => navigation.navigate("CreatePurchase")}
            startIcon={<Icon name="cart-outline" size={18} color="#fff" />}
          >
            Purchase Goods
          </Button>
          <Button
            fullWidth
            onPress={() => navigation.navigate("TrackVendors")}
            startIcon={<Icon name="clipboard-outline" size={18} color="#fff" />}
          >
            Track Vendor Purchases
          </Button>
        </View>


        {/* Table of Purchase Orders */}
        <Text style={tw`text-lg font-bold mb-2`}>Purchase Orders</Text>
        <DynamicTable onRowClick={handleRowClick} header={purchaseData.header} tableData={purchaseData} />

        {/* Show Purchase Order Details below table */}
        {showOrderDetails && <PurchaseOrderDetails />}
      </ScrollView>


      {/* Success Modal */}
      <SuccessModel
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Purchase Order Created Successfully"
      />
    </SidebarLayout>
  );
};

export default Purchase;
