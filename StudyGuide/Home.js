import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Assuming you're using React Navigation


export default function Home({ route }) {
  const { uid } = route.params;
  const [isPostDropdownOpen, setPostDropdownOpen] = useState(false);
  const [isViewDropdownOpen, setViewDropdownOpen] = useState(false);
  const navigation = useNavigation();

  const togglePostDropdown = () => {
    setPostDropdownOpen(!isPostDropdownOpen);
  };

  const toggleViewDropdown = () => {
    setViewDropdownOpen(!isViewDropdownOpen);
  };

  const handlePostNavigation = (screen) => {
    setPostDropdownOpen(false);  // Close the post dropdown when navigating
    navigation.navigate(screen);  // Navigate to the selected screen
  };

  const handleViewNavigation = (screen) => {
    setViewDropdownOpen(false);  // Close the category dropdown when navigating
    navigation.navigate(screen);  // Navigate to the selected screen
  };

  // Close dropdowns when tapping outside
  const closeDropdowns = () => {
    if (isPostDropdownOpen) {
      setPostDropdownOpen(false);
    }
    if (isViewDropdownOpen) {
      setViewDropdownOpen(false);
    }
  };
  const navigateToProfile = () => {
    navigation.navigate('Profile', { uid });  // Pass userId to the Profile screen
  };


  return (

    // TouchableWithoutFeedback allows us to detect taps outside the dropdown
    <TouchableWithoutFeedback onPress={closeDropdowns}>
      <View style={styles.container}>
        <Button title="Create a Post" onPress={togglePostDropdown} />

        {isPostDropdownOpen && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => handlePostNavigation('CreateFoodPost')}>
              <Text>Food</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => handlePostNavigation('CreateStaysPost')}>
              <Text>Stays</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => handlePostNavigation('CreateActivitiesPost')}>
              <Text>Activities</Text>
            </TouchableOpacity>
          </View>
        )}

        <Button title="View Posts" onPress={toggleViewDropdown} />

        {isViewDropdownOpen && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => handleViewNavigation('Posts')}>
              <Text> Food </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => handleViewNavigation('Posts')}>
              <Text> Stays </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => handleViewNavigation('Posts')}>
              <Text> Activities </Text>
            </TouchableOpacity>
          </View>
        )}
         <Button title="Go to Profile" onPress={navigateToProfile} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  locationContainer: {
    marginBottom: 15,
  },
});
