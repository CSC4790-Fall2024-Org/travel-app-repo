import React from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Commenting out the previous Firebase imports and functionality

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCz4zCemGt4XZKZCuCI_FwQwXSFxeaqvk0",
//   authDomain: "studyguide-ea1f4.firebaseapp.com",
//   projectId: "studyguide-ea1f4",
//   storageBucket: "studyguide-ea1f4.appspot.com",
//   messagingSenderId: "1090855415134",
//   appId: "1:1090855415134:web:e68c6916b6c5b7e5d9f3cf"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Button title="Login" onPress={() => navigation.navigate("Login")} />
      <Button
        title="Sign Up"
        onPress={() => navigation.navigate("SignUp")}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Page</Text>
    </View>
  );
}

function SignUpScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up Page</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
