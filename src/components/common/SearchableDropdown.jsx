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
    <View style={tw`${containerStyle} relative ${open ? 'z-50' : 'z-10'}`}>
      {/* This overlay will prevent parent scrolling when dropdown is open */}
      {open && (
        <View 
          style={tw`absolute inset-0 bg-transparent z-40`}
          pointerEvents={open ? 'auto' : 'none'}
          onTouchStart={() => setOpen(false)}
        />
      )}
      
      {/* Selected Box */}
      <TouchableOpacity
        onPress={() => setOpen((prev) => !prev)}
        style={tw`border border-gray-300 rounded-md bg-white px-3 py-2 relative z-10`}
        activeOpacity={0.8}
      >
        <Text style={tw`text-sm text-gray-800`}>
          {selectedValue ? selectedValue[displayKey] : placeholder}
        </Text>
      </TouchableOpacity>

      {/* Dropdown */}
      {open && (
        <View
          style={tw`absolute top-14 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50 elevation-10`}
        >
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={placeholder}
            style={tw`px-3 py-2 text-sm border-b border-gray-200 bg-white relative z-50`}
          />

          <ScrollView 
            style={tw`max-h-40 bg-white`}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="always"
          >
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelect(item)}
                  style={tw`px-3 py-2 border-b border-gray-100 bg-white`}
                >
                  <Text style={tw`text-sm text-gray-800`}>
                    {item[displayKey]}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={tw`text-sm text-gray-500 text-center py-2 bg-white`}>
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