import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import SidebarLayout from "../../layout/SidebarLayout";

const Sales = ({ onLogout }) => {
  return (
    <SidebarLayout title="Sales" onLogout={onLogout}>
      <View style={tw`flex-1 items-center justify-center`}>
        <Text style={tw`text-2xl font-bold`}>Sales Screen</Text>
      </View>
    </SidebarLayout>
  );
};

export default Sales;
