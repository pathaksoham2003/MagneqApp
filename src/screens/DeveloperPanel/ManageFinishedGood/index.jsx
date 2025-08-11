import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
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

  const { data: finishedGoodsData } = useQuery({
    queryKey: ["finishedGoods", filters],
    queryFn: () => getFinishedGoods(filters),
  });

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
      
      <DynamicTable
        header={finishedGoodsData?.header}
        tableData={finishedGoodsData}
        onRowClick={(item) => navigation.navigate("ViewFinishedGood", { id: item.item_id })}
      />
    </View>
  );
};

export default ManageFinishedGood;
