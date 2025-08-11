import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
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

import Login from '../screens/Login';
import Dashboard from '../screens/Dashboard';
import Production from '../screens/Production';
import Sales from '../screens/Sales';
import Purchase from '../screens/Purchase';
import CreatePurchase from '../screens/Purchase/CreatePurchase';
import CreateSales from '../screens/Sales/CreateSales';
import ViewProduction from '../screens/Production/ViewProduction';
import Quality from '../screens/Quality';
import ViewSales from '../screens/Sales/ViewSales';
import Stores from '../screens/Stores';
import CreateTicket from '../screens/Quality/CreateTicket';
import TicketDetails from '../screens/Quality/TicketDetails';
import RawMaterialDetail from '../screens/Stores/RawMaterialDetail';
import AddStock from '../screens/Stores/AddStock';
import PurchaseDetail from '../screens/Purchase/PurchaseDetail';
import TrackOrder from '../screens/TrackOrder/TrackOrder';
import CreatePRO from '../screens/Production/CreatePRO';
import VendorPurchases from '../screens/Purchase/VendorPurchases';
import TrackVendors from '../screens/Purchase/TrackVendors';
import SplashScreen from '../screens/SplashScreen';

import { logoutUser, selectAuth } from '../reducer/authSlice';
import { clearItem } from '../utils/localStorage';
import MagneqIcon from '../assets/images/Logo_Icon.png';
import { themeBackground, themeColorText } from '../utils/helper';
import { useAppColorScheme } from 'twrnc';
import useTheme from '../hooks/useTheme';
import ManageFinishedGood from '../screens/DeveloperPanel/ManageFinishedGood';
import ManageRawMaterials from '../screens/DeveloperPanel/ManageRawMaterials';
import ManageSuppliers from '../screens/DeveloperPanel/ManageSuppliers';
import ManageUsers from '../screens/DeveloperPanel/ManageUsers';
import ManageCustomers from '../screens/DeveloperPanel/ManageCustomers';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const CustomHeader = ({
  title = 'Magneq',
  navigation,
  canGoBack = false,
  onLogout,
}) => {
  const { tw } = useTheme();
  const [colorScheme, toggleColorScheme, setColorScheme] =
    useAppColorScheme(tw);
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
      <View
        style={tw`flex-row items-center justify-between pt-2 pb-4 px-4 ${themeColorText}`}
      >
        <TouchableOpacity onPress={canGoBack ? goBack : openDrawer}>
          {canGoBack ? (
            <Ionicons name="arrow-back" size={28} color="white" />
          ) : (
            <Text style={tw`text-white text-3xl ${themeColorText}`}>☰</Text>
          )}
        </TouchableOpacity>

        <View style={tw`flex flex-row items-center`}>
          <Image source={MagneqIcon} style={tw`w-8 h-8`} />
          <Text
            style={tw`text-white text-2xl ml-3 ${themeColorText} font-semibold`}
          >
            {title}
          </Text>
        </View>

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

// Custom Sidebar (unchanged)
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

  const navigateTo = screen => {
  setActive(screen);
  if (screen === 'Stores') {
    navigation.navigate(screen, { class_type: 'A' });
  } else {
    navigation.navigate(screen);
  }
};


  // Role-based menu items generation
  const getMenuItems = () => {
    if (user?.route?.role === 'ADMIN') {
      return [
        { label: 'Dashboard', icon: 'grid-outline' },
        { label: 'Sales', icon: 'file-tray-full-outline' },
        { label: 'Production', icon: 'cube-outline' },
        { label: 'Stores', icon: 'storefront-outline' },
        { label: 'Purchase', icon: 'document-outline' },
        { label: 'Quality', icon: 'analytics-outline' },
      ];
    } else if (user?.route?.role === 'DEVELOPER') {
      return [
        { label: 'ManageFinishedGood', icon: 'cube-outline' },
        { label: 'ManageRawMaterials', icon: 'storefront-outline' },
        { label: 'ManageVendors', icon: 'document-outline' },
        { label: 'ManageUsers', icon: 'analytics-outline' },
        { label: 'ManageCustomers', icon: 'grid-outline' },
      ];
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
        <View style={tw`flex-row items-center mb-8 mt-4`}>
          <Image source={MagneqIcon} style={tw`w-8 h-8`} />
          <Text style={tw`text-2xl font-bold ml-3 text-gray-800`}>Magneq</Text>
        </View>

        <Text style={tw`text-gray-400 mb-3 text-sm font-medium`}>MENU</Text>

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

// === Role-based Drawer Navigators ===

// Admin Drawer
const AdminDrawer = ({ onLogout, initialRouteName }) => (
  <Drawer.Navigator
    initialRouteName={initialRouteName || 'Dashboard'}
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
      drawerStyle: { width: '75%' },
    })}
    drawerContent={props => <CustomSidebar {...props} onLogout={onLogout} />}
  >
    <Drawer.Screen
      name="Dashboard"
      options={{ drawerLabel: 'Dashboard', title: 'MAGNEQ' }}
    >
      {props => <Dashboard {...props} onLogout={onLogout} />}
    </Drawer.Screen>

    <Drawer.Screen
      name="Sales"
      options={{ drawerLabel: 'Sales', title: 'MAGNEQ' }}
    >
      {props => <Sales {...props} onLogout={onLogout} />}
    </Drawer.Screen>

    <Drawer.Screen
      name="Production"
      options={{ drawerLabel: 'Production', title: 'MAGNEQ' }}
    >
      {props => <Production {...props} onLogout={onLogout} />}
    </Drawer.Screen>

    <Drawer.Screen
      name="Stores"
      component={Stores}
      options={{ drawerLabel: 'Stores', title: 'MAGNEQ' }}
    />

    <Drawer.Screen
      name="Purchase"
      component={Purchase}
      options={{ drawerLabel: 'Purchase', title: 'MAGNEQ' }}
    />

    <Drawer.Screen
      name="Quality"
      component={Quality}
      options={{ drawerLabel: 'Quality', title: 'MAGNEQ' }}
    />

    <Drawer.Screen
      name="TrackSales"
      component={TrackOrder}
      options={{ drawerLabel: 'Track Sales', title: 'MAGNEQ' }}
    />
  </Drawer.Navigator>
);

// Developer Drawer
const DeveloperDrawer = ({ onLogout, initialRouteName }) => (
  <Drawer.Navigator
    initialRouteName={initialRouteName || 'ManageCustomers'}
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
      drawerStyle: { width: '75%' },
    })}
    drawerContent={props => <CustomSidebar {...props} onLogout={onLogout} />}
  >
    <Drawer.Screen
      name="ManageFinishedGood"
      component={ManageFinishedGood}
      options={{ drawerLabel: 'Manage Finished Goods', title: 'MAGNEQ' }}
    />
    <Drawer.Screen
      name="ManageRawMaterials"
      component={ManageRawMaterials}
      options={{ drawerLabel: 'Manage Raw Materials', title: 'MAGNEQ' }}
    />
    <Drawer.Screen
      name="ManageVendors"
      component={ManageSuppliers}
      options={{ drawerLabel: 'Manage Vendors', title: 'MAGNEQ' }}
    />
    <Drawer.Screen
      name="ManageUsers"
      component={ManageUsers}
      options={{ drawerLabel: 'Manage Users', title: 'MAGNEQ' }}
    />
    <Drawer.Screen
      name="ManageCustomers"
      component={ManageCustomers}
      options={{ drawerLabel: 'Manage Customers', title: 'MAGNEQ' }}
    />
  </Drawer.Navigator>
);

// Customer Drawer
const CustomerDrawer = ({ onLogout, initialRouteName }) => (
  <Drawer.Navigator
    initialRouteName={initialRouteName || 'Sales'}
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
      drawerStyle: { width: '75%' },
    })}
    drawerContent={props => <CustomSidebar {...props} onLogout={onLogout} />}
  >
    <Drawer.Screen
      name="Sales"
      options={{ drawerLabel: 'Sales', title: 'MAGNEQ' }}
    >
      {props => <Sales {...props} onLogout={onLogout} />}
    </Drawer.Screen>

    <Drawer.Screen
      name="TrackSales"
      component={TrackOrder}
      options={{ drawerLabel: 'Track Sales', title: 'MAGNEQ' }}
    />

    <Drawer.Screen
      name="Quality"
      component={Quality}
      options={{ drawerLabel: 'Quality', title: 'MAGNEQ' }}
    />
  </Drawer.Navigator>
);

// Sales Drawer
const SalesDrawer = ({ onLogout, initialRouteName }) => (
  <Drawer.Navigator
    initialRouteName={initialRouteName || 'Sales'}
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
      drawerStyle: { width: '75%' },
    })}
    drawerContent={props => <CustomSidebar {...props} onLogout={onLogout} />}
  >
    <Drawer.Screen
      name="CreateSales"
      component={CreateSales}
      options={{ title: 'MAGNEQ' }}
    />

    <Drawer.Screen
      name="Sales"
      options={{ drawerLabel: 'Sales', title: 'MAGNEQ' }}
    >
      {props => <Sales {...props} onLogout={onLogout} />}
    </Drawer.Screen>

    <Drawer.Screen
      name="TrackSales"
      component={TrackOrder}
      options={{ drawerLabel: 'Track Sales', title: 'MAGNEQ' }}
    />

    <Drawer.Screen
      name="Quality"
      component={Quality}
      options={{ drawerLabel: 'Quality', title: 'MAGNEQ' }}
    />
  </Drawer.Navigator>
);

// Production Drawer
const ProductionDrawer = ({ onLogout, initialRouteName }) => (
  <Drawer.Navigator
    initialRouteName={initialRouteName || 'Production'}
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
      drawerStyle: { width: '75%' },
    })}
    drawerContent={props => <CustomSidebar {...props} onLogout={onLogout} />}
  >
    <Drawer.Screen
      name="Production"
      options={{ drawerLabel: 'Production', title: 'MAGNEQ' }}
    >
      {props => <Production {...props} onLogout={onLogout} />}
    </Drawer.Screen>

    <Drawer.Screen
      name="Quality"
      component={Quality}
      options={{ drawerLabel: 'Quality', title: 'MAGNEQ' }}
    />
  </Drawer.Navigator>
);

// Purchase Drawer
const PurchaseDrawer = ({ onLogout, initialRouteName }) => (
  <Drawer.Navigator
    initialRouteName={initialRouteName || 'Store'}
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
      drawerStyle: { width: '75%' },
    })}
    drawerContent={props => <CustomSidebar {...props} onLogout={onLogout} />}
  >
    <Drawer.Screen
      name="Store"
      component={Stores}
      options={{ drawerLabel: 'Stores', title: 'MAGNEQ' }}
    />

    <Drawer.Screen
      name="Purchase"
      component={Purchase}
      options={{ drawerLabel: 'Purchase', title: 'MAGNEQ' }}
    />

    <Drawer.Screen
      name="Quality"
      component={Quality}
      options={{ drawerLabel: 'Quality', title: 'MAGNEQ' }}
    />
  </Drawer.Navigator>
);

// Default Drawer for fallback (if role unknown)
const DefaultDrawer = AdminDrawer;

// === LoggedInStack updated to select drawer based on role ===

const LoggedInStack = ({ onLogout, initialRoute }) => {
  const user = useSelector(selectAuth);
  const role = user?.route?.role || '';

  // Pick drawer navigator component by role
  const getDrawerByRole = () => {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return AdminDrawer;
      case 'CUSTOMER':
        return CustomerDrawer;
      case 'SALES':
        return SalesDrawer;
      case 'PRODUCTION':
        return ProductionDrawer;
      case 'PURCHASE':
        return PurchaseDrawer;
      case 'DEVELOPER':
        return DeveloperDrawer;
      default:
        return DefaultDrawer;
    }
  };

  const DrawerComponent = getDrawerByRole();

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
      <Stack.Screen name="MainDrawer" options={{ headerShown: false }}>
        {props => (
          <DrawerComponent
            initialRouteName={initialRoute}
            {...props}
            onLogout={onLogout}
          />
        )}
      </Stack.Screen>

      {/* Other detail screens that are common */}
      <Stack.Screen
        name="CreatePurchase"
        component={CreatePurchase}
        options={{ title: 'MAGNEQ' }}
      />
      <Stack.Screen
        name="CreatePRO"
        component={CreatePRO}
        options={{ title: 'MAGNEQ' }}
      />
      <Stack.Screen
        name="TrackVendors"
        component={TrackVendors}
        options={{ title: 'MAGNEQ' }}
      />
      <Stack.Screen
        name="VendorPurchases"
        component={VendorPurchases}
        options={{ title: 'MAGNEQ' }}
      />

      <Stack.Screen
        name="PurchaseDetail"
        component={PurchaseDetail}
        options={{ title: 'MAGNEQ' }}
      />

      <Stack.Screen
        name="RawMaterialDetail"
        component={RawMaterialDetail}
        options={{ title: 'MAGNEQ' }}
      />

      <Stack.Screen
        name="AddStock"
        component={AddStock}
        options={{ title: 'MAGNEQ' }}
      />

      <Stack.Screen
        name="CreateSales"
        component={CreateSales}
        options={{ title: 'MAGNEQ' }}
      />

      <Stack.Screen
        name="ViewSales"
        component={ViewSales}
        options={{ title: 'MAGNEQ' }}
      />

      <Stack.Screen
        name="ViewProduction"
        component={ViewProduction}
        options={{ title: 'MAGNEQ' }}
      />

      <Stack.Screen
        name="CreateQuality"
        component={CreateTicket}
        options={{ title: 'MAGNEQ' }}
      />

      <Stack.Screen
        name="CreateTicket"
        component={CreateTicket}
        options={{ title: 'MAGNEQ' }}
      />

      <Stack.Screen
        name="TicketDetails"
        component={TicketDetails}
        options={{ title: 'MAGNEQ' }}
      />
    </Stack.Navigator>
  );
};

// RootNavigator remains mostly the same
const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initialRoute, setInitialRoute] = useState('');

  const handleLogin = route => {
    if (route && route.trim() !== '') {
      setInitialRoute(route);
    }
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setInitialRoute('Dashboard');
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoading ? (
        <Stack.Screen name="Splash">
          {props => (
            <SplashScreen
              {...props}
              setIsLoading={setIsLoading}
              setIsLoggedIn={setIsLoggedIn}
              initialRoute={initialRoute}
              setInitialRoute={setInitialRoute}
            />
          )}
        </Stack.Screen>
      ) : !isLoggedIn ? (
        <Stack.Screen name="Login">
          {props => <Login {...props} onLogin={handleLogin} />}
        </Stack.Screen>
      ) : initialRoute ? (
        <Stack.Screen name="App">
          {props => (
            <LoggedInStack
              {...props}
              initialRoute={initialRoute}
              onLogout={handleLogout}
            />
          )}
        </Stack.Screen>
      ) : null}
    </Stack.Navigator>
  );
};

export default RootNavigator;
