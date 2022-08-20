import { useState, useLayoutEffect, useContext } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Button } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import SettingsContext from "../contexts/SettingsContext";
import { colors } from "../consts/colors";
import Modal from "react-native-modal";

export default function Settings({ navigation, route }) {
    const [settings, setSettings] = useContext(SettingsContext);
    const [selectedFirstDayOfTheWeek, setSelectedFirstDayOfTheWeek] = useState(settings.firstDayOfTheWeek);
    const [selectedTheme, setSelectedTheme] = useState(settings.theme);
    const [modalVisible, setModalVisible] = useState("none")

    const daysOfTheWeekPickerData = [
        {label: "Dimanche", value: "0"},
        {label: "Lundi", value: "1"},
        {label: "Mardi", value: "2"},
        {label: "Mercredi", value: "3"},
        {label: "Jeudi", value: "4"},
        {label: "Vendredi", value: "5"},
        {label: "Samedi", value: "6"}
    ]

    const themePickerData = [
        {label: "Clair", value: "light"},
        {label: "Sombre", value: "dark"}
    ]

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
                <TouchableOpacity
                    style={[styles.picker, colors.firstColor[settings.theme]]}
                    title="test"
                    onPress={() => setModalVisible("firstDay")}
                >
                    <Text style={colors.firstColor[settings.theme]}>{daysOfTheWeekPickerData[selectedFirstDayOfTheWeek].label}</Text>
                    <AntDesign name="caretdown" size={10} color="#777" style={{marginRight: 10}} />
                </TouchableOpacity>
            </View>
            <View style={styles.pickerContainer}>
                <Text style={colors.secondColor[settings.theme]}>Thème</Text>
                <TouchableOpacity
                    style={[styles.picker, colors.firstColor[settings.theme]]}
                    title="test"
                    onPress={() => setModalVisible("theme")}
                >
                    <Text style={colors.firstColor[settings.theme]}>{themePickerData.find((item) => item.value === selectedTheme).label}</Text>
                    <AntDesign name="caretdown" size={10} color="#777" style={{marginRight: 10}} />
                </TouchableOpacity>
            </View>
            <Modal
                isVisible={modalVisible === "firstDay"}
                onBackButtonPress={() => setModalVisible("none")}
                onBackdropPress={() => setModalVisible("none")}
                backdropOpacity={0.7}
                animationIn="fadeIn"
                animationOut="fadeOut"
                backdropTransitionOutTiming={0}
            >
                        <View style={styles.modalContainer}>
                            {daysOfTheWeekPickerData.map(day => 
                                <TouchableOpacity 
                                    style={styles.modalItem} 
                                    key={day.value}
                                    onPress={() => {
                                        setSelectedFirstDayOfTheWeek(day.value);
                                        setModalVisible("none");
                                    }}
                                >
                                    <Text>{day.label}</Text>
                                </TouchableOpacity>
                            )}
                        </View>                        
            </Modal>
            <Modal
                isVisible={modalVisible === "theme"}
                onBackButtonPress={() => setModalVisible("none")}
                onBackdropPress={() => setModalVisible("none")}
                backdropOpacity={0.7}
                animationIn="fadeIn"
                animationOut="fadeOut"
                backdropTransitionOutTiming={0}
            >
                        <View style={styles.modalContainer}>
                            {themePickerData.map(theme => 
                                <TouchableOpacity 
                                    style={styles.modalItem} 
                                    key={theme.value}
                                    onPress={() => {
                                        setSelectedTheme(theme.value);
                                        setModalVisible("none");
                                    }}
                                >
                                    <Text>{theme.label}</Text>
                                </TouchableOpacity>
                            )}
                        </View>                        
            </Modal>
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
        paddingVertical: 17,
        paddingHorizontal: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    modalContainer: {
        borderRadius: 10,
        padding: 10,
        backgroundColor: "#ddd"
    },
    modalItem: {
        paddingVertical: 20
    }
})