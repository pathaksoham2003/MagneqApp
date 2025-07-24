import React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDeviceContext, useAppColorScheme } from 'twrnc';
import { tw } from '../../App';
const Dashbord = () => {
  const navigation = useNavigation();

  useDeviceContext(tw, {
    observeDeviceColorSchemeChanges: false,
    initialColorScheme: `light`, 
  });

  const [colorScheme, toggleColorScheme, setColorScheme] =
    useAppColorScheme(tw);

    console.log(colorScheme)
    console.log(toggleColorScheme)
    console.log(setColorScheme)

  return (
    <View
      style={tw`flex-1 justify-center items-center bg-secondary`}
    >
      <Text style={tw`text-2xl mb-5 text-white`}>Dashboard</Text>
      <View style={tw`w-40`}>
        <Button title="Open Drawer" onPress={() => navigation.openDrawer()} />
      </View>
      <TouchableOpacity onPress={toggleColorScheme}>
        <Text style={tw`text-black dark:text-white`}>Switch Color Scheme</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Dashbord;
