import { TouchableOpacity, View, StyleSheet } from "react-native";

export default function FloatingButton(props) {
    return (
        <TouchableOpacity style={props.style} onPress={props.onPress}>
            <View style={styles.buttonContainer}>
                {props.children}                
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        backgroundColor: "#333"
    }
});