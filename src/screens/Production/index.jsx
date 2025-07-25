import React, { useState } from "react";
import { View, Text } from "react-native";
import { tw } from "../../App";
import SidebarLayout from "../../layout/SidebarLayout";
import useProduction from "../../services/useProduction";
import { useQuery } from "@tanstack/react-query";

const Production = ({ onLogout }) => {

  const { getPendingProductions } = useProduction();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const {data, isLoading, isError, refetch} = useQuery({
    queryKey: ["pendingProductions", page, search],
    queryFn: () => getPendingProductions(page, search),
    staleTime: 5 * 60 * 1000,
  });


  console.log("Data",data);


  return (
    <SidebarLayout title="Production" onLogout={onLogout}>
      <View style={tw`flex-1 items-center justify-center`}>
        <Text style={tw`text-2xl font-bold`}>Production Screen</Text>
      </View>
    </SidebarLayout>
  );
};

export default Production;
