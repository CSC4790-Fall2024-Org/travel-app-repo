import React, { useState, useEffect } from "react";
import {
    KeyboardAvoidingView,
    TouchableOpacity,
    Text,
    TextInput,
    View,
    StyleSheet,
    Alert,
    ScrollView,
    Dimensions,
    SafeAreaView,
} from "react-native";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import { db } from "./firebase";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";

const SignUpScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [locationOpen, setLocationOpen] = useState(false);
    const [restaurantLocationId, setRestaurantLocation] = useState("");
    const [locationItems, setLocationItems] = useState([]);

    const [yearOpen, setYearOpen] = useState(false);
    const [year, setYear] = useState(null);

    const navigation = useNavigation();
    const { width } = Dimensions.get("window");

    const fetchLocations = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "locations"));
            const fetchedData = querySnapshot.docs.map((doc) => ({
                label: doc.data().city,
                value: doc.data().city,
            }));
            setLocationItems(fetchedData);
        } catch (error) {
            console.error("Error fetching locations: ", error);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const checkEmail = (email) => {
        return email.includes(".edu");
    };

    const handleSignUp = async () => {
        if (!checkEmail(email)) {
            Alert.alert(
                "Error",
                "StudyGuide is designed for university students. Please enter an email address associated with a university."
            );
            return;
        }

        const auth = getAuth();
        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user;

            await sendEmailVerification(user);
            Alert.alert("Verification Email Sent", "Please check your email to verify your account.");

            const intervalId = setInterval(async () => {
                await user.reload();
                if (user.emailVerified) {
                    clearInterval(intervalId);
                    await setDoc(doc(db, "users", user.uid), {
                        email,
                        name,
                        year,
                        city: restaurantLocationId,
                        userId: user.uid,
                    });

                    Alert.alert(
                        "Sign Up Successful",
                        "Your email is verified. Welcome to StudyGuide! You can login now."
                    );
                    navigation.navigate("Login");
                }
            }, 5000);
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                Alert.alert("Error", "This email is already in use. Please log in or use another email.");
            } else {
                Alert.alert("Error", error.message);
            }
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <ScrollView
                    contentContainerStyle={[styles.scrollContainer, { paddingHorizontal: Math.min(width * 0.1, 20) }]}
                    horizontal={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <Text style={[styles.title, { fontSize: Math.min(width * 0.08, 34) }]}>Sign Up</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Name"
                            value={name}
                            onChangeText={(text) => setName(text)}
                            style={styles.input}
                        />
                        <View style={{ zIndex: 2000, marginTop: 5, marginBottom: 5 }}>
                            <DropDownPicker
                                style={styles.dropdown}
                                containerStyle={[styles.dropdownContainer, { width: Math.min(width * 0.9, 400) }]}
                                placeholderStyle={styles.dropdownPlaceholder}
                                labelStyle={styles.dropdownLabelStyle}
                                open={locationOpen}
                                value={restaurantLocationId}
                                items={locationItems}
                                setOpen={setLocationOpen}
                                setValue={setRestaurantLocation}
                                setItems={setLocationItems}
                                placeholder="Where did you study?"
                                zIndex={2000}
                                listMode="SCROLLVIEW"
                            />
                        </View>
                        <View style={{ zIndex: 1000, marginBottom: 5 }}>
                            <DropDownPicker
                                open={yearOpen}
                                value={year}
                                items={Array.from({ length: 31 }, (_, i) => {
                                    const year = 2000 + i;
                                    return { label: year.toString(), value: year.toString() };
                                })}
                                style={styles.dropdown}
                                containerStyle={[styles.dropdownContainer, { width: Math.min(width * 0.9, 400) }]}
                                placeholderStyle={styles.dropdownPlaceholder}
                                setOpen={setYearOpen}
                                setValue={setYear}
                                placeholder="What year did you or will you study?"
                                zIndex={1000}
                                listMode="SCROLLVIEW"
                            />
                        </View>
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
                        <TouchableOpacity
                            onPress={handleSignUp}
                            style={[styles.button, { width: Math.min(width * 0.9, 400) }]}
                        >
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>
                        <Text style={styles.infoText}>
                            To create an account, your email must be educational (ending with .edu).
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Login")}
                            style={[styles.button, { width: Math.min(width * 0.9, 400) }]}
                        >
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                        <Text style={styles.infoText}>If you have already registered, Login.</Text>
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
    },
    inputContainer: {
        width: "100%",
        alignItems: "center",
    },
    title: {
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 35,
    },
    input: {
        backgroundColor: "#EEEEEE",
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 10,
        width: "100%",
        maxWidth: 400,
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15,
        backgroundColor: "#EEEEEE",
        borderRadius: 10,
        marginBottom: 10,
        width: "100%",
        maxWidth: 400,
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 10,
    },
    showButton: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        color: "#70A533",
        fontWeight: "bold",
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
    infoText: {
        color: "gray",
        fontSize: 12.5,
        textAlign: "center",
    },
    dropdownContainer: {
        backgroundColor: "#EEEEEE",
        borderRadius: 10,
        borderWidth: 0,
        marginTop: 10,
    },
    dropdown: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 10,
        borderColor: "transparent",
        backgroundColor: "#EEEEEE",
    },
    dropdownPlaceholder: {
        color: "#B0B0B0",
    },
    dropdownLabelStyle: {
      fontSize: 14,
      color: "#6D6D6D",
  },
  dropdownItem: {
      paddingHorizontal: 10,
      paddingVertical: 15,
      color: "#6D6D6D",
  },
  dropdownBadge: {
      backgroundColor: "#6D6D6D",
      color: "white",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 5,
      fontSize: 14,
  },
});

export default SignUpScreen;
