import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Image, ScrollView } from "react-native";
import { getFirestore, doc, getDoc, collection, getDocs, query, where } from "firebase/firestore"; 
import { useNavigation } from "@react-navigation/native";

export default function Profile({ route }) {
  const { uid } = route.params;
  const [profileData, setProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [showUserPosts, setShowUserPosts] = useState(false);
  const [countryCode, setCountryCode] = useState(""); 
  const db = getFirestore();
  const [isPostDropdownOpen, setPostDropdownOpen] = useState(false);
  const [isViewDropdownOpen, setViewDropdownOpen] = useState(false);
  const navigation = useNavigation();

  const togglePostDropdown = () => {
    setPostDropdownOpen(!isPostDropdownOpen);
    if (!isPostDropdownOpen) {
      setViewDropdownOpen(false); 
    }
  };
  
  const toggleViewDropdown = () => {
    setViewDropdownOpen(!isViewDropdownOpen);
    if (!isViewDropdownOpen) {
      setPostDropdownOpen(false); 
    }
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
    navigation.navigate('UserPosts', { fetchUserPosts });
  };

  const fetchUserPosts = async () => {
    try {
      console.log("Fetching posts for UID:", uid);
      const postsRef = collection(db, "posts");
      const postsQuery = query(postsRef, where("uid", "==", uid));
      const postsSnap = await getDocs(postsQuery);

      if (postsSnap.empty) {
        console.log("No posts found for this user.");
      } else {
        const postsData = postsSnap.docs.map(doc => doc.data());
        setUserPosts(postsData); 
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
        const locationRef = collection(db, "locations");
        const locationQuery = query(locationRef, where("city", "==", profileData.city));
        const locationSnap = await getDocs(locationQuery);
    
        if (!locationSnap.empty) {
          const locationData = locationSnap.docs[0].data();
          setCountryCode(locationData.countryCode.toLowerCase()); 
        } else {
          console.log("No matching location found for city:", profileData.city);
        }
      } catch (error) {
        console.error("Error fetching country code for city:", error);
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
      <Text style={styles.title}>{profileData.name}'s Profile</Text>
      {countryCode && (
        <Image 
          source={{ uri: `https://flagcdn.com/w2560/${countryCode}.png` }} 
          style={styles.image} 
        />
      )}
      <Text style={styles.profileItemCITY}>{profileData.city}</Text>
      <Text style={styles.profileItem}>{profileData.year}</Text>

      <TouchableWithoutFeedback onPress={closeDropdowns}>
        <View style={styles.buttonsContainer}>
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
  container: { 
    flex: 1, 
    justifyContent: "flex-start", 
    backgroundColor: 'white', 
    alignItems: "center", 
    padding: 20, 
    width: '100%' 
  },
  title: { 
    textAlign: 'left', 
    fontSize: 35,  
    fontWeight: "bold", 
    marginBottom: 30, 
    fontFamily: 'San Francisco', 
  },
  profileItemCITY: { 
    fontSize: 35,  
    fontWeight: "bold", 
    fontFamily: 'San Francisco', 
    marginTop: 15,
    marginBottom: 5, 
  },
  profileItem: {
    fontSize: 25,  
    fontWeight: "bold", 
    fontFamily: 'San Francisco', 
  },
  image: {        
    width: '300',        
    height: '200', 
    marginBottom: 20,   
  },
  buttonsContainer: {
    marginTop: 30, 
    width: '100%',
    alignItems: 'center', 
  },
  button: {
    backgroundColor: '#70A533',
    width: '90%', 
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
    backgroundColor: '#EEEEEE',
    width: '90%',
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
});

