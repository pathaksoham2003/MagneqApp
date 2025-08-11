import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import SidebarLayout from '../../layout/SidebarLayout';

import useTheme from '../../hooks/useTheme';
import DashboardMetrics from './DashboardMetrics';
import RecentOrder from './RecentOrder';
import DashboardGraph from './DashboardGraph';
import Heading from '../../components/common/Heading';

const Dashboard = ({ onLogout }) => {
  const { tw } = useTheme();

  return (
    <SidebarLayout onLogout={onLogout}>
      <ScrollView contentContainerStyle={tw`p-4`}>
        <Heading style="pb-2">Dashboard</Heading>
        <DashboardMetrics />
        <RecentOrder />
        <DashboardGraph />
      </ScrollView>
    </SidebarLayout>
  );
};

export default Dashboard;
