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
import { useQuery } from '@tanstack/react-query';
import useDebounce from '../../hooks/useDebounce';
import useManage from '../../services/useManage';
import SearchableDropdown from '../../components/common/SearchableDropdown';

const CreatePurchase = ({ visible, onClose, onSuccess }) => {
  const { tw } = useTheme();

  const [selectedClass, setSelectedClass] = useState('');
  const [type, setType] = useState('');
  const [other, setOther] = useState('');
  const [quantity, setQuantity] = useState('');
  const [vendor, setVendor] = useState('');
  const [description, setDescription] = useState('');
  const { getAllVendors } = useManage();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search.trim(), 150);

  const [items, setItems] = useState([]);

  const { data, isLoading } = useQuery({
    queryKey: ['vendors', debouncedSearch],
    queryFn: () => getAllVendors({ limit: 20, search: debouncedSearch }),
    staleTime: 5 * 60 * 1000,
  });

  const handleSubmit = () => {
    const payload = {
      items,
      vendor,
      description,
    };

    console.log('Submit Payload:', payload);

    if (onSuccess) onSuccess();
  };

  const handleAddItem = () => {
    if (!selectedClass || !type || !other || !quantity) return;

    const newItem = {
      selectedClass,
      type,
      other,
      quantity,
    };

    setItems([...items, newItem]);

    // Clear fields
    setSelectedClass('');
    setType('');
    setOther('');
    setQuantity('');
  };

  const handleDeleteItem = index => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  console.log(items);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={tw`flex-1 bg-black bg-opacity-40 justify-center items-center px-4`}
      >
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
                onValueChange={itemValue => setSelectedClass(itemValue)}
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
                onValueChange={itemValue => setType(itemValue)}
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
                onValueChange={itemValue => setOther(itemValue)}
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

            <TouchableOpacity onPress={handleAddItem} style={tw`mb-3`}>
              <Text style={tw`text-blue-600 text-sm`}>+ Add more Items</Text>
            </TouchableOpacity>

            {items.map((item, index) => (
              <View
                key={index}
                style={tw`flex-row justify-between items-center border rounded-md p-2 mb-2 bg-gray-100`}
              >
                <View>
                  <Text style={tw`text-sm flex-1 mr-2`}>
                    Class: {item.selectedClass}, Type: {item.type}
                  </Text>
                  <Text style={tw`text-sm flex-1 mr-2`}>
                    Other: {item.other}, Qty: {item.quantity}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteItem(index)}>
                  <Icon name="trash-outline" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ))}

            <Text style={tw`text-sm mb-1`}>Vendor Name</Text>

            <SearchableDropdown
              data={(data?.item || []).map(v => ({
                id: v.id,
                label: v.data[0], // Vendor Name
              }))}
              selectedValue={vendor ? { label: vendor } : null}
              onSelect={item => setVendor(item.label)}
              placeholder="Search Vendor"
              containerStyle="mb-4"
            />

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
