import { Text, View, StyleSheet, ScrollView, Button } from "react-native";
import { db } from './firebase';
import React, { useState, useEffect } from "react";
import { getFirestore, firestore, where, collection, getDocs, query,  Filter, doc, QueryFieldFilterConstraint, DocumentSnapshot, QuerySnapshot, getDoc } from "firebase/firestore";
import Stars from "./Stars"
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from 'react-native-dropdown-picker'; //dropdown picker

export default function FoodPosts({ route }) {
  const db = getFirestore(); // Firestore database instance
  const navigation = useNavigation();
  const [sortedPosts, setSortedPosts] = useState([]);
  const { location_id } = route.params;
  const [locationCity, setLocationCity] = useState(''); // State to store city name


  // Fetch the city name for the given location_id
  const fetchLocationCity = async () => {
    try {
      const locationRef = doc(db, "locations", location_id);
      const locationDoc = await getDoc(locationRef);
      if (locationDoc.exists()) {
        setLocationCity(locationDoc.data().city); // Assuming 'city' is the field name for city name
      } else {
        setLocationCity("Unknown Location");
      }
    } catch (error) {
      console.error("Error fetching location city: ", error);
    }
  };

  // Fetch sorted posts for the given location
  const fetchSortedPosts = async () => {
    try {
      const foodPostsRef = collection(db, "foodPosts");
      const q = query(foodPostsRef, where('locat_id', '==', location_id));

      const querySnapshot = await getDocs(q);
      const fetchedSortedPosts = [];
      querySnapshot.forEach((postDoc) => {
        fetchedSortedPosts.push({ id: postDoc.id, ...postDoc.data() });
      });

      setSortedPosts(fetchedSortedPosts); // Update state with the fetched posts
    } catch (error) {
      console.error("Error fetching posts for this location: ", error);
    }
  };

  // Initial fetch for location city and posts
  useEffect(() => {
    fetchLocationCity();
    fetchSortedPosts();
  }, [location_id]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Places to Eat in {locationCity}</Text>

      {/* Check if sortedPosts is empty */}
      {sortedPosts.length === 0 ? (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={styles.noPostsText}>No food posts yet. Go to create post to be the first!</Text>
        </View>
      ) : (
        sortedPosts.map((sortedPost) => (
          <View key={sortedPost.id} style={styles.postContainer}>
            <Text style={styles.itemTitle}>
              <Text style={styles.resturantTitle}>{sortedPost.restaurant}</Text>
            </Text>
            <Stars rating={sortedPost.stars} readOnly={true} />

            <Text style={styles.itemTitle}>
              Post from:{" "}
              <Text style={styles.postItem}>
                {sortedPost.posterName} who visited {sortedPost.posterVisitedCity} in {sortedPost.posterYear}
              </Text>
            </Text>

            <Text style={styles.itemTitle}>
              Expense: <Text style={styles.postItem}>{sortedPost.expense}</Text>
            </Text>
            <Text style={styles.itemTitle}>
              Meal Time: <Text style={styles.postItem}>{sortedPost.mealTime}</Text>
            </Text>
            <Text style={styles.itemTitle}>
              Restaurant Type: <Text style={styles.postItem}>{sortedPost.restaurantType}</Text>
            </Text>

            {sortedPost.dietary && (
              <Text style={styles.itemTitle}>
                Dietary Accommodations: <Text style={styles.postItem}>{sortedPost.dietary}</Text>
              </Text>
            )}
            {sortedPost.address && (
              <Text style={styles.itemTitle}>
                Address: <Text style={styles.postItem}>{sortedPost.address}</Text>
              </Text>
            )}
            {sortedPost.link && (
              <Text style={styles.itemTitle}>
                Link to website: <Text style={styles.postItem}>{sortedPost.link}</Text>
              </Text>
            )}
            <Text style={styles.itemTitle}>
              Description: <Text style={styles.postItem}>{sortedPost.description}</Text>
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "LightGray",
  },
  title: {
    fontSize: 40,
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  postContainer: {
    marginBottom: 20,
    padding: 15,
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: "#f8f8f8",
  },
  postItem: {
    fontSize: 18,
    color: "black",
    marginBottom: 5,
    fontWeight: "normal",
  },
  itemTitle: {
    fontSize: 15,
    color: "black",
    marginBottom: 5,
    marginTop: 10,
    fontWeight: "bold",
  },
  resturantTitle: {
    fontSize: 20,
    color: "black",
    marginBottom: 8,
    fontWeight: "bold",
  },
  noPostsText: {
    fontSize: 18,
    color: "back",
    textAlign: "center",
  },
});
