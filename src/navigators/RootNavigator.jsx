import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DrawerContentScrollView } from '@react-navigation/drawer';

import Login from '../screens/Login';
import Dashboard from '../screens/Dashboard';
import Production from '../screens/Production';
import Sales from '../screens/Sales';
import Purchase from '../screens/Purchase';
import CreatePurchase from '../screens/Purchase/CreatePurchase';
import CreateSales from '../screens/Sales/CreateSales';
import ViewProduction from '../screens/Production/ViewProduction';
import Quality from '../screens/Quality';
import CreateQuality from '../screens/Quality/CreateQuality';
import ViewSales from '../screens/Sales/ViewSales';
import Stores from '../screens/Stores';
import CreateTicket from '../screens/Quality/CreateTicket';
import TicketDetails from '../screens/Quality/TicketDetails';
import RawMaterialDetail from '../screens/Stores/RawMaterialDetail';
import AddStock from '../screens/Stores/AddStock';
import PurchaseDetail from '../screens/Purchase/PurchaseDetail';
import TrackOrder from "../screens/TrackOrder/TrackOrder";
import CreatePRO from '../screens/Production/CreatePRO';
import VendorPurchases from '../screens/Purchase/VendorPurchases';
import TrackVendors from '../screens/Purchase/TrackVendors';

import { logoutUser, selectAuth } from '../reducer/authSlice';
import { clearItem } from '../utils/localStorage';
import MagneqIcon from '../assets/images/Logo_Icon.png';
import { themeBackground, themeColorText } from '../utils/helper';
import { useAppColorScheme } from 'twrnc';
import useTheme from '../hooks/useTheme';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Custom Header Component
const CustomHeader = ({ title = 'Magneq', navigation, canGoBack = false, onLogout }) => {
  const { tw } = useTheme();
  const [colorScheme, toggleColorScheme, setColorScheme] = useAppColorScheme(tw);
  const [current, setCurrent] = useState('light');

  const toggleColor = () => {
    setColorScheme(current === 'light' ? 'dark' : 'light');
    setCurrent(current === 'light' ? 'dark' : 'light');
  };

  const openDrawer = () => {
    if (navigation?.openDrawer) {
      navigation.openDrawer();
    }
  };

  const goBack = () => {
    if (navigation?.goBack) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={tw`${themeBackground}`}>
      <View style={tw`flex-row items-center justify-between pt-2 pb-4 px-4 ${themeColorText}`}>
        {/* Left Icon - Menu or Back */}
        <TouchableOpacity onPress={canGoBack ? goBack : openDrawer}>
          {canGoBack ? (
            <Ionicons 
              name="arrow-back" 
              size={28} 
              color="white" 
            />
          ) : (
            <Text style={tw`text-white text-3xl ${themeColorText}`}>☰</Text>
          )}
        </TouchableOpacity>

        {/* Center - Logo and Title */}
        <View style={tw`flex flex-row items-center`}>
          <Image source={MagneqIcon} style={tw`w-8 h-8`} />
          <Text style={tw`text-white text-2xl ml-3 ${themeColorText} font-semibold`}>
            {title}
          </Text>
        </View>

        {/* Right Icons - Menu and Theme Toggle */}
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity onPress={() => {}} style={tw`mr-3`}>
            <Ionicons name="ellipsis-vertical" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleColor}>
            <Ionicons 
              name={current === 'light' ? 'moon-outline' : 'sunny-outline'} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Custom Sidebar Component
const CustomSidebar = ({ navigation, onLogout }) => {
  const dispatch = useDispatch();
  const { tw } = useTheme();
  const user = useSelector(selectAuth);
  const [active, setActive] = useState('Dashboard');

  const handleLogout = async () => {
    dispatch(logoutUser());
    clearItem();
    onLogout();
  };

  const navigateTo = (screen) => {
    setActive(screen);
    navigation.navigate(screen);
  };

  const getMenuItems = () => {
    if (user?.route?.role === 'ADMIN') {
      return user.route.sidebar.map(label => {
        const iconsMap = {
          dashboard: 'grid-outline',
          sales: 'file-tray-full-outline',
          production: 'cube-outline',
          stores: 'storefront-outline',
          store: 'storefront-outline',
          purchase: 'document-outline',
          quality: 'analytics-outline',
        };

        return {
          label: label.charAt(0).toUpperCase() + label.slice(1),
          icon: iconsMap[label.toLowerCase()] || 'apps-outline',
        };
      });
    } else if (user?.route?.role === 'CUSTOMER') {
      return [
        { label: 'Sales', icon: 'file-tray-full-outline' },
        { label: 'TrackSales', icon: 'locate-outline' },
        { label: 'Quality', icon: 'analytics-outline' },
      ];
    } else if (user?.route?.role === 'SALES') {
      return [
        { label: 'CreateSales', icon: 'add-circle-outline' },
        { label: 'Sales', icon: 'file-tray-full-outline' },
        { label: 'TrackSales', icon: 'locate-outline' },
        { label: 'Quality', icon: 'analytics-outline' },
      ];
    } else if (user?.route?.role === 'PRODUCTION') {
      return [
        { label: 'Production', icon: 'cube-outline' },
        { label: 'Quality', icon: 'analytics-outline' },
      ];
    } else if (user?.route?.role === 'PURCHASE') {
      return [
        { label: 'Stores', icon: 'storefront-outline' },
        { label: 'Store', icon: 'storefront-outline' },
        { label: 'Purchase', icon: 'document-outline' },
        { label: 'Quality', icon: 'analytics-outline' },
      ];
    } else {
      return [
        { label: 'Dashboard', icon: 'grid-outline' },
        { label: 'Sales', icon: 'file-tray-full-outline' },
        { label: 'Production', icon: 'cube-outline' },
        { label: 'Stores', icon: 'storefront-outline' },
        { label: 'Purchase', icon: 'document-outline' },
        { label: 'Quality', icon: 'analytics-outline' },
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <DrawerContentScrollView
      style={tw`flex-1 bg-white`}
      contentContainerStyle={tw`flex-1`}
    >
      <View style={tw`flex-1 p-6`}>
        {/* Logo Section */}
        <View style={tw`flex-row items-center mb-8 mt-4`}>
          <Image source={MagneqIcon} style={tw`w-8 h-8`} />
          <Text style={tw`text-2xl font-bold ml-3 text-gray-800`}>Magneq</Text>
        </View>

        <Text style={tw`text-gray-400 mb-3 text-sm font-medium`}>MENU</Text>

        {/* Menu Items */}
        <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.label}
              onPress={() => navigateTo(item.label)}
              style={[
                tw`flex-row items-center rounded-xl px-3 py-3 mb-2`,
                active === item.label && tw`bg-blue-50`,
              ]}
            >
              <Ionicons
                name={item.icon}
                size={22}
                color={active === item.label ? '#2563EB' : '#374151'}
                style={tw`mr-3`}
              />
              <Text
                style={[
                  tw`text-lg`,
                  active === item.label
                    ? tw`text-blue-600 font-semibold`
                    : tw`text-gray-800`,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* User Info */}
        {user && (
          <View style={tw`mt-4 p-3 bg-gray-50 rounded-xl`}>
            <Text style={tw`text-sm font-medium text-gray-800`}>
              {user.name || 'User'}
            </Text>
            <Text style={tw`text-xs text-gray-500`}>
              {user?.route?.role || 'Role'}
            </Text>
          </View>
        )}

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          style={tw`mt-4 border border-gray-300 p-3 rounded-xl flex-row items-center justify-center`}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#374151"
            style={tw`mr-2`}
          />
          <Text style={tw`text-lg font-medium text-gray-800`}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

// Drawer Navigator with Custom Header and Sidebar
const DrawerNavigator = ({ onLogout }) => {
  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        header: ({ route, options }) => (
          <CustomHeader
            title={options.title || route.name}
            navigation={navigation}
            canGoBack={false}
            onLogout={onLogout}
          />
        ),
        drawerType: 'front',
        drawerStyle: {
          width: '75%',
        },
      })}
      drawerContent={(props) => (
        <CustomSidebar {...props} onLogout={onLogout} />
      )}
    >
      <Drawer.Screen 
        name="Dashboard"
        options={{
          drawerLabel: 'Dashboard',
          title: 'Dashboard',
        }}
      >
        {props => <Dashboard {...props} onLogout={onLogout} />}
      </Drawer.Screen>
      
      <Drawer.Screen 
        name="Sales"
        options={{
          drawerLabel: 'Sales',
          title: 'Sales',
        }}
      >
        {props => <Sales {...props} onLogout={onLogout} />}
      </Drawer.Screen>
      
      <Drawer.Screen 
        name="Production"
        options={{
          drawerLabel: 'Production',
          title: 'Production',
        }}
      >
        {props => <Production {...props} onLogout={onLogout} />}
      </Drawer.Screen>
      
      <Drawer.Screen 
        name="Store" 
        component={Stores}
        options={{
          drawerLabel: 'Stores',
          title: 'Stores',
        }}
      />
      
      <Drawer.Screen 
        name="Purchase" 
        component={Purchase}
        options={{
          drawerLabel: 'Purchase',
          title: 'Purchase',
        }}
      />
      
      <Drawer.Screen 
        name="Quality" 
        component={Quality}
        options={{
          drawerLabel: 'Quality',
          title: 'Quality',
        }}
      />
      
      <Drawer.Screen 
        name="TrackSales" 
        component={TrackOrder}
        options={{
          drawerLabel: 'Track Sales',
          title: 'Track Sales',
        }}
      />
    </Drawer.Navigator>
  );
};

// Stack for detail screens with Custom Header
const LoggedInStack = ({ onLogout }) => {
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        header: ({ options }) => (
          <CustomHeader
            title={options.title || route.name}
            navigation={navigation}
            canGoBack={navigation.canGoBack()}
            onLogout={onLogout}
          />
        ),
      })}
    >
      <Stack.Screen 
        name="MainDrawer"
        options={{ headerShown: false }}
      >
        {props => <DrawerNavigator {...props} onLogout={onLogout} />}
      </Stack.Screen>
      
      <Stack.Screen 
        name="CreatePurchase" 
        component={CreatePurchase}
        options={{ title: 'Create Purchase' }}
      />
      
      <Stack.Screen 
        name="PurchaseDetail" 
        component={PurchaseDetail}
        options={{ title: 'Purchase Details' }}
      />
      
      <Stack.Screen 
        name="RawMaterialDetail" 
        component={RawMaterialDetail}
        options={{ title: 'Raw Material Details' }}
      />
      
      <Stack.Screen 
        name="AddStock" 
        component={AddStock}
        options={{ title: 'Add Stock' }}
      />
      
      <Stack.Screen 
        name="CreateSales" 
        component={CreateSales}
        options={{ title: 'Create Sales' }}
      />
      
      <Stack.Screen 
        name="ViewSales" 
        component={ViewSales}
        options={{ title: 'View Sales' }}
      />
      
      <Stack.Screen 
        name="ViewProduction" 
        component={ViewProduction}
        options={{ title: 'View Production' }}
      />
      
      <Stack.Screen 
        name="CreateQuality" 
        component={CreateTicket}
        options={{ title: 'Create Quality Check' }}
      />
      
      <Stack.Screen 
        name="CreateTicket" 
        component={CreateTicket}
        options={{ title: 'Create Ticket' }}
      />
      
      <Stack.Screen 
        name="TicketDetails" 
        component={TicketDetails}
        options={{ title: 'Ticket Details' }}
      />
    </Stack.Navigator>
  );
};

// Root Navigation
const RootNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <Stack.Screen name="Login">
          {props => <Login {...props} onLogin={handleLogin} />}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="App">
          {props => <LoggedInStack {...props} onLogout={handleLogout} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;