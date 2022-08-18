import { useState, useLayoutEffect, useContext } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { AntDesign } from '@expo/vector-icons';
import SettingsContext from "../contexts/SettingsContext";
import { colors } from "../consts/colors";

export default function Settings({ navigation, route }) {
    const [settings, setSettings] = useContext(SettingsContext);
    const [selectedFirstDayOfTheWeek, setSelectedFirstDayOfTheWeek] = useState(settings.firstDayOfTheWeek);
    const [selectedTheme, setSelectedTheme] = useState(settings.theme);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => 
            <TouchableOpacity 
              onPress={handleConfirm}
              title="Confirm"
            >
               <AntDesign name="checkcircle" size={24} color="#3a3" />
            </TouchableOpacity>
        })
    }, [navigation, selectedFirstDayOfTheWeek, selectedTheme])

    function handleConfirm() {
        setSettings((prevSettings) => { 
            return {...prevSettings, firstDayOfTheWeek: selectedFirstDayOfTheWeek, theme: selectedTheme}
        });
        navigation.navigate("main");
    }

    return (
        <View style={[styles.mainContainer, colors.secondColor[settings.theme]]}>
            <View style={styles.pickerContainer}>
                <Text style={colors.secondColor[settings.theme]}>Premier jour de la semaine</Text>
                <Picker
                    style={[styles.picker, colors.firstColor[settings.theme]]}
                    selectedValue={selectedFirstDayOfTheWeek}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedFirstDayOfTheWeek(itemValue)
                    }>
                    <Picker.Item label="Dimanche" value="0" />
                    <Picker.Item label="Lundi" value="1" />
                    <Picker.Item label="Mardi" value="2" />
                    <Picker.Item label="Mercredi" value="3" />
                    <Picker.Item label="Jeudi" value="4" />
                    <Picker.Item label="Vendredi" value="5" />
                    <Picker.Item label="Samedi" value="6" />
                </Picker>
            </View>
            <View style={styles.pickerContainer}>
                <Text style={colors.secondColor[settings.theme]}>Thème</Text>
                <Picker
                    style={[styles.picker, colors.firstColor[settings.theme]]}
                    selectedValue={selectedTheme}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedTheme(itemValue)
                    }>
                    <Picker.Item label="Clair" value="light" />
                    <Picker.Item label="Sombre" value="dark" />
                </Picker>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        display: "flex",
        flex: 1,
    },
    pickerContainer: {
        marginHorizontal: 20,
        marginVertical: 10
    },
    picker: {
        backgroundColor: "#fff"
    }
})