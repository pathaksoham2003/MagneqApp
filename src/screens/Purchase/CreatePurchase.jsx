import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useTheme from '../../hooks/useTheme';
import useDebounce from '../../hooks/useDebounce';
import useManage from '../../services/useManage';
import useRawMaterials from '../../services/useRawMaterials';
import SidebarLayout from '../../layout/SidebarLayout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Heading from '../../components/common/Heading';
import SubHeading from '../../components/common/SubHeading';
import SearchableDropdown from '../../components/common/SearchableDropdown';
import Icon from 'react-native-vector-icons/Ionicons';
import Dropdown from '../../components/common/DropDown';
import usePurchase from '../../services/usePurchase';

const CreatePurchase = ({ navigation }) => {
  const { tw } = useTheme();

  const [materialClass, setMaterialClass] = useState('');
  const [materialType, setMaterialType] = useState('');
  const [materialName, setMaterialName] = useState('');
  const [selectedRawMaterial, setSelectedRawMaterial] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [vendor, setVendor] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search.trim(), 150);

  const { getAllVendors } = useManage();
  const { getRawMaterialFilterConfig, getFilteredRawMaterials } = useRawMaterials();
  const { createPurchaseOrder } = usePurchase();
  const [filterConfig, setFilterConfig] = useState(null);

  const { data: filteredData, refetch: refetchFilteredMaterials } = useQuery({
    queryKey: ['filteredRM', materialClass, materialType, materialName],
    queryFn: () =>
      getFilteredRawMaterials({
        class_type: materialClass,
        type: materialType || null,
        name: materialName || null,
      }),
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

  const queryClient = useQueryClient();
  const {
    mutate: createPO,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: order => createPurchaseOrder(order),
    onSuccess: () => {
      console.log("Order created successfully");
      queryClient.invalidateQueries({ queryKey: ['purchase'] });
      setVendorName('');
      setPurchaseDate('');
      navigation.goBack();
    },
    onError: err => {
      console.error('Order creation failed:', err);
      setError('Failed to create PO. Please try again.');
    },
  });

  useEffect(() => {
    if (configData) {
      setFilterConfig(configData?.data || configData);
    }
  }, [configData]);

  // Set default purchase date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setPurchaseDate(today);
  }, []);

  const classOptions = filterConfig ? Object.keys(filterConfig) : [];
  const typeOptions =
    materialClass && filterConfig?.[materialClass]?.types
      ? filterConfig[materialClass].types
      : [];
  const nameOptions =
    materialClass && filterConfig?.[materialClass]?.names
      ? filterConfig[materialClass].names
      : [];

  // Handle different possible response structures with better error handling
  const getRawMaterialsArray = () => {
    if (!filteredData) return [];
    
    if (Array.isArray(filteredData)) return filteredData;
    if (filteredData.data && Array.isArray(filteredData.data)) return filteredData.data;
    if (filteredData.items && Array.isArray(filteredData.items)) return filteredData.items;
    
    return [];
  };

  // Update to display material by name + type + specification
  const filterItems = getRawMaterialsArray().map(item => ({
    id: item._id,
    label: `${item.name} - ${item.type}`,
    fullItem: item,
  }));

  // Check if we should show the filtered materials dropdown - now shows for all classes
  const shouldShowFilteredDropdown = () => {
    return !!materialClass;
  };

  const handleAddItem = () => {
    if (
      !materialClass ||
      (!materialType && !materialName) ||
      !selectedRawMaterial ||
      !quantity ||
      !pricePerUnit
    ) {
      console.log('Validation failed');
      return;
    }

    const selectedData = getRawMaterialsArray().find(
      rm => rm._id === selectedRawMaterial.id,
    );

    if (!selectedData) {
      console.log('Selected data not found');
      return;
    }

    const newItem = {
      id: selectedData._id,
      raw_material_id: selectedData._id,
      class: materialClass,
      type: materialType || selectedData.type,
      name: materialName || selectedData.name,
      material: selectedRawMaterial.label,
      quantity: parseFloat(quantity),
      price_per_unit: parseFloat(pricePerUnit),
      specification: selectedData?.other_specification?.value || '',
    };

    setItems([...items, newItem]);

    // Reset item-specific fields
    setSelectedRawMaterial('');
    setQuantity('');
    setPricePerUnit('');
  };

  const handleDeleteItem = index => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleSubmit = async () => {
    try {
      setError('');

      // Validation
      if (!vendorName.trim()) {
        setError('Please enter vendor name');
        return;
      }

      if (!purchaseDate) {
        setError('Please select purchase date');
        return;
      }

      if (items.length === 0) {
        setError('Please add at least one item to the purchase order');
        return;
      }

      const payload = {
        vendor_name: vendorName,
        purchasing_date: purchaseDate,
        items: items.map(({ raw_material_id, quantity, price_per_unit }) => ({
          raw_material_id,
          quantity,
          price_per_unit,
        })),
      };

      console.log('Submit Payload:', payload);
      createPO(payload);
    } catch (error) {
      console.error('Failed to create PO:', error);
      setError('Failed to create PO. Please try again.');
    }
  };

  const isFormValid = vendorName.trim() && purchaseDate && items.length > 0;

  return (
    <SidebarLayout>
      <View style={tw`bg-white w-full rounded-2xl p-4 flex-1`}>
        <Heading>Create Purchase Order</Heading>
        
        <View style={tw`flex-1`}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={tw`flex-1`}
            contentContainerStyle={tw`pb-4`}
          >
            {/* Error message */}
            {error ? (
              <View style={tw`bg-red-50 border border-red-200 rounded-md p-3 mb-4`}>
                <Text style={tw`text-red-600 text-sm`}>{error}</Text>
              </View>
            ) : null}

            {/* Vendor Selection */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-sm mb-2 font-medium text-gray-700`}>Vendor *</Text>
              <SearchableDropdown
                data={(vendorData?.item || []).map(v => ({
                  id: v.id,
                  label: v.data[0],
                }))}
                selectedValue={vendorName ? { label: vendorName } : null}
                onSelect={item => setVendorName(item.label)}
                placeholder="Search and select vendor"
              />
            </View>

            {/* Purchase Date Input */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-sm mb-2 font-medium text-gray-700`}>Purchase Date *</Text>
              <Input
                placeholder="YYYY-MM-DD"
                value={purchaseDate}
                onChangeText={setPurchaseDate}
              />
            </View>

            <View style={tw`border-t pt-4 mb-4`}>
              <SubHeading title="Add Items" />

              <View style={tw`mb-3`}>
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
              </View>

              {materialClass === 'A' && nameOptions.length > 0 && (
                <View style={tw`mb-3`}>
                  <Dropdown
                    label="Name"
                    data={nameOptions}
                    value={materialName}
                    setValue={val => {
                      setMaterialName(val);
                      setSelectedRawMaterial('');
                    }}
                  />
                </View>
              )}

              {materialClass === 'B' && typeOptions.length > 0 && (
                <View style={tw`mb-3`}>
                  <Dropdown
                    label="Type"
                    data={typeOptions}
                    value={materialType}
                    setValue={val => {
                      setMaterialType(val);
                      setSelectedRawMaterial('');
                    }}
                  />
                </View>
              )}

              {materialClass === 'C' && nameOptions.length > 0 && (
                <View style={tw`mb-3`}>
                  <Dropdown
                    label="Name"
                    data={nameOptions}
                    value={materialName}
                    setValue={val => {
                      setMaterialName(val);
                      setSelectedRawMaterial('');
                    }}
                  />
                </View>
              )}

              {materialClass === 'C' && typeOptions.length > 0 && (
                <View style={tw`mb-3`}>
                  <Dropdown
                    label="Type"
                    data={typeOptions}
                    value={materialType}
                    setValue={val => {
                      setMaterialType(val);
                      setSelectedRawMaterial('');
                    }}
                  />
                </View>
              )}

              {/* Show filtered raw materials dropdown for all classes */}
              {shouldShowFilteredDropdown() && (
                <View style={tw`mb-4`}>
                  <Text style={tw`text-sm mb-2 font-medium text-gray-700`}>Select Raw Material</Text>

                  {filterItems.length > 0 ? (
                    <>
                      <SearchableDropdown
                        data={filterItems}
                        selectedValue={selectedRawMaterial}
                        onSelect={item => {
                          setSelectedRawMaterial(item);
                        }}
                        placeholder="Search and select raw material"
                        displayKey="label"
                      />

                      {/* Show specification if a material is selected */}
                      {selectedRawMaterial &&
                        selectedRawMaterial.fullItem?.other_specification?.value && (
                        <Text style={tw`text-xs text-gray-600 mt-2 p-2 bg-gray-50 rounded`}>
                          Specification: {selectedRawMaterial.fullItem.other_specification.value}
                        </Text>
                      )}
                    </>
                  ) : (
                    <View style={tw`border rounded-md px-3 py-2 bg-gray-50`}>
                      <Text style={tw`text-sm text-gray-500`}>
                        {!filteredData
                          ? 'Loading raw materials...'
                          : materialClass === 'A' && !materialName
                          ? 'Please select a Name to see raw materials'
                          : materialClass === 'B' && !materialType
                          ? 'Please select a Type to see raw materials'
                          : materialClass === 'C' && (!materialName || !materialType)
                          ? 'Please select both Name and Type to see raw materials'
                          : 'No raw materials found for the selected criteria'}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              <View style={tw`flex-row gap-3 mb-4`}>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-sm mb-2 font-medium text-gray-700`}>Quantity *</Text>
                  <Input
                    placeholder="1"
                    keyboardType="numeric"
                    value={quantity}
                    onChangeText={setQuantity}
                  />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-sm mb-2 font-medium text-gray-700`}>Price per Unit *</Text>
                  <Input
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={pricePerUnit}
                    onChangeText={setPricePerUnit}
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={handleAddItem}
                style={tw`mb-4 ${
                  !materialClass ||
                  (!materialType && !materialName) ||
                  !selectedRawMaterial ||
                  !quantity ||
                  !pricePerUnit
                    ? 'opacity-50'
                    : ''
                }`}
                disabled={
                  !materialClass ||
                  (!materialType && !materialName) ||
                  !selectedRawMaterial ||
                  !quantity ||
                  !pricePerUnit
                }
              >
                <Text style={tw`text-blue-600 text-sm font-medium`}>
                  + Add Item to Purchase Order
                </Text>
              </TouchableOpacity>
            </View>

            {/* Added Items List */}
            {items.length > 0 && (
              <View style={tw`mb-4`}>
                <SubHeading title={`Added Items (${items.length})`} />
                {items.map((item, index) => (
                  <View
                    key={index}
                    style={tw`flex-row justify-between items-center border rounded-md p-3 mb-2 bg-gray-50`}
                  >
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-sm font-medium text-gray-800`}>
                        {item.class} - {item.material}
                      </Text>
                      <View style={tw`flex-row justify-between mt-1`}>
                        <Text style={tw`text-sm text-gray-600`}>Qty: {item.quantity}</Text>
                        <Text style={tw`text-sm text-gray-600`}>₹{item.price_per_unit}/unit</Text>
                        <Text style={tw`text-sm font-medium text-gray-800`}>
                          Total: ₹{(item.quantity * item.price_per_unit).toFixed(2)}
                        </Text>
                      </View>
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

                {/* Total Amount */}
                <View style={tw`border-t pt-2 mt-2`}>
                  <Text style={tw`text-lg font-bold text-right`}>
                    Grand Total: ₹{items
                      .reduce((sum, item) => sum + item.quantity * item.price_per_unit, 0)
                      .toFixed(2)}
                  </Text>
                </View>
              </View>
            )}

            <View style={tw`mb-4`}>
              <Text style={tw`text-sm mb-2 font-medium text-gray-700`}>Description</Text>
              <Input
                multiline
                placeholder="Other Details...."
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </ScrollView>
        </View>

        {/* Sticky Submit Button */}
        <View style={tw`border-t pt-4 bg-white`}>
          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={!isFormValid}
            loading={isPending}
          >
            {isPending ? 'Creating...' : 'Submit Purchase Order'}
          </Button>
        </View>
      </View>
    </SidebarLayout>
  );
};

export default CreatePurchase;