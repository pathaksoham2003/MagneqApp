import React from 'react';
import { View, Text } from 'react-native';

import SidebarLayout from '../../layout/SidebarLayout';
import DashboardMetrics from '../../components/metrics/DashboardMetrics';
import Heading from '../../components/common/Heading';
import useTheme from '../../hooks/useTheme';

const Dashboard = ({ onLogout }) => {
  const { tw } = useTheme();
  return (
    <SidebarLayout onLogout={onLogout}>
      <View style={tw`flex-1`}>
        <Heading>Dashboard</Heading>
        <DashboardMetrics />
        <Heading>Recent Orders</Heading>
      </View>
    </SidebarLayout>
  );
};

export default Dashboard;
