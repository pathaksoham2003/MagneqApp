import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import useTheme from '../../hooks/useTheme';

const SearchableDropdown = ({
  data = [],
  selectedValue,
  onSelect,
  placeholder = 'Search...',
  displayKey = 'label',
  containerStyle = '',
}) => {
    const {tw} = useTheme();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    setFilteredData(
      search.trim() === ''
        ? data
        : data.filter((item) =>
            item[displayKey].toLowerCase().includes(search.toLowerCase())
          )
    );
  }, [search, data]);

  const handleSelect = (item) => {
    onSelect(item);
    setOpen(false);
    setSearch('');
  };

  return (
    <View style={tw`${containerStyle} relative z-50`}>
      {/* Selected Box */}
      <TouchableOpacity
        onPress={() => setOpen((prev) => !prev)}
        style={tw`border border-gray-300 rounded-md bg-white px-3 py-2`}
        activeOpacity={0.8}
      >
        <Text style={tw`text-sm text-gray-800`}>
          {selectedValue ? selectedValue[displayKey] : placeholder}
        </Text>
      </TouchableOpacity>

      {/* Dropdown */}
      {open && (
        <View
          style={tw`absolute top-14 w-full bg-white border border-gray-300 rounded-md shadow-md z-50`}
        >
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={placeholder}
            style={tw`px-3 py-2 text-sm border-b border-gray-200`}
          />

          <ScrollView style={tw`max-h-40`} keyboardShouldPersistTaps="handled">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelect(item)}
                  style={tw`px-3 py-2 border-b border-gray-100`}
                >
                  <Text style={tw`text-sm text-gray-800`}>
                    {item[displayKey]}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={tw`text-sm text-gray-500 text-center py-2`}>
                No results found
              </Text>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default SearchableDropdown;
