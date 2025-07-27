import { useState } from 'react';
import useTheme from '../../hooks/useTheme';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

const Dropdown = ({ label, data, value, setValue }) => {
  const [open, setOpen] = useState(false);
  const { tw } = useTheme();

  return (
    <View style={tw`mb-3 relative`}>
      <Text style={tw`mb-1 text-sm text-gray-700`}>{label}</Text>

      <TouchableOpacity
        style={tw`border border-gray-300 rounded p-3 bg-white`}
        onPress={() => setOpen(!open)}
      >
        <Text style={tw`text-gray-900`}>
          {value ? value.toString() : `Select ${label}`}
        </Text>
      </TouchableOpacity>

      {open && (
        <View
          style={tw`absolute top-20 left-0 right-0 border border-gray-300 rounded bg-white z-50 max-h-60`}
        >
          <ScrollView>
            {data.map(item => (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  setValue(item);
                  setOpen(false);
                }}
                style={tw`p-2 border-b border-gray-100`}
              >
                <Text style={tw`text-gray-800`}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default Dropdown;
