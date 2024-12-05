import React from "react";
import {
    KeyboardAvoidingView,
    TouchableOpacity,
    Text,
    View,
    StyleSheet,
    ScrollView,
    Image,
    SafeAreaView,
    Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

function Demo() {
    const navigation = useNavigation();
    const { width, height } = Dimensions.get("window"); 

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <Text style={[styles.title, { fontSize: Math.min(width * 0.08, 34) }]}>
                    Welcome to StudyGuide
                </Text>
                <View style={styles.imageContainer}>
                    <Image
                        source={require("./Logo.jpeg")}
                        style={[
                            styles.image,
                            { width: Math.min(width * 0.75, 400), height: Math.min(width * 0.75, 400) },
                        ]}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Login")}
                        style={[styles.button, { width: Math.min(width * 0.85, 350) }]}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("SignUp")}
                        style={[styles.button, { width: Math.min(width * 0.85, 350) }]}
                    >
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "white",
    },
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    imageContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20,
    },
    image: {
        resizeMode: "contain",
    },
    title: {
        fontWeight: "600",
        marginBottom: 20,
        textAlign: "center",
        fontFamily: "San Francisco",
    },
    buttonContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
    },
    button: {
        backgroundColor: "#70A533",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 15,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default Demo;
