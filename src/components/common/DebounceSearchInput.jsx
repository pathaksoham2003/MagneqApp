// DebouncedSearchInput.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput } from 'react-native';
import useTheme from '../../hooks/useTheme';

const DebouncedSearchInput = ({
  value,
  onChangeText,
  onFocus,
  placeholder,
  searchFn,
  onSelect,
  renderResultItem,
  debounceDelay = 350
}) => {
  const { tw } = useTheme();
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (value.trim()) {
      setIsLoading(true);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(async () => {
        try {
          const results = await searchFn(value);
          setSearchResults(results);
          setShowResults(true);
        } catch (error) {
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      }, debounceDelay);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, searchFn, debounceDelay]);

  const handleSelect = (item) => {
    onSelect(item);
    setShowResults(false);
    setSearchResults([]);
  };

  const handleFocus = () => {
    if (onFocus) onFocus();
  };

  const renderResult = ({ item }) => (
    <TouchableOpacity
      style={tw`p-3 border-b border-gray-200 bg-white`}
      onPress={() => handleSelect(item)}
    >
      <Text style={tw`text-gray-800`}>
        {renderResultItem ? renderResultItem(item) : item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={tw`relative`}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        placeholder={placeholder}
        style={tw`border border-gray-300 rounded-md p-2 bg-white`}
      />
      
      {showResults && (
        <View style={tw`absolute top-full left-0 right-0 z-10 max-h-60 border border-gray-300 rounded-md bg-white shadow-lg`}>
          {isLoading ? (
            <View style={tw`p-3`}>
              <Text style={tw`text-gray-500`}>Searching...</Text>
            </View>
          ) : searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              renderItem={renderResult}
              keyExtractor={(item) => item._id}
              style={tw`max-h-60`}
            />
          ) : value.trim() ? (
            <View style={tw`p-3`}>
              <Text style={tw`text-gray-500`}>No results found</Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
};

export default DebouncedSearchInput;