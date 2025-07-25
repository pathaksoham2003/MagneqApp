import React from 'react';
import { View, Text } from 'react-native';
import { tw } from '../../App';
import SidebarLayout from '../../layout/SidebarLayout';
import DashboardMetrics from '../../components/metrics/DashboardMetrics';
import Heading from '../../components/common/Heading';

const Dashboard = ({ onLogout }) => {
  return (
    <SidebarLayout title="Dashboard" onLogout={onLogout}>
      <View style={tw`flex-1`}>
        <Heading>Dashboard</Heading>
        <DashboardMetrics />
        <Heading>Recent Orders</Heading>
      </View>
    </SidebarLayout>
  );
};

export default Dashboard;
