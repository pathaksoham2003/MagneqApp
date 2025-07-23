import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigator from './TabNavigator';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator screenOptions={{ headerShown: false }}>
    <Drawer.Screen name="Tabs" component={TabNavigator} />
    {/* Add more drawer screens here if needed */}
  </Drawer.Navigator>
);

export default DrawerNavigator;
