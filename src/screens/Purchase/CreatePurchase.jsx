import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import useTheme from '../../hooks/useTheme';
import useDebounce from '../../hooks/useDebounce';
import useManage from '../../services/useManage';
import useRawMaterials from '../../services/useRawMaterials';
import SidebarLayout from '../../layout/SidebarLayout';
import Button from '../../components/common/Button';
import SearchableDropdown from '../../components/common/SearchableDropdown';
import Icon from 'react-native-vector-icons/Ionicons';
import Dropdown from '../../components/common/DropDown';

const CreatePurchase = ({ visible, onClose, onSuccess }) => {
  const { tw } = useTheme();

  const [materialClass, setMaterialClass] = useState('');
  const [materialType, setMaterialType] = useState('');
  const [materialName, setMaterialName] = useState('');
  const [selectedRawMaterial, setSelectedRawMaterial] = useState('');
  const [quantity, setQuantity] = useState('');
  const [vendor, setVendor] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState([]);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search.trim(), 150);

  const { getAllVendors } = useManage();
  const { getRawMaterialFilterConfig, getFilteredRawMaterials } = useRawMaterials();

  const [filterConfig, setFilterConfig] = useState(null);

  const { data: filteredData, refetch: refetchFilteredMaterials } = useQuery({
    queryKey: ['filteredRM', materialClass, materialType, materialName],
    queryFn: () =>
      getFilteredRawMaterials({
        class_type: materialClass,
        type: materialType,
        name: materialName,
      }),
    enabled: !!materialClass,
  });
console.log(filteredData)
  const { data: vendorData } = useQuery({
    queryKey: ['vendors', debouncedSearch],
    queryFn: () => getAllVendors({ limit: 20, search: debouncedSearch }),
    staleTime: 5 * 60 * 1000,
  });

  const { data: configData } = useQuery({
    queryKey: ['rawMaterialConfig'],
    queryFn: () => getRawMaterialFilterConfig(),
  });

  useEffect(() => {
    if (configData) {
      setFilterConfig(configData?.data || configData);
    }
  }, [configData]);

  const classOptions = filterConfig ? Object.keys(filterConfig) : [];
  const typeOptions =
    materialClass && filterConfig?.[materialClass]?.types
      ? filterConfig[materialClass].types
      : [];
  const nameOptions =
    materialClass && filterConfig?.[materialClass]?.names
      ? filterConfig[materialClass].names
      : [];

  const filterItems = filteredData?.data?.map(item => item.name) || [];

  const handleAddItem = () => {
    if (
      !materialClass ||
      (!materialType && !materialName) ||
      !selectedRawMaterial ||
      !quantity
    )
      return;

    const selectedData = filteredData?.data?.find(
      rm => rm.name === selectedRawMaterial,
    );

    const newItem = {
      class: materialClass,
      type: materialType || null,
      name: materialName || null,
      material: selectedRawMaterial,
      quantity,
      specification: selectedData?.other_specification?.value || '',
    };

    setItems([...items, newItem]);

    setMaterialClass('');
    setMaterialType('');
    setMaterialName('');
    setSelectedRawMaterial('');
    setQuantity('');
  };

  const handleDeleteItem = index => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleSubmit = () => {
    const payload = {
      items,
      vendor,
      description,
    };

    console.log('Submit Payload:', payload);
    if (onSuccess) onSuccess();
  };

  return (
    <SidebarLayout>
      <View style={tw`bg-white w-full rounded-2xl p-4`}>
        <Text style={tw`text-lg font-bold mb-4`}>Create Purchase Order</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Class Dropdown */}
          <Dropdown
            label="Class"
            data={classOptions}
            value={materialClass}
            setValue={val => {
              setMaterialClass(val);
              setMaterialType('');
              setMaterialName('');
              setSelectedRawMaterial('');
            }}
          />

          {/* Conditionally render dropdowns based on class */}
          {materialClass === 'A' && nameOptions.length > 0 && (
            <Dropdown
              label="Name"
              data={nameOptions}
              value={materialName}
              setValue={val => {
                setMaterialName(val);
                setSelectedRawMaterial('');
                refetchFilteredMaterials();
              }}
            />
          )}

          {materialClass === 'B' && typeOptions.length > 0 && (
            <Dropdown
              label="Type"
              data={typeOptions}
              value={materialType}
              setValue={val => {
                setMaterialType(val);
                setSelectedRawMaterial('');
                refetchFilteredMaterials();
              }}
            />
          )}

          {materialClass === 'C' && nameOptions.length > 0 && (
            <Dropdown
              label="Name"
              data={nameOptions}
              value={materialName}
              setValue={val => {
                setMaterialName(val);
                setSelectedRawMaterial('');
                refetchFilteredMaterials();
              }}
            />
          )}

          {/* Filtered raw materials */}
          <Dropdown
            label="Filtered Raw Material"
            data={filterItems}
            value={selectedRawMaterial}
            setValue={setSelectedRawMaterial}
          />

          {/* Quantity Input */}
          <Text style={tw`text-sm mb-1`}>Quantity</Text>
          <TextInput
            style={tw`border rounded-md px-3 py-2 mb-2`}
            placeholder="1"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />

          {/* Add More Items */}
          <TouchableOpacity onPress={handleAddItem} style={tw`mb-4`}>
            <Text style={tw`text-blue-600 text-sm`}>+ Add more Items</Text>
          </TouchableOpacity>

          {/* Display Items */}
          {items.map((item, index) => (
            <View
              key={index}
              style={tw`flex-row justify-between items-center border rounded-md p-2 mb-2 bg-gray-100`}
            >
              <View>
                <Text style={tw`text-sm`}>
                  {item.class} {item.type ? `- ${item.type}` : ''}{' '}
                  {item.name ? `- ${item.name}` : ''} - {item.material}
                </Text>
                <Text style={tw`text-sm`}>Qty: {item.quantity}</Text>
                {item.specification && (
                  <Text style={tw`text-xs text-gray-500`}>
                    {item.specification}
                  </Text>
                )}
              </View>
              <TouchableOpacity onPress={() => handleDeleteItem(index)}>
                <Icon name="trash-outline" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ))}

          {/* Vendor Dropdown */}
          <Text style={tw`text-sm mb-1`}>Vendor Name</Text>
          <SearchableDropdown
            data={(vendorData?.item || []).map(v => ({
              id: v.id,
              label: v.data[0],
            }))}
            selectedValue={vendor ? { label: vendor } : null}
            onSelect={item => setVendor(item.label)}
            placeholder="Search Vendor"
            containerStyle="mb-4"
          />

          {/* Description */}
          <Text style={tw`text-sm mb-1`}>Description</Text>
          <TextInput
            multiline
            style={tw`border rounded-md px-3 py-2 h-24 mb-4 text-sm`}
            placeholder="Other Details...."
            value={description}
            onChangeText={setDescription}
          />

          {/* Submit Button */}
          <Button fullWidth onClick={handleSubmit}>
            Submit Purchase Order
          </Button>
        </ScrollView>
      </View>
    </SidebarLayout>
  );
};

export default CreatePurchase;
