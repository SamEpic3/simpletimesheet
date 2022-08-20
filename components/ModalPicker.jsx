import { StyleSheet } from "react-native";
import Modal from "react-native-modal";

export default function ModalPicker({ isVisible = false, setModalVisible, data }) {
    return (
        <Modal
                isVisible={isVisible}
                onBackButtonPress={() => setModalVisible("none")}
                onBackdropPress={() => setModalVisible("none")}
                backdropOpacity={0.7}
                animationIn="fadeIn"
                animationOut="fadeOut"
                backdropTransitionOutTiming={0}
        >
                    <View style={styles.modalContainer}>
                        {data.map(item => 
                            <TouchableOpacity 
                                style={styles.modalItem} 
                                key={item.value}
                                onPress={() => {
                                    setPicker(item.value);
                                    setModalVisible("none");
                                }}
                            >
                                <Text>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                    </View>                        
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        borderRadius: 10,
        padding: 10,
        backgroundColor: "#ddd"
    },
    modalItem: {
        paddingVertical: 20
    }
});