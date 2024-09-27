import { getFirestore, collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Button, ScrollView } from "react-native";
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

export default function Home() {
  const [locations, setLocations] = useState([]);
  const navigation = useNavigation();

  // Function to fetch documents from Firestore
  const fetchLocations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "locations"));
      const fetchedData = [];
      querySnapshot.forEach((doc) => {
        fetchedData.push({ id: doc.id, ...doc.data() });
      });
      setLocations(fetchedData);
    } catch (error) {
      console.error("Error fetching locations: ", error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleLocationPress = (locationId) => {
    navigation.navigate("Posts"); // Navigate to posts page with location ID
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Location</Text>
      <ScrollView>
        {locations.map((location) => (
          <View key={location.id} style={styles.locationContainer}>
            <Button
              title={location.city} // Assuming each location document has a 'name' field
              onPress={() => handleLocationPress(location.id)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
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
