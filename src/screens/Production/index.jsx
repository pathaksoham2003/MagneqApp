import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useInfiniteQuery } from '@tanstack/react-query';
import useProduction from '../../services/useProduction';
import Button from '../../components/common/Button';
import SidebarLayout from '../../layout/SidebarLayout';
import DynamicTable from '../../components/common/DynamicTable';
import useTheme from '../../hooks/useTheme';

const Production = ({ onLogout }) => {
  const { tw } = useTheme();
  const header = ['Order ID', 'Date of Creation', 'Customer'];

  const searchQuery = '';
  const { getPendingProductions } = useProduction();
  const navigate = useNavigation();

  // useInfiniteQuery to fetch pages of data
  const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
} = useInfiniteQuery({
  queryKey: ['pendingProductions', searchQuery],
  queryFn: ({ pageParam = 1 }) => getPendingProductions(pageParam, searchQuery),
  getNextPageParam: (lastPage, pages) => {
    if (lastPage.page_no < lastPage.total_pages) {
      return lastPage.page_no + 1;
    }
    return undefined;
  },
  staleTime: 5 * 60 * 1000,
});


  // Combine all pages data into a single array
  const items = data?.pages.flatMap(page => page.item) || [];

  const tableData = {
    item: items.map(row => ({
      id: row.id,
      data: [
        row.data[0], // Order ID
        row.data[2], // Date of Creation
        row.data[1], // Customer
      ],
    })),
  };

  const handleReachEnd = () => {
    console.log("Hurrey")
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <SidebarLayout onLogout={onLogout}>
      <View style={tw`px-4 pt-2`}>
        <View style={tw`flex flex-row justify-between pb-2`}>
          <Text style={tw`text-lg font-bold mb-2`}>Production Table</Text>
          <Button
            style={tw`mb-2`}
            onClick={() => navigate.navigate('CreatePRO')}
          >
            Create Production
          </Button>
        </View>

        <DynamicTable
          header={header}
          tableData={tableData}
          onRowClick={({ item_id }) => {
            navigate.navigate('ViewProduction', { id: item_id });
          }}
          onEndReached={handleReachEnd}
          onEndReachedThreshold={0.5}
        />

        {isLoading && <Text style={tw`text-center py-4`}>Loading...</Text>}
        {isFetchingNextPage && <Text style={tw`text-center py-4`}>Loading more...</Text>}
      </View>
    </SidebarLayout>
  );
};

export default Production;
