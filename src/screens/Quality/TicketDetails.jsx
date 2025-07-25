import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../../components/common/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';

const TicketDetails = () => {
  const navigation =useNavigation();
  return (
    <ScrollView contentContainerStyle={tw`p-5 bg-white mt-10`}>
      
      {/* Header */}
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <Text style={tw`text-lg font-bold text-gray-900`}>Quality Concerns</Text>
        <Ionicons name="search-outline" size={22} color="#000" />
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
      {/* Section Title */}
      <Text style={tw`text-base font-bold text-gray-800 mb-3`}>
        Quality Ticket Details
      </Text>

      {/* Ticket Card */}
      <View style={tw`bg-white p-4 rounded-xl border border-gray-200 shadow-sm`}>
        <Text style={tw`text-sm text-gray-700 mb-1`}>Vendor Name - Mohan Kumar</Text>
        <Text style={tw`text-sm text-gray-700 mb-1`}>Model - ADVD</Text>
        <Text style={tw`text-sm text-gray-700 mb-1`}>Date - 22/06/2025</Text>
        <Text style={tw`text-sm text-gray-700 mb-1`}>Type - S</Text>
        <Text style={tw`text-sm text-gray-700 mb-1`}>Issue In - S</Text>
        <Text style={tw`text-sm text-gray-700 mb-1`}>
          Vendor Contact : 91XXXXXXXX
        </Text>

        <Text style={tw`text-sm font-medium text-gray-800 mt-3`}>Description :</Text>
        <Text style={tw`text-sm text-gray-600 mt-1 leading-5`}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Text>

        {/* Action Buttons */}
        <View style={tw`flex-row justify-between mt-5`}>
          <TouchableOpacity style={tw`flex-row items-center bg-blue-600 px-4 py-2 rounded-md`}>
            <Ionicons name="create-outline" size={16} color="white" />
            <Text style={tw`text-white font-medium text-sm ml-2`}>Edit Ticket</Text>
          </TouchableOpacity>

          <TouchableOpacity style={tw`flex-row items-center bg-blue-600 px-4 py-2 rounded-md`}>
            <Ionicons name="trash-outline" size={16} color="white" />
            <Text style={tw`text-white font-medium text-sm ml-2`}>Delete Ticket</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default TicketDetails;
