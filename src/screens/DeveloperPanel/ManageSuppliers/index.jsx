import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import useManage from '../../../services/useManage';
import Button from '../../../components/common/Button';
import useTheme from '../../../hooks/useTheme';

const ManageSuppliers = () => {
  const { tw } = useTheme();
  const { getUsersByRole } = useManage();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const navigation = useNavigation();

  const {
    data: usersQuery,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['SUPPLIER', search, currentPage],
    queryFn: () =>
      getUsersByRole({ role: 'SUPPLIER', search, page: currentPage, limit }),
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  const transformedData = usersQuery?.item?.map((user, idx) => ({
    id: idx.toString(),
    data: [user.name || '—', user.phone || '—', user.created_at || '—'],
  }));

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
          onChangeText={text => {
            setSearch(text);
            setCurrentPage(1);
          }}
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

      {usersQuery && (
        <>
          {/* Table header */}
          <View style={tw`flex-row border-b-2 border-black py-2`}>
            {usersQuery.header.map((head, i) => (
              <Text key={i} style={tw`flex-1 font-bold px-2`}>
                {head}
              </Text>
            ))}
          </View>

          {/* Table rows */}
          <FlatList
            data={transformedData}
            keyExtractor={item => item.id}
            renderItem={renderItem}
          />
        </>
      )}
    </View>
  );
};

export default ManageSuppliers;
