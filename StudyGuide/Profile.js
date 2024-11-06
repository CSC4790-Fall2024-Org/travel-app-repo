import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Image } from "react-native";
import { getFirestore, doc, getDoc } from "firebase/firestore"; 
import { useNavigation } from "@react-navigation/native";

export default function Profile({ route }) {
  const { uid } = route.params; // Get the uid from the route parameters
  const [profileData, setProfileData] = useState(null); // State to hold user profile data
  const db = getFirestore(); // Firestore database instance
  const [isPostDropdownOpen, setPostDropdownOpen] = useState(false);
  const [isViewDropdownOpen, setViewDropdownOpen] = useState(false);
  const navigation = useNavigation();

  const countryCode = "IT"; //Hard code NEED TO CHANGE

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

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const docRef = doc(db, "users", uid); // Reference to the specific user document using uid
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          setProfileData(docSnap.data()); // Set the user data to state
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching profile data: ", error);
      }
    };

    fetchProfileData(); // Fetch profile data when component mounts
  }, [db, uid]);

  if (!profileData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Page</Text>
      <Image 
        source={{ uri: `https://flagsapi.com/${countryCode}/flat/64.png` }} 
        style={styles.image} 
      />
      <Text style={styles.profileItem}>{profileData.name}</Text>
      <Text style={styles.profileItem}>{profileData.city}</Text>
      <Text style={styles.profileItem}>{profileData.year}</Text>
      <Text style={styles.profileItem}>{profileData.email}</Text>

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
            <Text style={styles.buttonText}>View your Posts</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, width: '100%',  },
  title: { fontSize: 30, marginBottom: 20, fontWeight: "bold" },
  profileItem: { fontSize: 20, marginVertical: 5, fontWeight: "bold" },
  button: {
    backgroundColor: 'green',
    width: '100%',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
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
    paddingVertical: 5,
    marginVertical: 5,
  },
  dropdownText: {
    color: '#2a2a2a',
    fontWeight: "bold",
    fontSize: 18,
    textAlign: 'center',
  },
  image: {        
    width: 200,        
    height: 200,    
  },
});
