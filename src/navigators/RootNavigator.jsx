import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from '@react-navigation/drawer';

import Login from "../screens/Login";
import Dashboard from "../screens/Dashboard";
import Profile from "../screens/Profile";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

console.log(Drawer)

const DrawerNavigation = () => (
  <Drawer.Navigator
    screenOptions={{
      swipeEnabled: false, // disable gestures
      headerShown: true,
    }}
  >
    <Drawer.Screen name="Dashboard" component={Dashboard} />
    <Drawer.Screen name="Profile" component={Profile} />
  </Drawer.Navigator>
);

const RootNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <Stack.Screen name="Login">
          {(props) => <Login {...props} onLogin={() => setIsLoggedIn(true)} />}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Main" component={DrawerNavigation} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
