import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import FilterBar from './FilterBar';
import useManage from '../../../services/useManage';
import useFinishedGoods from '../../../services/useFinishedGoods';
import DynamicTable from '../../../components/common/DynamicTable';
import Button from '../../../components/common/Button';
import useTheme from '../../../hooks/useTheme';

const ManageFinishedGood = () => {
  const { getFinishedGoods } = useManage();
  const { getModalConfig } = useFinishedGoods();
  const navigation = useNavigation();
  const { tw } = useTheme();
  
  const [filters, setFilters] = useState({
    model: "",
    power: "",
    ratio: "",
    type: "",
  });

  const { data: modalConfig } = useQuery({
    queryKey: ["modalConfig"],
    queryFn: getModalConfig,
  });

  // Infinite query implementation
  const fetchPage = ({ pageParam = 1 }) =>
    getFinishedGoods({
      page: pageParam,
      limit: 10,
      search: "",
      model: filters.model,
      type: filters.type,
      ratio: filters.ratio,
      power: filters.power,
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
    queryKey: ['finishedGoods', filters],
    queryFn: fetchPage,
    getNextPageParam: (lastPage, pages) => {
      const { page_no, total_pages } = lastPage;
      return page_no < total_pages ? page_no + 1 : undefined;
    },
  });

  // Refetch when filters change
  useEffect(() => {
    refetch();
  }, [filters, refetch]);

  // Flatten the paginated data
  const flatData = data?.pages.flatMap(page => page.item) || [];
  const headers = data?.pages[0]?.header || [];

  const handleEndReached = () => {

    if (hasNextPage) {
      fetchNextPage();
    }else{
      console.log("hello")
    }
  };

  const handleRowClick = (item) => {
    navigation.navigate("ViewFinishedGood", { id: item.item_id });
  };

  return (
    <View style={tw`p-4 flex-1 bg-white`}>
      <View style={tw`flex-row justify-between items-center p-2 pb-5`}>
        <Text style={tw`text-3xl font-bold`}>Finished Goods</Text>
        <Button onClick={() => navigation.navigate("CreateFinishedGood")}>
          Create FG
        </Button>
      </View>
      
      <FilterBar
        modalConfig={modalConfig || {}}
        filters={filters}
        setFilters={setFilters}
      />
      
      {isLoading ? (
        <ActivityIndicator size="large" style={tw`mt-4`} />
      ) : isError ? (
        <Text style={tw`text-center text-red-500 mt-4`}>
          Error: {error.message || 'Something went wrong'}
        </Text>
      ) : (
        <DynamicTable
          header={headers}
          tableData={{ item: flatData }}
          onRowClick={handleRowClick}
          onEndReached={handleEndReached}
          hasNextPage={hasNextPage}
        />
      )}
    </View>
  );
};

export default ManageFinishedGood;