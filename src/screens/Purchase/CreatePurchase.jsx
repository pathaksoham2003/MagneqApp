import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import Button from '../../components/common/Button';
import useTheme from '../../hooks/useTheme';

const CreatePurchase = ({ visible, onClose, onSuccess }) => {
  const { tw } = useTheme();

  const [selectedClass, setSelectedClass] = useState('');
  const [type, setType] = useState('');
  const [other, setOther] = useState('');
  const [quantity, setQuantity] = useState('');
  const [vendor, setVendor] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    // Here you can trigger backend API
    console.log({
      selectedClass,
      type,
      other,
      quantity,
      vendor,
      description,
    });
    if (onSuccess) {
      onSuccess(); // closes this and opens success modal
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={tw`flex-1 bg-black bg-opacity-40 justify-center items-center px-4`}>
        <View style={tw`bg-white w-full rounded-2xl p-4 max-h-[90%]`}>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-lg font-bold`}>Create Purchase Order</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close-outline" size={28} color="black" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={tw`text-sm mb-1`}>Class</Text>
            <View style={tw`border rounded-md mb-3`}>
              <Picker
                selectedValue={selectedClass}
                onValueChange={(itemValue) => setSelectedClass(itemValue)}
              >
                <Picker.Item label="Select Class (A/B/C)" value="" />
                <Picker.Item label="A" value="A" />
                <Picker.Item label="B" value="B" />
                <Picker.Item label="C" value="C" />
              </Picker>
            </View>

            <Text style={tw`text-sm mb-1`}>Type</Text>
            <View style={tw`border rounded-md mb-3`}>
              <Picker
                selectedValue={type}
                onValueChange={(itemValue) => setType(itemValue)}
              >
                <Picker.Item label="Select Type" value="" />
                <Picker.Item label="Lorem Ipsum" value="Lorem Ipsum" />
                <Picker.Item label="Dolor Sit" value="Dolor Sit" />
              </Picker>
            </View>

            <Text style={tw`text-sm mb-1`}>Other</Text>
            <View style={tw`border rounded-md mb-3`}>
              <Picker
                selectedValue={other}
                onValueChange={(itemValue) => setOther(itemValue)}
              >
                <Picker.Item label="Select Option" value="" />
                <Picker.Item label="others" value="others" />
                <Picker.Item label="something else" value="something else" />
              </Picker>
            </View>

            <Text style={tw`text-sm mb-1`}>Quantity</Text>
            <TextInput
              style={tw`border rounded-md px-3 py-2 mb-2`}
              placeholder="1"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />

            <TouchableOpacity onPress={() => {}} style={tw`mb-3`}>
              <Text style={tw`text-blue-600 text-sm`}>+ Add more Items</Text>
            </TouchableOpacity>

            <Text style={tw`text-sm mb-1`}>Vendor Name</Text>
            <View style={tw`border rounded-md mb-3`}>
              <Picker
                selectedValue={vendor}
                onValueChange={(itemValue) => setVendor(itemValue)}
              >
                <Picker.Item label="Select Vendor" value="" />
                <Picker.Item label="Mohan Kumar" value="Mohan Kumar" />
                <Picker.Item label="Sohan Kumar" value="Sohan Kumar" />
              </Picker>
            </View>

            <Text style={tw`text-sm mb-1`}>Description</Text>
            <TextInput
              multiline
              style={tw`border rounded-md px-3 py-2 h-24 mb-4 text-sm`}
              placeholder="Other Details...."
              value={description}
              onChangeText={setDescription}
            />

            <Button fullWidth onClick={handleSubmit}>
              Submit Purchase Order
            </Button>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CreatePurchase;
