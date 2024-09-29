import { getFirestore, collection, getDocs } from "firebase/firestore";
import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Assuming you're using React Navigation
import { db } from './firebase';


// Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCz4zCemGt4XZKZCuCI_FwQwXSFxeaqvk0",
//   authDomain: "studyguide-ea1f4.firebaseapp.com",
//   projectId: "studyguide-ea1f4",
//   storageBucket: "studyguide-ea1f4.appspot.com",
//   messagingSenderId: "1090855415134",
//   appId: "1:1090855415134:web:e68c6916b6c5b7e5d9f3cf"
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);


// export default function Home() {
//   const [locations, setLocations] = useState([]);
//   const navigation = useNavigation();

//   // Function to fetch documents from Firestore
//   const fetchLocations = async () => {
//     try {
//       const querySnapshot = await getDocs(collection(db, "locations"));
//       const fetchedData = [];
//       querySnapshot.forEach((doc) => {
//         fetchedData.push({ id: doc.id, ...doc.data() });
//       });
//       setLocations(fetchedData);
//     } catch (error) {
//       console.error("Error fetching locations: ", error);
//     }
//   };

//   useEffect(() => {
//     fetchLocations();
//   }, []);

//   const handleLocationPress = (locationId) => {
//     navigation.navigate("Posts"); // Navigate to posts page with location ID
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Select Location</Text>
//       <ScrollView>
//         {locations.map((location) => (
//           <View key={location.id} style={styles.locationContainer}>
//             <Button
//               title={location.city} // Assuming each location document has a 'name' field
//               onPress={() => handleLocationPress(location.id)}
//             />
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// }


export default function Home() {
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
