import { useEffect, useState, useContext, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import moment from "moment";
import DataContext from '../contexts/DataContext';
import { MaterialIcons } from '@expo/vector-icons';
import Loading from '../components/Loading';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import FloatingButton from '../components/FloatingButton';
import SettingsContext from '../contexts/SettingsContext';
import { colors } from "../consts/colors";
import { Ionicons } from '@expo/vector-icons';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

export default function MainScreen({ navigation, route }) {
    const [status, requestPermission] = MediaLibrary.usePermissions();

    if (status === null) {
        requestPermission();
    }
    
    const imageRef = useRef();

    const [weekIndex, setWeekIndex] = useState(0);
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [datePickerDate, setDatePickerDate] = useState(new Date())
    const { data, dataChanged, localDataLoading } = useContext(DataContext);
    const [settings, setSettings] = useContext(SettingsContext);

    const [weekStart, setWeekStart] = useState(settings.firstDayOfTheWeek);

    const daysOfTheWeekOriginal = [
        {id: 0, name: "Dimanche"},
        {id: 1, name: "Lundi"},
        {id: 2, name: "Mardi"},
        {id: 3, name: "Mercredi"},
        {id: 4, name: "Jeudi"},
        {id: 5, name: "Vendredi"},
        {id: 6, name: "Samedi"}
    ];

    const monthsOfTheYear = [
        "Janvier", "Février", "Mars",
        "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre",
        "Octobre", "Novembre", "Décembre"
    ]

    const [daysOfTheWeek, setDaysOfTheWeek] = 
        useState(daysOfTheWeekOriginal.slice(weekStart).concat(daysOfTheWeekOriginal.slice(0, weekStart)));

    const [currentWeek, setCurrentWeek] = useState(getWeekByIndex(0));
    
    function getWeekByIndex(index) {
        let newCurrentWeek = [];
        let currentDate = moment().add(index*7, "days");

        daysOfTheWeek.map((item) => {
            let date = moment().add(index*7, "days");
            let hours = 0;
            let note = "";

            if(item.id >= weekStart) {
                date.add(item.id - currentDate.day(), "days");
            } else {
                date.add(7 - currentDate.day() + item.id, "days");
            }
            if(weekStart > currentDate.day()) {
                date.add(-7, "days")
            }
            
            let dataItem = data.find((dataItem) => 
                date.year() == dataItem.year &&
                date.month() == dataItem.month &&
                date.date() == dataItem.date
            );
            
            if(dataItem && dataItem.hours) hours = dataItem.hours;
            if(dataItem && dataItem.note) note = dataItem.note;
            newCurrentWeek.push({ hours: hours, note: note, date: date});
        });

        return newCurrentWeek;
    }
    
    useEffect(() => {
        setCurrentWeek(getWeekByIndex(weekIndex));
    }, [weekIndex, daysOfTheWeek])

    useEffect(() => {
        setDaysOfTheWeek(daysOfTheWeekOriginal.slice(weekStart).concat(daysOfTheWeekOriginal.slice(0, weekStart)));
    }, [weekStart])

    useEffect(() => {
        setWeekStart(settings.firstDayOfTheWeek);
    }, [settings.firstDayOfTheWeek])

    useEffect(() => {
        if(currentWeek[0]) {
            navigation.setOptions({
                headerTitle: () => <TouchableOpacity onPress={() => setDatePickerOpen(true)}>
                        <Text style={styles.headerDateTitle}>
                            {"Semaine du " + 
                            currentWeek[0].date.date() + "/" + 
                            (currentWeek[0].date.month()+1) + "/" + 
                            currentWeek[0].date.year()}
                        </Text>
                    </TouchableOpacity>
            })
        }
        else {
            navigation.setOptions({
                title: "Chargement..."
            })
        }
    }, [currentWeek])

    useEffect(() => {
        setCurrentWeek(getWeekByIndex(0));

        navigation.setOptions({ 
            title: "Chargement...",
            headerTitleStyle: {
                color: "#eee"
            },
            headerLeft: () => 
              <TouchableOpacity 
                onPress={() => setWeekIndex((prevWeekIndex) => prevWeekIndex-1)}
                title="Previous"
                color="#777"
              >
                <MaterialIcons name="navigate-before" size={24} color="#eee" />
              </TouchableOpacity>,
            headerRight: () => 
            <TouchableOpacity 
            onPress={() => setWeekIndex((prevWeekIndex) => prevWeekIndex+1)}
            title="Next"
            color="#777"
            >
                <MaterialIcons name="navigate-next" size={24} color="#eee" />
            </TouchableOpacity>
         });
    }, []);
    
    useEffect(() => {
        setCurrentWeek(getWeekByIndex(weekIndex));
    }, [dataChanged, localDataLoading])

    function handleDatePickerConfirm(selectedDate) {
        let newIndex = 0;
        if(moment(selectedDate).isBefore(moment(getWeekByIndex(0)[0].date))) {
            newIndex = moment(selectedDate).diff(getWeekByIndex(0)[6].date, "weeks");
        } else if (moment(selectedDate).isAfter(moment(getWeekByIndex(0)[6].date))) {
            newIndex = moment(selectedDate).diff(getWeekByIndex(0)[0].date, "weeks", true);
            if(newIndex - Math.floor(newIndex) >= 0.990) {
                console.log(newIndex)
                newIndex = Math.ceil(newIndex);
            }
        }
        setDatePickerOpen(false);
        setDatePickerDate(selectedDate);
        setWeekIndex(newIndex);
    }

    function handleDayPress(day, index) {
        navigation.navigate("editDay", {dateString: day.date.format("DD/MM/YYYY"), 
                                        hours: day.hours, 
                                        note: day.note,
                                        year: day.date.year(),
                                        month: day.date.month(),
                                        date: day.date.date(),
                                        index})
    }

    const onSaveImageAsync = async () => {
        try {
          const localUri = await captureRef(imageRef);
    
          await MediaLibrary.saveToLibraryAsync(localUri);
          if (localUri) {
            Alert.alert("Image enregistrée", "Image enregistrée avec succès");
          }
        } catch (e) {
          console.log(e);
        }
      };

    return (
        localDataLoading ? <Loading/> :
        <>
            <ScrollView style={[styles.mainScreenContainer, colors.secondColor[settings.theme]]}>
                <View ref={imageRef} collapsable={false} style={colors.secondColor[settings.theme]}>
                    {currentWeek.map((day, index) => 
                        <TouchableOpacity 
                            key={index} 
                            style={[styles.dayItem, colors.firstColor[settings.theme]]} 
                            onPress={() => handleDayPress(day, index)}
                        >
                            <View style={styles.dayItemTop}>
                                <Text style={[styles.weekName, colors.firstColor[settings.theme]]}>
                                    {daysOfTheWeekOriginal[day.date.day()].name + " le " + day.date.date() + " " + monthsOfTheYear[day.date.month()]}
                                </Text>
                                <Text style={[styles.hours, colors.firstColor[settings.theme]]}>
                                    {day.hours}
                                </Text>
                            </View>
                            {day.note !== "" && 
                            <View style={styles.dayItemBottom}>
                                <Text style={[styles.note, colors.firstColor[settings.theme]]}>
                                    {day.note}
                                </Text>
                            </View>}
                        </TouchableOpacity>
                    )}
                    <View style={[styles.totalContainer, colors.firstColor[settings.theme]]}>
                        <Text style={[styles.weekName, colors.firstColor[settings.theme]]}>Total</Text>
                        <Text style={[styles.hours, colors.firstColor[settings.theme]]}>{ currentWeek.reduce((sum, item) => sum + parseFloat(item.hours), 0) }</Text>
                    </View>
                </View>
            </ScrollView>
            {datePickerOpen && (
                <DateTimePickerModal
                    isVisible={datePickerOpen}
                    testID="dateTimePicker"
                    value={datePickerDate}
                    mode="date"
                    is24Hour={true}
                    onConfirm={handleDatePickerConfirm}
                    onCancel={() => setDatePickerOpen(false)}
                    display={Platform.OS === "ios" ? "inline" : ""}
                />
            )}
            <FloatingButton style={styles.settingsButton} onPress={() => navigation.navigate("settings")}>
                <Ionicons name="settings-sharp" size={24} color="#eee" />
            </FloatingButton>
            <FloatingButton style={styles.savingButton} onPress={() => onSaveImageAsync()}>
                <Ionicons name="save" size={24} color="#eee" />
            </FloatingButton>
        </>
    );
}

const styles = StyleSheet.create({
    mainScreenContainer: {
        display: "flex",
        flex: 1,
    },
    headerDateTitle: {
        color: "#eee",
        fontSize: 18
    },
    dayItem: {
        display: "flex",
        flex: 0,
        flexDirection: "column",
        justifyContent: "space-between",
        marginTop: 2,
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    dayItemTop: {
        display: "flex",
        flex: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    weekName: {
        fontSize: 20
    },
    hours: {
        fontSize: 20
    },
    totalContainer: {
        display: "flex",
        flex: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 4,
        marginBottom: 2,
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    settingsButton: {
        position: "absolute",
        right: 20,
        bottom: 50
    },
    savingButton: {
        position: "absolute",
        right: 20,
        bottom: 120
    }
})