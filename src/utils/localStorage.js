import AsyncStorage from "@react-native-async-storage/async-storage"


export const setItem = async (key,value) => {
    return await AsyncStorage.setItem(key,value);
}

export const getItem = async(key) => {
    return await AsyncStorage.getItem(key);
}
export const clearItem = async() => {
    return await AsyncStorage.clear();
}