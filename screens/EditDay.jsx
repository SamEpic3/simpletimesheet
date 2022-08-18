import { useLayoutEffect, useState, useRef, useContext } from "react";
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from "react-native";
import DataContext from "../contexts/DataContext";
import { AntDesign } from '@expo/vector-icons'; 
import SettingsContext from "../contexts/SettingsContext";
import { colors } from "../consts/colors";

export default function EditDay({ navigation, route }) {
    const { setData, setDataChanged } = useContext(DataContext);
    const [settings, setSettings] = useContext(SettingsContext)

    const hoursInputRef = useRef(null);
    const noteInputRef = useRef(null);

    const [hours, setHours] = useState(route.params.hours.toString());
    const [note, setNote] = useState(route.params.note.toString());

    function handleConfirm() {
        if(isNaN(hours)) setHours(0);

        setData((data) => {
            let newData = data;            
            let index = newData.findIndex((item) => 
                item.year == route.params.year &&
                item.month == route.params.month &&
                item.date == route.params.date
            );
            if(index === -1) {
                newData.push({ 
                    hours,
                    note,
                    year: route.params.year,
                    month: route.params.month,
                    date: route.params.date,
                    key: route.params.year.toString() + route.params.month.toString() + route.params.date.toString()
                })
            } else {
                newData[index].hours = hours;
                newData[index].note = note;
            }
            setDataChanged(true);
            return newData;
        })

        
        navigation.navigate("main", { hours, note, index: route.params.index });
    }    

    function handleHoursChange(text) {
        if((!isNaN(text) || text === ".") && text[text.length-1] !== " " && text.length <= 5) {
            setHours(text);
        }
    }

    function handleNoteChange(text) {
        if(text.length <= 100){
            setNote(text);
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: route.params.dateString,
            headerTitleStyle: {
                color: "#eee"
            },
            headerTintColor: "#eee",
            headerRight: () => 
            <TouchableOpacity 
              onPress={() => handleConfirm()}
              title="Confirm"
            >
               <AntDesign name="checkcircle" size={24} color="#3a3" />
            </TouchableOpacity>
        });
    }, [navigation, note, hours])

    return (
        <View style={[styles.container, colors.secondColor[settings.theme]]}>
            <TouchableOpacity 
                style={[styles.inputContainer, colors.firstColor[settings.theme]]} 
                onPress={() => hoursInputRef.current.focus()}
            >
                <Text style={[styles.label, colors.firstColor[settings.theme]]}>Heures</Text>
                <TextInput
                    style={[styles.textinput, colors.firstColor[settings.theme]]}
                    keyboardType="numeric"
                    value={hours}
                    ref={hoursInputRef}
                    onChangeText={handleHoursChange}
                />
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.multiLineInputContainer, colors.firstColor[settings.theme]]} 
                onPress={() => noteInputRef.current.focus()}
            >
                <Text style={[styles.label, colors.firstColor[settings.theme]]}>Note</Text>
                <TextInput
                    style={[styles.textinput, colors.firstColor[settings.theme]]}
                    value={note}
                    ref={noteInputRef}
                    onChangeText={handleNoteChange}
                    multiline={true}
                    blurOnSubmit={true}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        backgroundColor: "#ddd"
    },
    inputContainer: {
        display: "flex",
        flex: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        marginTop: 2
    },
    label: {
        fontSize: 20
    },
    textinput: {
        fontSize: 20
    },
    multiLineInputContainer: {
        display: "flex",
        flex: 0,
        padding: 20,
        marginTop: 2
    }
})