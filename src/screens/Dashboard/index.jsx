import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import SidebarLayout from "../../layout/SidebarLayout";

const Dashboard = ({ onLogout }) => {
  return (
    <SidebarLayout title="Dashboard" onLogout={onLogout}>
      <View style={tw`flex-1 items-center justify-center`}>
        <Text style={tw`text-2xl font-bold`}>Welcome to Dashboard</Text>
      </View>
    </SidebarLayout>
  );
};

export default Dashboard;
