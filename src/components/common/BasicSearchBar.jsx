// components/BasicSearchBar.js
import React, { useState } from "react";
import { View, TextInput, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import tw from "twrnc";

const BasicSearchBar = ({ placeholder, style, onChangeText, value }) => {
  const [error, setError] = useState("");

  return (
    <View style={[tw`flex flex-col gap-1`, style]}>
      <View style={tw`flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-white shadow-sm`}>
        <Icon name="search" size={20} color="#555" style={tw`mr-2`} />
        <TextInput
          style={tw`flex-1 text-sm text-black`}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={(text) => {
            setError("");
            onChangeText?.(text);
          }}
        />
      </View>
      {error ? <Text style={tw`text-red-500 text-xs`}>{error}</Text> : null}
    </View>
  );
};

export default BasicSearchBar;
