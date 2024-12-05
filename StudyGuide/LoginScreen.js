import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    TouchableOpacity,
    Image,
    Text,
    TextInput,
    View,
    StyleSheet,
    Alert,
    ScrollView,
    Dimensions,
    SafeAreaView,
} from "react-native";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();
    const auth = getAuth();
    const db = getFirestore();
    const { width, height } = Dimensions.get("window");

    const handleLogin = async () => {
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user;
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                navigation.navigate("Profile", { uid: user.uid });
            } else {
                Alert.alert(
                    "Error",
                    "No user found with those credentials. Please verify your email and password or sign up."
                );
            }
        } catch (error) {
            switch (error.code) {
                case "auth/user-not-found":
                    Alert.alert("Error", "No user found with this email. Please check your email or sign up.");
                    break;
                case "auth/wrong-password":
                    Alert.alert("Error", "Incorrect password. Please try again.");
                    break;
                default:
                    Alert.alert("Error", error.message);
            }
        }
    };

    const handleForgotPassword = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert("Success", "Password reset email sent! Check your inbox.");
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Image
                        source={require("./Logo.jpeg")}
                        style={[styles.image, { width: Math.min(width * 0.7, 250), height: Math.min(width * 0.7, 250) }]}
                    />
                    <Text style={[styles.title, { fontSize: Math.min(width * 0.08, 34) }]}>Login</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            style={styles.input}
                        />
                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="Password"
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                style={styles.passwordInput}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Text style={styles.showButton}>{showPassword ? "Hide" : "Show"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleLogin} style={[styles.button, { width: Math.min(width * 0.85, 350) }]}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleForgotPassword} style={[styles.button, { width: Math.min(width * 0.85, 350) }]}>
                            <Text style={styles.buttonText}>Forgot Password?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("SignUp")} style={[styles.button, { width: Math.min(width * 0.85, 350) }]}>
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "white",
    },
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    image: {
        resizeMode: "contain",
        marginBottom: 20,
    },
    title: {
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    inputContainer: {
        width: "100%",
        maxWidth: 400,
    },
    input: {
        backgroundColor: "#EEEEEE",
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 15,
        borderWidth: 0,
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15,
        backgroundColor: "#EEEEEE",
        borderRadius: 10,
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 10,
        borderWidth: 0,
    },
    showButton: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        color: "#70A533",
        fontWeight: "bold",
    },
    buttonContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    button: {
        backgroundColor: "#70A533",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default LoginScreen;
