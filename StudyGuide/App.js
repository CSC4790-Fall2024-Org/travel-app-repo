import React from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Import your subpages
import UserPosts from "./UserPosts";
import Demo from './Demo';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import Profile from './Profile';
import FoodPosts from './FoodPosts';
import StayPosts from './StayPosts';
import ActivitiesPosts from './ActivitiesPosts';
import CreateFoodPost from "./CreateFoodPost";
import CreateStaysPost from "./CreateStaysPost";
import CreateActivitiesPost from "./CreateActivitiesPost";
import FindFoodPosts from "./FindFoodPosts";
import FindActivitiesPosts from "./FindActivitiesPosts";
import FindStayPosts from "./FindStayPosts";

const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Demo">
        {/* Main page listing all subpages */}
        <Stack.Screen name="Home" component={Demo} />
        {/* Subpages */}
        <Stack.Screen name="UserPosts" component={UserPosts} />
        <Stack.Screen name="App Demo" component={Demo} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="FoodPosts" component={FoodPosts} />
        <Stack.Screen name="ActivitiesPosts" component={ActivitiesPosts} />
        <Stack.Screen name="StayPosts" component={StayPosts} />
        <Stack.Screen name="CreateFoodPost" component={CreateFoodPost} />
        <Stack.Screen name="CreateStaysPost" component={CreateStaysPost} />
        <Stack.Screen name="CreateActivitiesPost" component={CreateActivitiesPost} />
        <Stack.Screen name="FindFoodPosts" component={FindFoodPosts} />
        <Stack.Screen name="FindActivitiesPosts" component={FindActivitiesPosts} />
        <Stack.Screen name="FindStayPosts" component={FindStayPosts} />
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
