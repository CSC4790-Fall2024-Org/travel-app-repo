import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, Button } from "react-native";
import { useNavigation, firestore } from "@react-navigation/native";
import { db } from './firebase';
 
  export default function FindFoodPosts() {
    const [locations, setLocations] = useState([]);
    const navigation = useNavigation();
    const [sortedPosts, setSortedPosts]= useState([]);
    const [showView, setShowView] = useState(false);
  
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
    


const handleLocationPress = (location_id) => {
  //this one line navigates you to Posts page:
  navigation.navigate('StayPosts', { location_id : location_id }); // Navigate to posts page with location ID
 
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
            color= "#70A533" // Green color for button
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
    backgroundColor: "#f0f0f0", // Light gray background
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    textAlign: "center",
    color: "#70A533", // Green accent for the title
    fontFamily: 'San Francisco',
    fontWeight: "bold",
  },
  locationContainer: {
    marginBottom: 15,
    backgroundColor: "#ffffff", // White card for each location
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000", // Shadow for card elevation
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android elevation
  },
});
