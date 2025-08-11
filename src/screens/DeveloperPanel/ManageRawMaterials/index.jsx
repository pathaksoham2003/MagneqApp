import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
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
  const { class_type } = route.params || {};
  const { getRawMaterialsByClass, getRawMaterialFilterConfig } = useRawMaterials();
  const [filters, setFilters] = useState({ search: "", type: "", name: "" });

  useEffect(() => {
    setFilters({ search: "", type: "", name: "" });
  }, [class_type]);

  const { data: filterConfig } = useQuery({
    queryKey: ["filter_config"],
    queryFn: getRawMaterialFilterConfig,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["raw_materials", class_type, filters],
    queryFn: () =>
      getRawMaterialsByClass(class_type, {
        search: filters.search,
        type: filters.type,
        name: filters.name,
      }),
    enabled: ["A", "B", "C"].includes(class_type),
  });

  const handleAddClick = () => {
    navigation.navigate("CreateRawMaterial", { class_type });
  };

  const config = filterConfig?.[class_type] || {};

  const typeOptions = [
    { label: "All Types", value: "" },
    ...(config.types || []).map(type => ({ label: type, value: type }))
  ];

  const nameOptions = [
    { label: "All Names", value: "" },
    ...(config.names || []).map(name => ({ label: name, value: name }))
  ];

  return (
    <View style={tw`flex-1 bg-white p-4`}>
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <Text style={tw`text-xl font-bold`}>
          Manage Class {class_type} Materials
        </Text>
        <Button onClick={handleAddClick}>+ Add Raw Material</Button>
      </View>

      {/* Filters */}
      <View style={tw`space-y-4 mb-4`}>
        <Input
          placeholder="Search by name/type"
          value={filters.search}
          onChangeText={(value) => setFilters({ ...filters, search: value })}
        />

        <View style={tw`flex-row gap-4`}>
          {config.types && (
            <View style={tw`flex-1`}>
              <Select
                value={filters.type}
                onValueChange={(value) => setFilters({ ...filters, type: value })}
                options={typeOptions}
              />
            </View>
          )}

          {config.names && (
            <View style={tw`flex-1`}>
              <Select
                value={filters.name}
                onValueChange={(value) => setFilters({ ...filters, name: value })}
                options={nameOptions}
              />
            </View>
          )}
        </View>
      </View>

      {isLoading ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-gray-500`}>Loading...</Text>
        </View>
      ) : (
        <DynamicTable 
          header={data?.header || []} 
          tableData={data || { item: [] }} 
        />
      )}
    </View>
  );
};

export default ManageRawMaterials;
