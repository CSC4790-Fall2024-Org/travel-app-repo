import React from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Import your subpages
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import Profile from './Profile';
import Home from './Home';
import Posts from './Posts';
import CreateFoodPost from "./CreateFoodPost";
import CreateStaysPost from "./CreateStaysPost";
import CreateActivitiesPost from "./CreateActivitiesPost";

const Stack = createStackNavigator();

function MainPage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Starter page</Text>
      <Button title="Go to Login" onPress={() => navigation.navigate("Login")} />
      <Button title="Go to Sign Up" onPress={() => navigation.navigate("SignUp")} />
      <Button title="Go to Profile" onPress={() => navigation.navigate("Profile")} />
      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
      <Button title="Go to Posts" onPress={() => navigation.navigate("Posts")} />
      <Button title="Create Food Post" onPress={() => navigation.navigate("CreateFoodPost")} />
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
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Posts" component={Posts} />
        <Stack.Screen name="CreateFoodPost" component={CreateFoodPost} />
        <Stack.Screen name="CreateStaysPost" component={CreateStaysPost} />
        <Stack.Screen name="CreateActivitiesPost" component={CreateActivitiesPost} />
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
