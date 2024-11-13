import React, { useState } from "react";
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

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
    setPostDropdownOpen(false);
    navigation.navigate(screen);
  };

  const handleViewNavigation = (screen) => {
    setViewDropdownOpen(false);
    navigation.navigate(screen);
  };

  const closeDropdowns = () => {
    if (isPostDropdownOpen) {
      setPostDropdownOpen(false);
    }
    if (isViewDropdownOpen) {
      setViewDropdownOpen(false);
    }
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile', { uid });
  };

  return (
    <TouchableWithoutFeedback onPress={closeDropdowns}>
      <View style={styles.container}>
        <TouchableOpacity onPress={togglePostDropdown} style={styles.button}>
          <Text style={styles.buttonText}>Create a Post</Text>
        </TouchableOpacity>

        {isPostDropdownOpen && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => handlePostNavigation('CreateFoodPost')}>
              <Text style={styles.dropdownText}>Food</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => handlePostNavigation('CreateStaysPost')}>
              <Text style={styles.dropdownText}>Stays</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => handlePostNavigation('CreateActivitiesPost')}>
              <Text style={styles.dropdownText}>Activities</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity onPress={toggleViewDropdown} style={styles.button}>
          <Text style={styles.buttonText}>View Posts</Text>
        </TouchableOpacity>

        {isViewDropdownOpen && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => handleViewNavigation('FindFoodPosts')}>
              <Text style={styles.dropdownText}>Food</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => handleViewNavigation('FindStayPosts')}>
              <Text style={styles.dropdownText}>Stays</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => handleViewNavigation('FindActivitiesPosts')}>
              <Text style={styles.dropdownText}>Activities</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity onPress={navigateToProfile} style={styles.button}>
          <Text style={styles.buttonText}>Go to Profile</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: 'green',
    width: '100%', 
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10, 
  },
  buttonText: {
    color: 'white',
    fontWeight: "bold",
    fontSize: 20,
    textAlign: 'center',
  },
  dropdownMenu: {
    backgroundColor: '#EDEDED',
    width: '50%',  
    alignSelf: 'center',
    borderRadius: 5,
    paddingVertical: 5,
    marginTop: 5,
  },
  dropdownItem: {
    paddingVertical: 8,
    marginVertical: 15,
  },
  dropdownText: {
    color: '#2a2a2a',
    fontWeight: "bold",
    fontSize: 18,
    textAlign: 'center', 
  },
});
