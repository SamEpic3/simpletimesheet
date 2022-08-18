import AsyncStorage from '@react-native-async-storage/async-storage';

export const getWeeksData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('weeksData')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      Alert(e);
    }
  }

export const storeWeeksData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('weeksData', jsonValue)
    } catch (e) {
      Alert(e);
    }
  }

export const getSettings = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('settings')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      Alert(e);
    }
  }

export const storeSettings = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('settings', jsonValue)
    } catch (e) {
      Alert(e);
    }
  }