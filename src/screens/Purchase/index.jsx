import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import SidebarLayout from '../../layout/SidebarLayout';
import { useQuery } from '@tanstack/react-query';
import usePurchase from '../../services/usePurchase';
import Button from '../../components/common/Button';
import DynamicTable from '../../components/common/DynamicTable';
import useTheme from '../../hooks/useTheme'
import Icon from 'react-native-vector-icons/Ionicons';
import CreatePurchase from './CreatePurchase';
import PurchaseOrderDetails from './PurchaseOrderDetails';
import SuccessModel from '../../components/common/SuccessModel';

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

  const purchaseData = {
    header: ['Class', 'Vendor name'],
    item: Array(6).fill({
      id: Math.random().toString(),
      data: ['abc', 'Mohan Kumar'],
    }),
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
      <ScrollView style={tw`p-4`} showsVerticalScrollIndicator={false}   contentContainerStyle={{ paddingBottom: 100 }}
  >
        <Text style={tw`text-lg font-bold mb-4`}>Purchase</Text>

        {/* Top Buttons */}
        <View style={tw`gap-2 mb-3`}>
          <Button
            fullWidth
            onPress={() => setShowCreateModal(true)}
            startIcon={<Icon name="cart-outline" size={18} color="#fff" />}
          >
            Purchase Goods
          </Button>
          <Button
            fullWidth
            startIcon={<Icon name="clipboard-outline" size={18} color="#fff" />}
          >
            Track Purchase Goods
          </Button>
          
        </View>

        {/* Alert */}
        <View style={tw`border border-red-500 bg-red-50 px-4 py-2 rounded-md mb-4 flex-row items-center`}>
          <Icon name="alert-circle-outline" size={20} color="red" style={tw`mr-2`} />
          <Text style={tw`text-red-700`}>
            Items not in Stock, need to be purchased
          </Text>
        </View>

        {/* Inventory Cards */}
        <View style={tw`space-y-3 mb-6`}>
          {['A Class', 'B Class', 'C Class'].map((label, index) => {
            const inStock = index === 0;
            return (
              <View
                key={index}
                style={tw`flex-row items-center mt-3 bg-white border rounded-xl p-4 shadow-sm`}
              >
                <Icon
                  name={index === 2 ? 'briefcase-outline' : 'cube-outline'}
                  size={24}
                  color="black"
                  style={tw`mr-3`}
                />
                <View>
                  <Text style={tw`text-lg font-bold text-black`}>{label}</Text>
                  <Text
                    style={tw`text-[15px] mt-1 ${
                      inStock ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {inStock ? '↑ in Stock' : '↓ not in Stock'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Table of Purchase Orders */}
        <Text style={tw`text-lg font-bold mb-2`}>Purchase Orders</Text>
        <DynamicTable
          header={purchaseData.header}
          tableData={purchaseData}
        />

        {/* Show Purchase Order Details below table */}
        {showOrderDetails && <PurchaseOrderDetails />}
      </ScrollView>

      {/* Modal for creating order */}
      <CreatePurchase
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreatePurchase}
      />

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
