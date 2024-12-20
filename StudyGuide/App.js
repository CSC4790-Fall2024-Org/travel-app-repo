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


function MainPage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Starter page</Text>
      <Button title="UserPosts" onPress={() => navigation.navigate("UserPosts")} />
      <Button title="Go to App Demo" onPress={() => navigation.navigate("App Demo")} />
      <Button title="Go to Login" onPress={() => navigation.navigate("Login")} />
      <Button title="Go to Sign Up" onPress={() => navigation.navigate("SignUp")} />
      <Button title="Go to Profile" onPress={() => navigation.navigate("Profile")} />
      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
      <Button title="Go to FoodPosts" onPress={() => navigation.navigate("FoodPosts")} />
      <Button title="Go to ActivitiesPosts" onPress={() => navigation.navigate("ActivitiesPosts")} />
      <Button title="Go to StayPosts" onPress={() => navigation.navigate("StayPosts")} />
      <Button title="Create Food Post" onPress={() => navigation.navigate("CreateFoodPost")} />
      <Button title="Create Stays Post" onPress={() => navigation.navigate("CreateStaysPost")} />
      <Button title="Create Activities Post" onPress={() => navigation.navigate("CreateActivitiesPost")} />
      <Button title="Go to Find Food Posts" onPress={() => navigation.navigate("FindFoodPosts")} />
      <Button title="Go to Find Activities Posts" onPress={() => navigation.navigate("FindActivitiesPosts")} />
      <Button title="Go to Find Stay Posts" onPress={() => navigation.navigate("FindStayPosts")} />
    </View>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Demo">
        {/* Main page listing all subpages */}
        <Stack.Screen name="Home" component={Demo} options={{ headerShown: false }} />
        {/* Subpages */}
        <Stack.Screen name="UserPosts" component={UserPosts} options={{ title: ' ' }} />
        <Stack.Screen name="App Demo" component={Demo} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Profile" component={Profile} options={{ title: ' ' }} />
        <Stack.Screen name="FoodPosts" component={FoodPosts} options={{ title: ' ' }}/>
        <Stack.Screen name="ActivitiesPosts" component={ActivitiesPosts} options={{ title: ' ' }}/>
        <Stack.Screen name="StayPosts" component={StayPosts} options={{ title: ' ' }}/>
        <Stack.Screen name="CreateFoodPost" component={CreateFoodPost} options={{ title: ' ' }} />
        <Stack.Screen name="CreateStaysPost" component={CreateStaysPost} options={{ title: ' ' }} />
        <Stack.Screen name="CreateActivitiesPost" component={CreateActivitiesPost} options={{ title: ' ' }} />
        <Stack.Screen name="FindFoodPosts" component={FindFoodPosts} options={{ title: ' ' }}/>
        <Stack.Screen name="FindActivitiesPosts" component={FindActivitiesPosts} options={{ title: ' ' }} />
        <Stack.Screen name="FindStayPosts" component={FindStayPosts} options={{ title: ' ' }}/>
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
