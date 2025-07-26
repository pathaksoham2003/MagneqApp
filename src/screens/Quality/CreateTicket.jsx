// screens/quality/CreateTicket.jsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/common/Button';
import SuccessModel from '../../components/common/SuccessModel';  // your reusable modal
import Icon from 'react-native-vector-icons/Ionicons';
import useTheme from '../../hooks/useTheme';

const CreateTicket = () => {
  const { tw } = useTheme();
  const [model, setModel] = useState('');
  const [type, setType] = useState('');
  const [issue, setIssue] = useState('');
  const [details, setDetails] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const navigation = useNavigation();

  const handleCreate = () => {
    // 1. Show the success modal
    setShowSuccess(true);

    // 2. After 2 seconds, hide modal & navigate
    setTimeout(() => {
      setShowSuccess(false);
      navigation.navigate('TicketDetails');
    }, 2000);
  };

  return (
    <>
      <ScrollView style={tw`px-4 py-4 bg-white mt-10`}>
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
        <View style={tw`border border-gray-200 rounded-2xl p-4`}>
          <Text style={tw`text-lg font-semibold mb-4`}>Create Ticket</Text>

          {/* Vendor Name */}
          <Text style={tw`text-sm mb-1`}>Vendor Name</Text>
          <TextInput
            value="Mohan Kumar"
            editable={false}
            style={tw`border border-gray-300 rounded-md p-3 mb-3 bg-gray-100`}
          />

          {/* Model */}
          <Text style={tw`text-sm mb-1`}>Model</Text>
          <View style={tw`border border-gray-300 rounded-md mb-3`}>
            <Picker selectedValue={model} onValueChange={setModel}>
              <Picker.Item label="Select Model" value="" />
              <Picker.Item label="102" value="102" />
              <Picker.Item label="128" value="128" />
              <Picker.Item label="142" value="142" />
              <Picker.Item label="168" value="168" />
            </Picker>
          </View>

          {/* Type */}
          <Text style={tw`text-sm mb-1`}>Type</Text>
          <View style={tw`border border-gray-300 rounded-md mb-3`}>
            <Picker selectedValue={type} onValueChange={setType}>
              <Picker.Item label="Select Type" value="" />
              <Picker.Item label="Flange" value="Flange" />
              <Picker.Item label="Foot" value="Foot" />
            </Picker>
          </View>

          {/* Issue */}
          <Text style={tw`text-sm mb-1`}>Issue in</Text>
          <View style={tw`border border-gray-300 rounded-md mb-2`}>
            <Picker selectedValue={issue} onValueChange={setIssue}>
              <Picker.Item label="Select your issue" value="" />
              <Picker.Item label="Welding Defect" value="Welding Defect" />
              <Picker.Item label="Dimension Mismatch" value="Dimension Mismatch" />
              <Picker.Item label="Paint Issue" value="Paint Issue" />
            </Picker>
          </View>

          <TouchableOpacity>
            <Text style={tw`text-blue-600 text-sm mb-3`}>+ Add more Items</Text>
          </TouchableOpacity>

          {/* Other Details */}
          <Text style={tw`text-sm mb-1`}>Other Details</Text>
          <TextInput
            multiline
            numberOfLines={4}
            value={details}
            onChangeText={setDetails}
            placeholder="Other Details...."
            style={tw`border border-gray-300 rounded-md p-3 h-24 mb-4`}
          />

          {/* Submit */}
          <Button
            size="lg"
            variant="primary"
            disabled={!(model && type && issue)}
            onClick={handleCreate}
            style={tw`w-full ${!(model && type && issue) && 'opacity-50'}`}
          >
            Create Ticket
          </Button>
        </View>
      </ScrollView>

      {/* Success Modal (reusable) */}
      <SuccessModel
        visible={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          navigation.navigate('TicketDetails');
        }}
        message="Congratulations, Quality Ticket created Successfully"
      />
    </>
  );
};

export default CreateTicket;
