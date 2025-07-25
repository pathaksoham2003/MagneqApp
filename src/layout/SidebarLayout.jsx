import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SCREEN_WIDTH = Dimensions.get('window').width;

const menuItems = [
  { label: 'Dashboard', icon: 'grid-outline' },
  { label: 'Production', icon: 'cube-outline' },
  { label: 'Sales', icon: 'file-tray-full-outline' },
  { label: 'Stores', icon: 'document-text-outline' },
  { label: 'Purchase', icon: 'document-outline' },
  { label: 'Quality', icon: 'albums-outline' },
];

const SidebarLayout = ({ children, title = 'App', onLogout }) => {
  const navigation = useNavigation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [active, setActive] = useState('Dashboard');

  const navigateTo = (screen) => {
    setDrawerOpen(false);
    setActive(screen);
    setTimeout(() => {
      navigation.replace(screen);
    }, 100);
  };

  return (
    <View style={tw`flex-1 mt-3 bg-white`}>
      {/* Header */}
      <View style={tw`flex-row items-center p-4 bg-blue-600`}>
        <TouchableOpacity onPress={() => setDrawerOpen(true)}>
          <Text style={tw`text-white text-3xl`}>☰</Text>
        </TouchableOpacity>
        <Text style={tw`text-white text-xl ml-4`}>{title}</Text>
      </View>

      {/* Main Content */}
      <View style={tw`flex-1`}>{children}</View>

      {/* Backdrop */}
      {drawerOpen && (
        <TouchableWithoutFeedback onPress={() => setDrawerOpen(false)}>
          <View
            style={tw`absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-10`}
          />
        </TouchableWithoutFeedback>
      )}

      {/* Sidebar */}
      {drawerOpen && (
        <View
          style={[
            tw`absolute top-0 bottom-0 left-0 bg-white p-6 z-20`,
            { width: SCREEN_WIDTH * 0.75, elevation: 10 },
          ]}
        >
          {/* Logo */}
          <View style={tw`flex-row items-center mb-8`}>
            <View style={tw`w-10 h-10 bg-blue-500 rounded-xl`} />
            <Text style={tw`text-2xl font-bold ml-3`}>Magneq</Text>
          </View>

          {/* Menu Header */}
          <Text style={tw`text-gray-400 mb-3`}>MENU</Text>

          {/* Menu Items */}
          {menuItems.map((item) => (
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

          {/* Spacer */}
          <View style={tw`flex-1`} />

          {/* Logout */}
          <TouchableOpacity
            onPress={onLogout}
            style={tw`border border-gray-300 p-3 rounded-xl flex-row items-center justify-center`}
          >
            <Ionicons name="log-out-outline" size={20} color="#374151" style={tw`mr-2`} />
            <Text style={tw`text-lg font-medium`}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default SidebarLayout;
