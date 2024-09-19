import React from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Import your subpages
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import Profile from './Profile';
import Content from './Content';
import Posts from './Posts';

const Stack = createStackNavigator();

function MainPage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Starter page</Text>
      <Button title="Go to Login" onPress={() => navigation.navigate("Login")} />
      <Button title="Go to Sign Up" onPress={() => navigation.navigate("SignUp")} />
      <Button title="Go to Profile" onPress={() => navigation.navigate("Profile")} />
      <Button title="Go to Content" onPress={() => navigation.navigate("Content")} />
      <Button title="Go to Posts" onPress={() => navigation.navigate("Posts")} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainPage">
        {/* Main page listing all subpages */}
        <Stack.Screen name="MainPage" component={MainPage} />
        {/* Subpages */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Content" component={Content} />
        <Stack.Screen name="Posts" component={Posts} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
