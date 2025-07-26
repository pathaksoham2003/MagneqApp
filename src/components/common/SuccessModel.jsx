import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useTheme from '../../hooks/useTheme';

const SuccessModel = ({ visible, onClose, message }) => {
  const { tw } = useTheme();
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View
        style={tw`flex-1 justify-center items-center bg-black bg-opacity-40`}
      >
        <View
          style={tw`bg-white rounded-2xl p-6 w-80 items-center relative border border-green-400`}
        >
          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            style={tw`absolute top-3 right-3`}
          >
            <Ionicons name="close" size={20} color="gray" />
          </TouchableOpacity>

          {/* Success Icon */}
          <View style={tw`bg-green-100 p-4 rounded-full mb-4`}>
            <Ionicons name="checkmark-circle" size={64} color="#22c55e" />
          </View>

          {/* Message */}
          <Text style={tw`text-center text-base font-semibold text-gray-800`}>
            {message || 'Congratulations, Ticket Created Successfully'}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModel;
