import React from "react";
import { View, Text } from "react-native";
import SidebarLayout from "../../layout/SidebarLayout"; // adjust path if needed
import tw from "twrnc";

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
