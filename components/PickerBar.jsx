import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function PickerBar({ textColor = "black", backgroundColor = "white", label="", text="", onPress=()=>{} }) {
    return (
        <View style={styles.pickerContainer}>
            <Text style={{color: textColor}}>{label}</Text>
            <TouchableOpacity
                style={[styles.picker, {backgroundColor: backgroundColor}]}
                onPress={onPress}
            >
                <Text style={{color: textColor}}>{text}</Text>
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