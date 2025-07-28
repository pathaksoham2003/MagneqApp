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
        type: materialType || null,
        name: materialName || null,
      }),
    // Enable for all classes - let the backend handle the filtering logic
    enabled: !!materialClass,
  });

  const { data: vendorData } = useQuery({
    queryKey: ['vendors', debouncedSearch],
    queryFn: () => getAllVendors({ limit: 20, search: debouncedSearch }),
    staleTime: 5 * 60 * 1000,
  });

  const { data: configData } = useQuery({
    queryKey: ['rawMaterialConfig'],
    queryFn: () => getRawMaterialFilterConfig(),
  });

  console.log(configData)

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

  // Debug: Log the filtered data to see the structure
  useEffect(() => {
    console.log('Filtered Data:', filteredData);
  }, [filteredData]);

  // Debug: Log the conditions for dropdown visibility
  useEffect(() => {
    console.log('Dropdown conditions:', {
      materialClass,
      materialType,
      materialName,
      shouldShow: shouldShowFilteredDropdown(),
      filterItemsLength: filterItems.length,
      filteredData: filteredData
    });
  }, [materialClass, materialType, materialName, filteredData]);

  // Handle different possible response structures with better error handling
  const getRawMaterialsArray = () => {
    console.log('Raw filteredData:', filteredData);
    
    if (!filteredData) {
      console.log('No filteredData available');
      return [];
    }
    
    // Try different possible structures
    if (Array.isArray(filteredData)) {
      console.log('filteredData is direct array, length:', filteredData.length);
      return filteredData;
    }
    if (filteredData.data && Array.isArray(filteredData.data)) {
      console.log('filteredData.data is array, length:', filteredData.data.length);
      return filteredData.data;
    }
    if (filteredData.items && Array.isArray(filteredData.items)) {
      console.log('filteredData.items is array, length:', filteredData.items.length);
      return filteredData.items;
    }
    
    console.log('No valid array found in filteredData structure');
    return [];
  };

  // Update to display material by name + type + specification
  const filterItems = getRawMaterialsArray().map(
    item => ({
      id: item._id,
      label: `${item.name} - ${item.type}`,
      fullItem: item
    })
  );

  // Check if we should show the filtered materials dropdown - now shows for all classes
  const shouldShowFilteredDropdown = () => {
    // Show dropdown for all classes once a class is selected
    return !!materialClass;
  };

  const handleAddItem = () => {
    if (
      !materialClass ||
      (!materialType && !materialName) ||
      !selectedRawMaterial ||
      !quantity
    ) {
      console.log('Validation failed:', {
        materialClass,
        materialType,
        materialName,
        selectedRawMaterial,
        quantity
      });
      return;
    }

    const selectedData = getRawMaterialsArray().find(
      rm => rm._id === selectedRawMaterial.id
    );

    if (!selectedData) {
      console.log('Selected data not found');
      return;
    }

    const newItem = {
      id: selectedData._id,
      class: materialClass,
      type: materialType || selectedData.type,
      name: materialName || selectedData.name,
      material: selectedRawMaterial.label,
      quantity,
      specification: selectedData?.other_specification?.value || '',
    };

    setItems([...items, newItem]);

    // Only reset the item-specific fields, keep class/type/name for easier multiple additions
    setSelectedRawMaterial('');
    setQuantity('');
    
    console.log('Item added successfully:', newItem);
    console.log('Updated items list:', [...items, newItem]);
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

          {materialClass === 'A' && nameOptions.length > 0 && (
            <Dropdown
              label="Name"
              data={nameOptions}
              value={materialName}
              setValue={val => {
                setMaterialName(val);
                setSelectedRawMaterial('');
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
                // Trigger refetch when both name and type are selected for Class C
                if (materialType && val) {
                  console.log('Refetching for Class C with name:', val, 'and type:', materialType);
                }
              }}
            />
          )}

          {materialClass === 'C' && typeOptions.length > 0 && (
            <Dropdown
              label="Type"
              data={typeOptions}
              value={materialType}
              setValue={val => {
                setMaterialType(val);
                setSelectedRawMaterial('');
                // Trigger refetch when both name and type are selected for Class C
                if (materialName && val) {
                  console.log('Refetching for Class C with type:', val, 'and name:', materialName);
                }
              }}
            />
          )}

          {/* Show filtered raw materials dropdown for all classes */}
          {shouldShowFilteredDropdown() && (
            <View style={tw`mb-3`}>
              <Text style={tw`text-sm mb-1`}>Select Raw Material</Text>
              
              {filterItems.length > 0 ? (
                <>
                  <SearchableDropdown
                    data={filterItems}
                    selectedValue={selectedRawMaterial}
                    onSelect={(item) => {
                      console.log('Selected raw material:', item);
                      setSelectedRawMaterial(item);
                    }}
                    placeholder="Search and select raw material"
                    displayKey="label"
                    containerStyle="mb-2"
                  />
                  
                  {/* Show specification if a material is selected */}
                  {selectedRawMaterial && selectedRawMaterial.fullItem?.other_specification?.value && (
                    <Text style={tw`text-xs text-gray-600 mb-2 p-2 bg-gray-50 rounded`}>
                      Specification: {selectedRawMaterial.fullItem.other_specification.value}
                    </Text>
                  )}
                </>
              ) : (
                <View style={tw`border rounded-md px-3 py-2 mb-2 bg-gray-50`}>
                  <Text style={tw`text-sm text-gray-500`}>
                    {!filteredData 
                      ? 'Loading raw materials...' 
                      : materialClass === 'A' && !materialName
                        ? 'Please select a Name to see raw materials'
                        : materialClass === 'B' && !materialType
                          ? 'Please select a Type to see raw materials'
                          : materialClass === 'C' && (!materialName || !materialType)
                            ? 'Please select both Name and Type to see raw materials'
                            : 'No raw materials found for the selected criteria'
                    }
                  </Text>
                  {/* Debug info - remove this in production */}
                  {__DEV__ && filteredData && (
                    <Text style={tw`text-xs text-red-500 mt-1`}>
                      Debug: filteredData structure: {JSON.stringify(filteredData, null, 2)}
                    </Text>
                  )}
                </View>
              )}
            </View>
          )}

          <Text style={tw`text-sm mb-1`}>Quantity</Text>
          <TextInput
            style={tw`border rounded-md px-3 py-2 mb-2`}
            placeholder="1"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />

          <TouchableOpacity 
            onPress={handleAddItem} 
            style={tw`mb-4 ${
              !materialClass || 
              (!materialType && !materialName) || 
              !selectedRawMaterial || 
              !quantity 
                ? 'opacity-50' 
                : ''
            }`}
            disabled={
              !materialClass || 
              (!materialType && !materialName) || 
              !selectedRawMaterial || 
              !quantity
            }
          >
            <Text style={tw`text-blue-600 text-sm font-medium`}>
              + Add Item to Purchase Order
            </Text>
          </TouchableOpacity>

          {/* Added Items List */}
          {items.length > 0 && (
            <View style={tw`mb-4`}>
              <Text style={tw`text-sm font-medium mb-2`}>Added Items ({items.length})</Text>
              {items.map((item, index) => (
                <View
                  key={index}
                  style={tw`flex-row justify-between items-center border rounded-md p-3 mb-2 bg-gray-50`}
                >
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-sm font-medium text-gray-800`}>
                      {item.class} - {item.material}
                    </Text>
                    <Text style={tw`text-sm text-gray-600`}>Quantity: {item.quantity}</Text>
                    {item.specification && (
                      <Text style={tw`text-xs text-gray-500 mt-1`} numberOfLines={2}>
                        {item.specification}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity 
                    onPress={() => handleDeleteItem(index)}
                    style={tw`ml-2 p-1`}
                  >
                    <Icon name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

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
    </SidebarLayout>
  );
};

export default CreatePurchase;