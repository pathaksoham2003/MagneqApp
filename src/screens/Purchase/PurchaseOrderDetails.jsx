import React from 'react';
import { View, Text } from 'react-native';
import useTheme from '../../hooks/useTheme';
import Button from '../../components/common/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Ionicons';

const PurchaseOrderDetails = () => {
  const { tw } = useTheme();

  return (
    <View style={tw`bg-white rounded-xl p-4 mt-4 border`}>
      <Text style={tw`text-lg font-bold mb-2`}>Purchase Orders Details</Text>

      <Text>Item Name - abc</Text>
      <Text>Vendor Name - Mohan Kumar</Text>
      <Text>Date of Purchasing - 22/06/2025</Text>
      <Text>Quantity - 1000</Text>
      <Text>Status - in Stock</Text>

      <Text style={tw`mt-2`}>Item gets used in :</Text>
      {Array(5)
        .fill('1$ase model')
        .map((item, idx) => (
          <Text key={idx}>{item}</Text>
        ))}

      <Text style={tw`mt-2 font-semibold`}>Description :</Text>
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
        et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat.
      </Text>

      <Text style={tw`mt-2`}>Vendor Contact : 91XXXXXXXXXX</Text>

      {/* Two buttons in a row */}
     
      <View style={tw`gap-4 my-4`}>
      {/* First row: Edit and Delete side by side */}
      <View style={tw`flex-row justify-between`}>
        <View style={tw`flex-1 mr-2`}>
          <Button
            fullWidth
            startIcon={<Icon name="create-outline" size={18} color="#fff" />}
          >
            Edit Order
          </Button>
        </View>
        <View style={tw`flex-1 ml-2`}>
          <Button
            fullWidth
            startIcon={<Icon name="trash-outline" size={18} color="#fff" />}
          >
            Delete Order
          </Button>
        </View>
      </View>

      {/* Second row: View Invoice centered below the above buttons */}
      <View style={tw`items-center`}>
        <View style={tw`w-1/2`}>
          <Button
            fullWidth
            onPress={() => setShowCreateModal(true)}
            startIcon={<Icon name="document-text-outline" size={18} color="#fff" />}
          >
            View Invoice
          </Button>
        </View>
      </View>
    </View>

      {/* Centered button */}
     
    </View>
  );
};

export default PurchaseOrderDetails;
