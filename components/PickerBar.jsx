import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons";

export default function PickerBar({ textColor = "black", backgroundColor = "white" }) {
    return (
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
    );
}

const styles = StyleSheet.create({
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
    }
})