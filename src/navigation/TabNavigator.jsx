import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import StackNavigator from './StackNavigator';
import MenuScreen from '../screens/MenuScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createMaterialTopTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={StackNavigator} />
    <Tab.Screen name="Menu" component={MenuScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default TabNavigator;
