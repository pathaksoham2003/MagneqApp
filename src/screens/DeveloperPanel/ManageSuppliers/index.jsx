import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import useManage from '../../../services/useManage';
import Button from '../../../components/common/Button';
import useTheme from '../../../hooks/useTheme';

const ManageSuppliers = () => {
  const { tw } = useTheme();
  const { getUsersByRole } = useManage();
  const [search, setSearch] = useState('');
  const limit = 10;
  const navigation = useNavigation();

  // Infinite Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['SUPPLIER', search],
    queryFn: ({ pageParam = 1 }) =>
      getUsersByRole({ role: 'SUPPLIER', search, page: pageParam, limit }),
    getNextPageParam: lastPage => {
      if (lastPage.page_no < lastPage.total_pages) {
        return lastPage.page_no + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  // Flatten all pages
  const allSuppliers =
    data?.pages.flatMap(page =>
      page.item.map((user, idx) => ({
        id: user.id?.toString() ?? idx.toString(),
        data: [user.name || '—', user.phone || '—', user.created_at || '—'],
      })),
    ) || [];

  const renderItem = ({ item }) => (
    <View style={tw`flex-row border-b border-gray-300 py-2`}>
      {item.data.map((cell, i) => (
        <Text key={i} style={tw`flex-1 px-2 text-left`}>
          {cell}
        </Text>
      ))}
    </View>
  );

  return (
    <View style={tw`flex-1 p-4`}>
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <TextInput
          placeholder="Search users by name or phone"
          value={search}
          onChangeText={text => setSearch(text)}
          style={tw`border border-gray-400 rounded px-3 py-2 flex-1 mr-3`}
        />

        <Button onPress={() => navigation.navigate('ManageSuppliersCreate')}>
          Create Supplier
        </Button>
      </View>

      <Text style={tw`text-xl font-semibold mb-3`}>Suppliers</Text>

      {isLoading && <ActivityIndicator size="small" color="#000" />}
      {isError && (
        <Text style={tw`text-red-600 mb-3`}>Failed to load suppliers.</Text>
      )}

      {data && (
        <>
          {/* Table Header */}
          <View style={tw`flex-row border-b-2 border-black py-2`}>
            {data.pages[0].header.map((head, i) => (
              <Text key={i} style={tw`flex-1 font-bold px-2`}>
                {head}
              </Text>
            ))}
          </View>

          {/* Table Rows with infinite scroll */}
          <FlatList
            data={allSuppliers}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }else{
                console.log("No more pages")
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingNextPage ? (
                <ActivityIndicator size="small" color="#000" style={tw`mt-2`} />
              ) : null
            }
          />
        </>
      )}
    </View>
  );
};

export default ManageSuppliers;
