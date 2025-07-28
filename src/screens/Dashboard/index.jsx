import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import SidebarLayout from '../../layout/SidebarLayout';

import useTheme from '../../hooks/useTheme';
import DashboardMetrics from './DashboardMetrics';
import RecentOrder from './RecentOrder';
import DashboardGraph from './DashboardGraph';

const Dashboard = ({ onLogout }) => {
  const { tw } = useTheme();

  return (
    <SidebarLayout onLogout={onLogout}>
      <ScrollView contentContainerStyle={tw`p-4`}>
        <Text style={tw`text-xl font-bold mb-4`}>Dashboard</Text>
        <DashboardMetrics />
        <RecentOrder />
        <DashboardGraph />
      </ScrollView>
    </SidebarLayout>
  );
};

export default Dashboard;
