import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import SidebarLayout from '../../layout/SidebarLayout';
import Button from '../../components/common/Button';
import DynamicTable from '../../components/common/DynamicTable';
import { useNavigation } from '@react-navigation/native';
import useTheme from '../../hooks/useTheme';
import useQuality from '../../services/useQuality';
import { useQuery } from '@tanstack/react-query';
import Heading from '../../components/common/Heading';

const Quality = ({ onLogout }) => {
  const { tw } = useTheme();
  const navigation = useNavigation();

  const tableHeader = ['Ticket ID', 'Vendor name'];
  const { getAllQualityIssues } = useQuality();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['quality-issues'],
    queryFn: getAllQualityIssues,
  });

  // Prepare the formatted tableData
  const formattedItems =
    data?.item?.map(item => {
      const ticketId = item.data?.[0] || '—';
      const fullName = item.data?.[1] || '—';
      const vendorName = fullName.split('(')[0].trim(); // remove (role)
      return {
        id: item.id,
        data: [ticketId, vendorName],
      };
    }) || [];

  const tableData = { item: formattedItems };

  return (
    <SidebarLayout onLogout={onLogout}>
      <SafeAreaView style={tw`px-4 py-2`}>
        {/* Top bar */}
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <Heading>Quality Concerns</Heading>
          <View style={tw``}>
            <Button
              size="lg"
              startIcon={<Icon name="add-outline" size={20} color="#fff" />}
              onClick={() => navigation.navigate('CreateQuality')}
            >
              Create a ticket
            </Button>
          </View>
        </View>

        {/* Create Ticket Button */}

        {/* Table */}
        <ScrollView>
          <DynamicTable
            header={tableHeader}
            tableData={tableData}
            onRowClick={data =>
              navigation.navigate('TicketDetails', { id: data.item_id })
            }
          />
        </ScrollView>
      </SafeAreaView>
    </SidebarLayout>
  );
};

export default Quality;
