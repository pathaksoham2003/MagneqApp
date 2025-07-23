import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './DrawerNavigator';

const AppNavigation = () => (
  <NavigationContainer>
    <DrawerNavigator />
  </NavigationContainer>
);

export default AppNavigation;
