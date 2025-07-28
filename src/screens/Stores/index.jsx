import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  FlatList,
} from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import useTheme from '../../hooks/useTheme';
import StoreHeader from './StoreHeader';
import useRawMaterials from '../../services/useRawMaterials';
import DynamicTable from '../../components/common/DynamicTable';
import SidebarLayout from '../../layout/SidebarLayout';
import { useNavigation } from '@react-navigation/native';
import { themeText } from '../../utils/helper';
import Button from '../../components/common/Button';

const filterTableData = (headers, rows, keysToShow) => {
  // Find indexes of columns we want to keep
  const lowerHeaders = headers.map(h => h.toLowerCase());
  const indexesToKeep = keysToShow
    .map(key => lowerHeaders.indexOf(key))
    .filter(i => i >= 0);

  // Filter headers by these indexes
  const filteredHeaders = indexesToKeep.map(i => headers[i]);

  // Filter each row's data array by indexesToKeep
  const filteredRows = rows.map(row => {
    const filteredData = indexesToKeep.map(i => row.data[i]);
    return { ...row, data: filteredData };
  });

  return { filteredHeaders, filteredRows };
};

const Stores = () => {
  const navigation = useNavigation();
  const { tw } = useTheme();

  const [activeClass, setActiveClass] = useState('A');
  const [search, setSearch] = useState('');

  const { getRawMaterialsByClass } = useRawMaterials();

  const fetchPage = ({ pageParam = 1 }) =>
    getRawMaterialsByClass(activeClass, {
      page: pageParam,
      limit: 10,
      search,
      type: '',
      name: '',
    }).then(res => res);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['rawMaterials', activeClass, search],
    queryFn: fetchPage,
    getNextPageParam: (lastPage, pages) => {
      const { page_no, total_pages } = lastPage;
      return page_no < total_pages ? page_no + 1 : undefined;
    },
  });

  console.log(data);

  useEffect(() => {
    refetch();
  }, [activeClass, search]);

  const flatData = data?.pages.flatMap(page => page.item) || [];
  const headers = data?.pages[0]?.header || [];

  const handleRowClick = row => {
    // Assuming row has item_id and class_type (or activeClass)
    navigation.navigate('RawMaterialDetail', {
      class_type: activeClass, // pass current class
      id: row.item_id,
    });
  };
  const handleEndReached = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <SidebarLayout>
      <View style={tw`px-4 py-4`}>
        <View>
          <Button fullWidth onClick={()=>navigation.navigate("AddStock")}>Add to Stock</Button>
        </View>
        <StoreHeader activeClass={activeClass} onClassChange={setActiveClass} />

        <TextInput
          style={tw`border rounded-md p-2 ${themeText}`}
          placeholder="Search raw materials..."
          value={search}
          onChangeText={setSearch}
        />

        <View style={tw`mt-4`}>
          {isLoading ? (
            <ActivityIndicator size="large" />
          ) : isError ? (
            <Text style={tw`text-center text-red-500`}>
              Error: {error.message || 'Something went wrong'}
            </Text>
          ) : (
            (() => {
              const keysToShow = ['product name', 'type', 'quantity'];
              const lowerHeaders = headers.map(h => h.toLowerCase());
              const indexesToKeep = keysToShow
                .map(key => lowerHeaders.indexOf(key))
                .filter(i => i >= 0);

              const filteredHeaders = indexesToKeep.map(i => headers[i]);
              const filteredRows = flatData.map(row => {
                const filteredData = indexesToKeep.map(i => {
                  let cell = row.data[i];
                  if (
                    headers[i].toLowerCase() === 'quantity' &&
                    cell !== null && !cell.includes("unprocessed")
                  ) {
                    return cell.replace("processed: ","");
                  }
                  return cell;
                });
                return { ...row, data: filteredData };
              });

              return (
                <DynamicTable
                  header={filteredHeaders}
                  tableData={{ item: filteredRows }}
                  onRowClick={handleRowClick}
                  onEndReached={handleEndReached}
                  hasNextPage={hasNextPage}
                />
              );
            })()
          )}
        </View>
      </View>
    </SidebarLayout>
  );
};

export default Stores;
