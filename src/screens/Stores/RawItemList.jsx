import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import useTheme from '../../hooks/useTheme';
import StoreHeader from './StoreHeader';
import useRawMaterials from '../../services/useRawMaterials';
import DynamicTable from '../../components/common/DynamicTable';

const RawItemList = () => {
    const { tw } = useTheme();
  
  const [activeClass, setActiveClass] = useState('A');
  const { getRawMaterialsByClass } = useRawMaterials();

  const queryParams = {
    search: '',
    type: '',
    name: '',
  };

  const {
    data: rawMaterialData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['rawMaterials', activeClass, queryParams],
    queryFn: () => getRawMaterialsByClass(activeClass, queryParams),
  });

  useEffect(() => {
    refetch();
  }, [activeClass]);

  const tableData = rawMaterialData ?? {
    header: [],
    item: [],
    page_no: 1,
    total_pages: 1,
    total_items: 0,
  };

  const handleRowClick = (row) => {
    // Navigate or handle detail click logic here
    console.log('Row clicked:', row);
  };

  return (
    <View style={tw`px-4 py-4`}>
      {/* Tabs */}
      <StoreHeader activeClass={activeClass} onClassChange={setActiveClass} />

      {/* Table */}
      <View style={tw`mt-4`}>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : isError ? (
          <Text style={tw`text-center text-red-500`}>
            Error: {error.message || 'Something went wrong'}
          </Text>
        ) : (
          <DynamicTable
            header={tableData.header}
            tableData={tableData}
            onRowClick={handleRowClick}
          />
        )}
      </View>
    </View>
  );
};

export default RawItemList;
