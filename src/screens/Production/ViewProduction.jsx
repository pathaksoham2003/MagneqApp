import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import SidebarLayout from '../../layout/SidebarLayout';
import { tw } from '../../App';
import SalesCard from '../../components/card/SalesCard';
import DynamicTable from '../../components/common/DynamicTable';
import useProduction from '../../services/useProduction';
import ProductionCard from '../../components/card/ProductionCard';

const ViewProduction = () => {
  const route = useRoute();
  const { id: productionId } = route.params;
  const { getProductionById } = useProduction();

  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ['productionId', productionId],
    queryFn: () => getProductionById(productionId),
  });

  const [selectedTab, setSelectedTab] = useState('A');

  console.log(data);
  if (isLoading) {
    return (
      <SidebarLayout>
        <Text style={tw`text-center p-4`}>Loading...</Text>
      </SidebarLayout>
    );
  }

  if (isError || !data) {
    return (
      <SidebarLayout>
        <Text style={tw`text-center p-4 text-red-500`}>
          Error loading production data
        </Text>
      </SidebarLayout>
    );
  }

  // Header-level data
  const headerLabels = ['Order ID', 'Model', 'Quantity', 'Created At'];
  const headerValues = [
    data.order_id,
    `${data.finished_good.model} | ${data.finished_good.type}`,
    data.quantity,
    data.created_at,
  ];

  // Dynamic class table logic
  const classDataMap = {
    A: data.class_a,
    B: data.class_b,
    C: data.class_c,
  };

  const activeClassData = classDataMap[selectedTab] || [];

  const tableData = {
    item: activeClassData.map(item => ({
      id: item._id,
      data: [
        item.name,
        `${item.required}/${item.available}`,
        item.in_stock ? 'In Stock' : 'Not in Stock',
      ],
    })),
  };

  const tableHeader = ['Name | Type', 'Required/Available', 'Stock'];

  return (
    <SidebarLayout>
      <ScrollView style={tw`p-4`}>
        <ProductionCard
          headers={headerLabels}
          values={headerValues}
          status={data.status}
          productionId={productionId}
          classDataMap={classDataMap}
          refetch={refetch}
        />

        {/* Tab Bar */}
        <View style={tw`flex-row mt-4 mb-2`}>
          {['A', 'B', 'C'].map(cls => (
            <TouchableOpacity
              key={cls}
              style={tw`flex-1 p-2 border-b-2 ${
                selectedTab === cls ? 'border-blue-500' : 'border-transparent'
              }`}
              onPress={() => setSelectedTab(cls)}
            >
              <Text
                style={tw`text-center ${
                  selectedTab === cls
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-600'
                }`}
              >
                Class {cls}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Table */}
        <DynamicTable header={tableHeader} tableData={tableData} />
      </ScrollView>
    </SidebarLayout>
  );
};

export default ViewProduction;
