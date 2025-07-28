import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../hooks/useTheme';

const SuccessModal = ({ open, onClose }) => {
  const { tw } = useTheme();
  return (
    <Modal visible={open} transparent animationType="fade">
      <View style={tw`flex-1 bg-black/30 justify-center items-center`}>
        <View
          style={tw`bg-green-100 border border-green-500 rounded-2xl px-8 py-6 w-[350px] relative`}
        >
          <TouchableOpacity
            onPress={onClose}
            style={tw`absolute top-3 right-3`}
          >
            <Ionicons name="close" size={20} color="#999" />
          </TouchableOpacity>

          <Text style={tw`text-xl font-semibold text-[#222]`}>
            Congratulations, Stock{'\n'}
            added successfully
          </Text>

          <View style={tw`flex justify-center items-center mt-4`}>
            <MaterialIcons name="done-outline" size={45} color="#1A7F37" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;
