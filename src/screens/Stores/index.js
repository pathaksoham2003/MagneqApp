import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import SidebarLayout from "../../layout/SidebarLayout";

const Stores = ({ onLogout }) => {
  return (
    <SidebarLayout onLogout={onLogout}>
      <View style={tw`flex-1 items-center justify-center`}>
        <Text style={tw`text-2xl font-bold`}>Stores Screen</Text>
      </View>
    </SidebarLayout>
  );
};

export default Stores;
