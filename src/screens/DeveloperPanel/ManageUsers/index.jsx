import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import useManage from "../../../services/useManage";
import Button from "../../../components/common/Button";

const ManageUsers = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const navigation = useNavigation();
  const { getUsersByRole } = useManage();

  const {
    data: usersQuery,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["users", "OTHERS", currentPage, limit, search],
    queryFn: () =>
      getUsersByRole({ role: "OTHERS", page: currentPage, limit, search }),
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  const transformedData = usersQuery?.item?.map((user, idx) => ({
    id: user.user_name ?? idx.toString(),
    data: [
      user.name || "—",
      user.user_name || "—",
      user.role || "—",
      user.created_at || "—",
    ],
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
    <View style={tw`flex-1 p-4 space-y-6`}>
      <View style={tw`flex-row justify-between items-center`}>
        <TextInput
          placeholder="Search users by name, role or username"
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            setCurrentPage(1);
          }}
          style={tw`border border-gray-400 rounded px-3 py-2 flex-1 mr-3`}
        />

        <Button onPress={() => navigation.navigate("ManageUsersCreate")}>
          Create User
        </Button>
      </View>

      <Text style={tw`text-xl font-semibold mt-4 mb-3`}>Users</Text>

      {isLoading && <ActivityIndicator size="small" color="#000" />}
      {isError && (
        <Text style={tw`text-red-600 mb-3`}>Failed to load users.</Text>
      )}

      {usersQuery && (
        <>
          {/* Table Header */}
          <View style={tw`flex-row border-b-2 border-black py-2`}>
            {usersQuery.header.map((head, i) => (
              <Text key={i} style={tw`flex-1 font-bold px-2`}>
                {head}
              </Text>
            ))}
          </View>

          {/* Table Rows */}
          <FlatList
            data={transformedData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
        </>
      )}
    </View>
  );
};

export default ManageUsers;
