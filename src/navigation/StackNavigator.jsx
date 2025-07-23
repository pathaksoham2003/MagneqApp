import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import Header from '../components/common/Header';

const Stack = createStackNavigator();

const StackNavigator = ({ navigation }) => (
  <Stack.Navigator
    screenOptions={{
      header: () => (
        <Header
          onMenuPress={() => navigation.openDrawer()}
          onNotificationPress={() => {/* handle notification */}}
        />
      ),
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Details" component={DetailsScreen} />
  </Stack.Navigator>
);

export default StackNavigator;
