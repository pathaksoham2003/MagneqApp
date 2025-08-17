import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import Button from '../../../components/common/Button';
import DynamicTable from '../../../components/common/DynamicTable';
import useRawMaterials from '../../../services/useRawMaterials';
import useTheme from '../../../hooks/useTheme';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';

const ManageRawMaterials = () => {
  const { tw } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();

  // Fail-safe default to "A" if null or undefined
  const initialClassType = route.params?.class_type || "A";

  const [classType, setClassType] = useState(initialClassType);
  const [filters, setFilters] = useState({ search: "", type: "", name: "" });

  const { getRawMaterialsByClass, getRawMaterialFilterConfig } = useRawMaterials();

  useEffect(() => {
    setFilters({ search: "", type: "", name: "" });
  }, [classType]);

  const { data: filterConfig } = useQuery({
    queryKey: ["filter_config"],
    queryFn: getRawMaterialFilterConfig,
  });

  // Infinite query implementation
  const fetchPage = ({ pageParam = 1 }) =>
    getRawMaterialsByClass(classType, {
      page: pageParam,
      limit: 10,
      search: filters.search,
      type: filters.type,
      name: filters.name,
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
    queryKey: ["raw_materials", classType, filters],
    queryFn: fetchPage,
    getNextPageParam: (lastPage, pages) => {
      const { page_no, total_pages } = lastPage;
      return page_no < total_pages ? page_no + 1 : undefined;
    },
    enabled: ["A", "B", "C"].includes(classType),
  });

  // Refetch when classType or filters change
  useEffect(() => {
    refetch();
  }, [classType, filters, refetch]);

  // Flatten the paginated data
  const flatData = data?.pages.flatMap(page => page.item) || [];
  const headers = data?.pages[0]?.header || [];

  const handleEndReached = () => {
    if (hasNextPage) {
      fetchNextPage();
    }else {
      console.log("hello")
    }
  };

  const handleAddClick = () => {
    navigation.navigate("CreateRawMaterial", { class_type: classType });
  };

  const config = filterConfig?.[classType] || {};

  const typeOptions = [
    { label: "All Types", value: "" },
    ...(config.types || []).map(type => ({ label: type, value: type }))
  ];

  const nameOptions = [
    { label: "All Names", value: "" },
    ...(config.names || []).map(name => ({ label: name, value: name }))
  ];

  const classOptions = [
    { label: "Class A", value: "A" },
    { label: "Class B", value: "B" },
    { label: "Class C", value: "C" }
  ];

  return (
    <View style={tw`flex-1 bg-white p-4`}>
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <Text style={tw`text-xl font-bold`}>
          Manage Class {classType} Materials
        </Text>
        <Button onClick={handleAddClick}>+ Add Raw Material</Button>
      </View>
      
      <View style={tw`space-y-4 mb-4`}>
        <View style={tw`mb-4`}>
          <Input
            placeholder="Search by name/type"
            value={filters.search}
            onChangeText={(value) => setFilters({ ...filters, search: value })}
          />
        </View>

        <View style={tw`mb-4`}>
          <Select
            value={classType}
            onValueChange={(value) => setClassType(value)}
            items={classOptions}
          />
        </View>

        <View style={tw`flex-row gap-4`}>
          {config.types && (
            <View style={tw`flex-1`}>
              <Select
                value={filters.type}
                onValueChange={(value) => setFilters({ ...filters, type: value })}
                items={typeOptions}
              />
            </View>
          )}

          {config.names && (
            <View style={tw`flex-1`}>
              <Select
                value={filters.name}
                onValueChange={(value) => setFilters({ ...filters, name: value })}
                items={nameOptions}
              />
            </View>
          )}
        </View>
      </View>

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
          onEndReached={handleEndReached}
          hasNextPage={hasNextPage}
        />
      )}
    </View>
  );
};

export default ManageRawMaterials;