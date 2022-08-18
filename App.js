import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './screens/MainScreen';
import EditDay from './screens/EditDay';
import Settings from "./screens/Settings";
import DataContext from './contexts/DataContext';
import SettingsContext from "./contexts/SettingsContext";
import { getSettings, getWeeksData, storeSettings, storeWeeksData } from './utils/localstorage';

export default function App() {
  const [data, setData] = useState([]);
  const [dataChanged, setDataChanged] = useState(false);
  const [localDataLoading, setLocalDataLoading] = useState(true);

  const [settings, setSettings] = useState({ firstDayOfTheWeek: "0", theme: "light" });

  const Stack = createNativeStackNavigator();

  useEffect(() => {
    let storedData;
    async function fetchLocalData() {
      storedData = await getWeeksData();
      if(storedData) {
        setData(storedData);
      }
      setLocalDataLoading(false);
    }

    let storedSettings;
    async function fetchLocalSettings() {
      storedSettings = await getSettings();
      if(storedSettings) {
        setSettings((previousSettings) => ({ ...previousSettings, storedSettings }));
      }
    }
    fetchLocalData();
    fetchLocalSettings();
  }, []);

  useEffect(() => {
    async function storeLocalData() {
      await storeWeeksData(data);
      setDataChanged(false);
    }
    if(dataChanged) storeLocalData();
  }, [dataChanged])

  useEffect(() => {
    async function storeNewSettings() {
      await storeSettings(settings);
    }
    storeNewSettings();
  }, [settings.firstDayOfTheWeek, settings.theme])

  return (
    <SettingsContext.Provider value={[settings, setSettings]}>
      <DataContext.Provider value={{ data, setData, dataChanged, setDataChanged, localDataLoading }}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: "#333"
              }
            }}
          >
            <Stack.Screen 
              name="main"
              component={MainScreen}
              options={{
                headerTitleAlign: "center"
              }}
            />
            <Stack.Screen 
              name="editDay"
              component={EditDay}
              options={{
                headerTitleAlign: "center"
              }}
            />
            <Stack.Screen 
              name="settings"
              component={Settings}
              options={{
                title: "Paramètres",
                headerTitleAlign: "center",
                headerTintColor: "#eee",
                headerTitleStyle: {
                  color: "#eee"
                }
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="light" />
      </DataContext.Provider>
    </SettingsContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
