import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  FlatList,
  SafeAreaView,
} from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";

const LoginScreen = ({ navigation ,onLogin}) => {
  const dispatch = useDispatch();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
    active: false,
  });

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const user = useSelector(selectAuth);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data?.data?.token) {
        dispatch(loginUser(data.data));
        // Use react-navigation or any route jump
        onLogin()
      } else {
        console.error("Invalid credentials");
      }
    },
    onError: (err) => {
      console.error("Login failed:", err?.response?.data || err.message);
      console.log(err)
    },
  });

  const handleSubmit = () => {
    mutation.mutate(formData);
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <Image
        source={require("../../assets/images/loginPageBGImage.png")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      <Animatable.View
        animation="fadeIn"
        duration={800}
        style={[
          tw`flex-1 justify-center items-center px-6`,
          { backgroundColor: "rgba(255,255,255,0.0)" },
        ]}
      >
        <Animatable.View
          animation="fadeInUp"
          delay={300}
          duration={1000}
          style={[
            tw`w-full p-6 rounded-2xl`,
            { backgroundColor: "rgba(255,255,255,0.1)" },
          ]}
        >
          <Animatable.Image
            animation="fadeInDown"
            delay={400}
            source={require("../../assets/images/black_logo.png")}
            style={tw`w-45 h-45 mx-auto mb-4`}
            resizeMode="contain"
          />
          <Text style={tw`text-xl font-bold text-white text-center mb-4`}>
            Sign In
          </Text>

          <Text style={tw`text-white mb-1`}>Username</Text>
          <TextInput
            value={formData.username}
            onChangeText={(text) => handleChange("username", text)}
            placeholder="Enter your username"
            placeholderTextColor="#444"
            style={tw`border border-gray-300 rounded-md px-3 h-10 text-black bg-white/80`}
          />

          <Text style={tw`text-white mt-4 mb-1`}>Password</Text>
          <TextInput
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
            placeholder="Enter your password"
            placeholderTextColor="#444"
            secureTextEntry
            style={tw`border border-gray-300 rounded-md px-3 h-10 text-black bg-white/80`}
          />

          <Text style={tw`text-white mt-4 mb-1`}>Role</Text>
          <CustomDropdown
            value={formData.role}
            onValueChange={(val) => handleChange("role", val)}
            options={[
              { label: "Admin", value: "ADMIN" },
              { label: "Developer", value: "DEVELOPER" },
              { label: "Sales", value: "SALES" },
            ]}
            placeholder="Select Role"
          />

          <View style={tw`flex-row items-center mt-4`}>
            <TouchableOpacity
              onPress={() => handleChange("active", !formData.active)}
              style={[
                tw`w-4 h-4 border border-gray-400 rounded mr-2`,
                formData.active && { backgroundColor: "#333" },
              ]}
            />
            <Text style={tw`text-white`}>Active</Text>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            style={tw`mt-6 bg-blue-600 rounded-full h-10 justify-center items-center`}
          >
            <Text style={tw`text-white font-semibold`}>Login</Text>
          </TouchableOpacity>
        </Animatable.View>
      </Animatable.View>
    </SafeAreaView>
  );
};

const CustomDropdown = ({ value, onValueChange, options, placeholder }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={tw`border border-gray-300 h-10 rounded-md justify-center px-3 bg-white/80`}
      >
        <Text style={tw`text-black text-sm`}>
          {selectedLabel || placeholder || "Select an option"}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          activeOpacity={1}
          style={tw`flex-1 justify-center items-center bg-black/50`}
        >
          <TouchableOpacity activeOpacity={1} style={tw`bg-white rounded-md p-3 w-64`}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}
                  style={tw`p-2 border-b border-gray-300`}
                >
                  <Text style={tw`text-black text-sm`}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default LoginScreen;
