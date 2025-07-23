import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

const Header = ({ onMenuPress, onNotificationPress }) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
      <Feather name="menu" size={24} color="#222" />
    </TouchableOpacity>
    <View style={styles.titleContainer}>
      {/* <Image
        source={require('../../../assets/app-icon.png')}
        style={styles.appIcon}
      /> */}
      <Text style={styles.title}>Magneq</Text>
    </View>
    <TouchableOpacity style={styles.iconButton}>
      <Feather name="more-horizontal" size={24} color="#222" />
    </TouchableOpacity>
    <TouchableOpacity onPress={onNotificationPress} style={styles.iconButton}>
      <Ionicons name="notifications-outline" size={24} color="#222" />
      <View style={styles.badge} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  iconButton: {
    padding: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  appIcon: {
    width: 28,
    height: 28,
    marginRight: 8,
    borderRadius: 6,
    backgroundColor: '#5B6CFF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF7A00',
  },
});

export default Header;
