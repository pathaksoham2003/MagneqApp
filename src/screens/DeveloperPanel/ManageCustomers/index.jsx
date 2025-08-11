import React, { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import DynamicTable from '../../../components/common/DynamicTable';
import useTheme from '../../../hooks/useTheme';
import useManage from '../../../services/useManage';
import { useNavigation } from '@react-navigation/native';
import Button from '../../../components/common/Button';

const ManageCustomers = () => {
  const { tw } = useTheme();
  const navigation = useNavigation();
  const { getAllCustomers } = useManage();
  const [search, setSearch] = useState('');
  const limit = 10;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['CUSTOMER', search],
    queryFn: ({ pageParam = 1 }) =>
      getAllCustomers({ page: pageParam, limit, search }),
    getNextPageParam: lastPage => {
      if (lastPage?.current_page < lastPage?.total_pages) {
        return lastPage.current_page + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  const allItems =
    data?.pages.flatMap(page =>
      page.item.map((user, idx) => ({
        id: user.id || `${page.current_page}-${idx}`,
        data: [user.data[0] || '—', user.data[1] || '—', user.data[2] || '—'],
      })),
    ) || [];

  const header = data?.pages?.[0]?.header || [];

  return (
    <View style={tw`flex-1 p-4`}>
      {/* Search + Create */}
      <View style={tw`flex-row justify-between mb-4`}>
        <TextInput
          style={tw`border border-gray-300 rounded-lg px-3 py-2 flex-1 mr-2`}
          placeholder="Search users by name, role or username"
          value={search}
          onChangeText={text => {
            setSearch(text);
            refetch();
          }}
        />
        <Button onPress={() => navigation.navigate('CreateCustomer')}>
          Create
        </Button>
      </View>

      <Text style={tw`text-lg font-semibold mb-2`}>Customers</Text>

      {isLoading && <ActivityIndicator size="large" />}
      {isError && (
        <Text style={tw`text-red-500`}>Failed to load customers.</Text>
      )}

      {!isLoading && !isError && (
        <DynamicTable
          header={header}
          tableData={{ item: allItems }}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
        />
      )}

      {isFetchingNextPage && (
        <ActivityIndicator size="small" style={tw`mt-2`} />
      )}
    </View>
  );
};

export default ManageCustomers;
