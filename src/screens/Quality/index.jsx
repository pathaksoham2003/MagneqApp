import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import SidebarLayout from '../../layout/SidebarLayout';
import Button from '../../components/common/Button';
import DynamicTable from '../../components/common/DynamicTable';
import { useNavigation } from '@react-navigation/native';
import useTheme from '../../hooks/useTheme';

const Quality = ({ onLogout }) => {
  const { tw } = useTheme();
  const tableHeader = ['Ticket ID', 'Vendor name'];
  const navigation = useNavigation();
  const tableData = {
    item: Array(6).fill({
      id: Math.random().toString(),
      data: ['001', 'Mohan Kumar'],
    }),
  };

  return (
    <SidebarLayout onLogout={onLogout}>
      <SafeAreaView style={tw`px-4 py-2`}>
        {/* Top bar */}
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <Text style={tw`text-xl font-bold text-gray-900`}>Quality Concerns</Text>
          <Icon name="search" size={22} color="#000" />
        </View>

        {/* Create Ticket Button */}
        <View style={tw`mb-4`}>
          <Button
            size="lg"
            startIcon={<Icon name="add-outline" size={20} color="#fff" />}
            onClick={() => navigation.navigate('CreateTicket')}
          >
            Create a ticket
          </Button>
        </View>

        {/* Table */}
        <ScrollView>
          <DynamicTable header={tableHeader} tableData={tableData} />
        </ScrollView>
      </SafeAreaView>
    </SidebarLayout>
  );
};

export default Quality;
