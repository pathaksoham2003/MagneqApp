import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { tw } from '../App';
import { logoutUser } from '../reducer/authSlice';
import { clearItem } from '../utils/localStorage';
import MagneqIcon from "../assets/images/Logo_Icon.png";
import { themeBackground, themeColorText } from '../utils/helper';

const SCREEN_WIDTH = Dimensions.get('window').width;

const menuItems = [
  { label: 'Dashboard', icon: 'grid-outline' },
  { label: 'Production', icon: 'cube-outline' },
  { label: 'Sales', icon: 'file-tray-full-outline' },
  { label: 'Purchase', icon: 'document-outline' },
  { label: 'Quality', icon: 'analytics-outline' },
];

const SidebarLayout = ({ children, title = 'Magneq', onLogout }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const drawerAnim = useState(new Animated.Value(-SCREEN_WIDTH * 0.75))[0];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [active, setActive] = useState('Dashboard');

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
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
    if (onLogout) onLogout();
  };

  return (
    <View style={tw`flex-1 ${themeColorText}`}>
      {/* Header */}
      <View
        style={tw`flex-row items-center justify-between pt-10 pb-4 px-4 ${themeColorText}`}
      >
        <TouchableOpacity onPress={openDrawer}>
          <Text style={tw`text-white text-3xl  ${themeColorText}`}>☰</Text>
        </TouchableOpacity>
        <View style={tw`flex flex-row`}>
          <Image source={MagneqIcon}/>
          <Text style={tw`text-white text-3xl ml-3  ${themeColorText}`}>{title}</Text>
        </View>
        <View style={tw`flex-row`}>
        <TouchableOpacity onPress={openDrawer}>
          <Text style={tw`text-white text-3xl  ${themeColorText}`}>...</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openDrawer}>
          <Text style={tw`text-white text-3xl  ${themeColorText}`}> ...</Text>
        </TouchableOpacity>

        </View>
      </View>

      {/* Main content */}
      <View style={tw`flex-1`}>{children}</View>

      {/* Backdrop */}
      {drawerOpen && (
        <TouchableWithoutFeedback onPress={closeDrawer}>
          <View
            style={tw`absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-20`}
          />
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
          <Image source={MagneqIcon}/>
          <Text style={tw`text-2xl font-bold ml-3`}>Magneq</Text>
        </View>

        {/* Menu Header */}
        <Text style={tw`text-gray-400 mb-3`}>MENU</Text>

        {/* Menu Items */}
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
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#374151"
            style={tw`mr-2`}
          />
          <Text style={tw`text-lg font-medium`}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default SidebarLayout;
