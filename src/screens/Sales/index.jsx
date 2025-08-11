// screens/Sales.js
import React, { useState } from 'react';
import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import useTheme from '../../hooks/useTheme';
import SidebarLayout from '../../layout/SidebarLayout';
import SalesCard from '../../components/card/SalesCard';
import Heading from '../../components/common/Heading';
import Button from '../../components/common/Button';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import useSales from '../../services/useSales';

const Sales = ({ onLogout }) => {
    const { tw } = useTheme();
  
  const navigation = useNavigation();
  const { getAllSales } = useSales();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['sales', page, searchQuery],
    queryFn: () => getAllSales(page, searchQuery),
    staleTime: 5 * 60 * 1000,
  });
  console.log(data);



  return (
    <SidebarLayout onLogout={onLogout}>
      <View style={tw`flex p-4 flex-row justify-between`}>
        <Heading>Sales Order</Heading>
        <Button onClick={() => navigation.navigate('CreateSales')}>
          Create Sale
        </Button>
      </View>

      <ScrollView style={tw`flex-1`}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : isError ? (
          <Text style={tw`text-red-500 text-center`}>
            Failed to load sales data.
          </Text>
        ) : (
          data?.item?.map(order => (
            <SalesCard
              key={order.id}
              headers={data.header}
              values={order.data}
              status={order.data[4]}
              onPress={() => navigation.navigate('ViewSales', { id: order.id })}
            />
          ))
        )}
      </ScrollView>
    </SidebarLayout>
  );
};

export default Sales;
