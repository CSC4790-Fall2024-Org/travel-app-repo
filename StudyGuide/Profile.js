import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Image } from "react-native";
import { getFirestore, doc, getDoc, collection, getDocs, query, where } from "firebase/firestore"; 
import { useNavigation } from "@react-navigation/native";

export default function Profile({ route }) {
  const { uid } = route.params;
  const [profileData, setProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [showUserPosts, setShowUserPosts] = useState(false);
  const [countryCode, setCountryCode] = useState(""); // Initialize empty
  const db = getFirestore();
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
    if (isPostDropdownOpen) setPostDropdownOpen(false);
    if (isViewDropdownOpen) setViewDropdownOpen(false);
  };

  const navigateToUserPosts = () => {
    navigation.navigate('UserPosts', { uid });
  };

  const fetchUserPosts = async () => {
    try {
      console.log("Fetching posts for UID:", uid); // Log UID for debugging
      const postsRef = collection(db, "posts");
      const postsQuery = query(postsRef, where("uid", "==", uid));
      const postsSnap = await getDocs(postsQuery);

      if (postsSnap.empty) {
        console.log("No posts found for this user.");
      } else {
        const postsData = postsSnap.docs.map(doc => doc.data());
        setUserPosts(postsData); // Set user posts in state
      }
    } catch (error) {
      console.error("Error fetching user posts: ", error);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData(data);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching profile data: ", error);
      }
    };

    fetchProfileData();
  }, [db, uid]);

  useEffect(() => {
    const fetchCountryCode = async () => {
      if (!profileData || !profileData.city) return;

      try {
        const locationRef = doc(db, "locations", profileData.city);
        const locationDoc = await getDoc(locationRef);
        if (locationDoc.exists()) {
          setCountryCode(locationDoc.data().country_3-digit_code); 
        } else {
          setCountryCode("Unknown Location");
        }
      } catch (error) {
        console.error("Error fetching location city: ", error);
      }
    };

    fetchCountryCode();
  }, [profileData]);

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

        <TouchableOpacity onPress={navigateToUserPosts} style={styles.button}>
          <Text style={styles.buttonText}>View your Posts</Text>
        </TouchableOpacity>

        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, width: '100%' },
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
  postsContainer: {
    marginTop: 10,
    width: '100%',
  },
  postItem: {
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    marginBottom: 10,
  },
  postText: {
    fontSize: 16,
  },
});
