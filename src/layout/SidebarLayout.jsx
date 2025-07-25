import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { tw } from '../App';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../reducer/authSlice';
import { clearItem } from '../utils/localStorage';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SidebarLayout = ({ children, title = 'App', onLogout }) => {
  const navigation = useNavigation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerAnim = useState(new Animated.Value(-SCREEN_WIDTH * 0.75))[0];
  const dispatch = useDispatch();
  const navigate = useNavigation();

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
    closeDrawer();
    setTimeout(() => {
      navigation.replace(screen);
    }, 250); // Delay to allow drawer close animation // <-- use replace here instead of navigate
  };

  const handleLogout = async () => {
    dispatch(logoutUser());
    clearItem();
    navigate.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
    onLogout()
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`flex-row items-center p-4 bg-blue-600`}>
        <TouchableOpacity onPress={openDrawer}>
          <Text style={tw`text-white text-2xl`}>☰</Text>
        </TouchableOpacity>
        <Text style={tw`text-white text-xl ml-4`}>{title}</Text>
      </View>

      {/* Main Screen */}
      <View style={tw`flex-1`}>{children}</View>

      {/* Backdrop */}
      {drawerOpen && (
        <TouchableWithoutFeedback onPress={closeDrawer}>
          <View
            style={tw`absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-20`}
          />
        </TouchableWithoutFeedback>
      )}

      {/* Drawer */}
      <Animated.View
        style={[
          tw`absolute top-0 bottom-0 bg-white`,
          {
            width: SCREEN_WIDTH * 0.75,
            transform: [{ translateX: drawerAnim }],
            elevation: 20,
            zIndex: 30,
          },
        ]}
      >
        <View style={tw`flex-1 p-6`}>
          <Text style={tw`text-2xl font-bold mb-6`}>Menu</Text>

          <TouchableOpacity onPress={closeDrawer} style={tw`mb-4`}>
            <Text style={tw`text-blue-600 text-lg`}>Close</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`mb-3`}
            onPress={() => navigateTo('Dashboard')}
          >
            <Text style={tw`text-gray-800 text-lg`}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`mb-3`}
            onPress={() => navigateTo('Production')}
          >
            <Text style={tw`text-gray-800 text-lg`}>Production</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`mb-3`}
            onPress={() => navigateTo('Sales')}
          >
            <Text style={tw`text-gray-800 text-lg`}>Sales</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`mb-3`}
            onPress={() => navigateTo('Purchase')}
          >
            <Text style={tw`text-gray-800 text-lg`}>Purchase</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`mb-3`}
            onPress={() => navigateTo('Quality')}
          >
            <Text style={tw`text-gray-800 text-lg`}>Quality</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout}>
            <Text style={tw`text-red-500 text-lg`}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default SidebarLayout;
