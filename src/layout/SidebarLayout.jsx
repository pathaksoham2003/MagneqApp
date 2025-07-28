import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { logoutUser, selectAuth } from '../reducer/authSlice';
import { clearItem } from '../utils/localStorage';
import MagneqIcon from '../assets/images/Logo_Icon.png';
import { themeBackground, themeColorText } from '../utils/helper';
import { useAppColorScheme } from 'twrnc';
import useTheme from '../hooks/useTheme';

const SCREEN_WIDTH = Dimensions.get('window').width;

const menuItems = [
  { label: 'Dashboard', icon: 'grid-outline' },
  { label: 'Sales', icon: 'file-tray-full-outline' },
  { label: 'Production', icon: 'cube-outline' },
  { label: 'Stores', icon: 'storefront-outline' },
  { label: 'Purchase', icon: 'document-outline' },
  { label: 'Quality', icon: 'analytics-outline' },
];

const SidebarLayout = ({ children, title = 'Magneq', onLogout }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { tw } = useTheme();
  const user = useSelector(selectAuth);

  const drawerAnim = useState(new Animated.Value(-SCREEN_WIDTH * 0.75))[0];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [active, setActive] = useState('Dashboard');
  const [colorScheme, toggleColorScheme, setColorScheme] = useAppColorScheme(tw);
  const [current, setCurrent] = useState('light');

  const toggleColor = () => {
    setColorScheme(current === 'light' ? 'dark' : 'light');
    setCurrent(current === 'light' ? 'dark' : 'light');
  };

  const openDrawer = () => {
    Animated.timing(drawerAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setDrawerOpen(true));
  };

  const closeDrawer = () => {
    Animated.timing(drawerAnim, {
      toValue: -SCREEN_WIDTH * 0.75,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setDrawerOpen(false));
  };

  const navigateTo = screen => {
    setActive(screen);
    closeDrawer();
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: screen }],
      });
    }, 250);
  };

  const handleLogout = async () => {
    dispatch(logoutUser());
    clearItem();
    onLogout();
  };

  // 🔥 Dynamic menuItems based on role
  const getMenuItems = () => {
    if (user?.route?.role === 'ADMIN') {
      return user.route.sidebar.map(label => {
        const iconsMap = {
          dashboard: 'grid-outline',
          sales: 'file-tray-full-outline',
          production: 'cube-outline',
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
        { label: 'CreateSales', icon: 'add-circle-outline' },
        { label: 'TrackSales', icon: 'locate-outline' },
      ];
    } else {
      return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <View style={tw`flex-1 ${themeColorText}`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between pt-10 pb-4 px-4 ${themeColorText}`}>
        <TouchableOpacity onPress={openDrawer}>
          <Text style={tw`text-white text-3xl ${themeColorText}`}>☰</Text>
        </TouchableOpacity>
        <View style={tw`flex flex-row`}>
          <Image source={MagneqIcon} />
          <Text style={tw`text-white text-3xl ml-3 ${themeColorText}`}>{title}</Text>
        </View>
        <View style={tw`flex-row`}>
          <TouchableOpacity onPress={openDrawer}>
            <Text style={tw`text-white text-3xl ${themeColorText}`}>...</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleColor}>
            <Text style={tw`text-white text-3xl ${themeColorText}`}> ...</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main content */}
      <View style={tw`flex-1`}>{children}</View>

      {/* Backdrop */}
      {drawerOpen && (
        <TouchableWithoutFeedback onPress={closeDrawer}>
          <View style={tw`absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-10`} />
        </TouchableWithoutFeedback>
      )}

      {/* Animated Sidebar */}
      <Animated.View
        style={[
          tw`absolute top-0 bottom-0 bg-white p-6`,
          {
            width: SCREEN_WIDTH * 0.75,
            transform: [{ translateX: drawerAnim }],
            elevation: 10,
            zIndex: 30,
          },
        ]}
      >
        {/* Logo */}
        <View style={tw`flex-row items-center mb-8`}>
          <Image source={MagneqIcon} />
          <Text style={tw`text-2xl font-bold ml-3`}>Magneq</Text>
        </View>

        <Text style={tw`text-gray-400 mb-3`}>MENU</Text>

        {/* Render menuItems */}
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.label}
            onPress={() => navigateTo(item.label)}
            style={[
              tw`flex-row items-center rounded-xl px-3 py-3 mb-2`,
              active === item.label && tw`bg-blue-100`,
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

        <View style={tw`flex-1`} />

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={tw`border border-gray-300 p-3 rounded-xl flex-row items-center justify-center`}
        >
          <Ionicons name="log-out-outline" size={20} color="#374151" style={tw`mr-2`} />
          <Text style={tw`text-lg font-medium`}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default SidebarLayout