import { Text, View, StyleSheet, ScrollView, Button } from "react-native";
import { db } from './firebase';
import React, { useState, useEffect } from "react";
import { getFirestore, firestore, where, collection, getDocs, query,  Filter, doc, QueryFieldFilterConstraint, DocumentSnapshot, QuerySnapshot, getDoc } from "firebase/firestore";


import { useNavigation } from "@react-navigation/native";

export default function Posts({ route }) { 
  const db = getFirestore(); // Firestore database instance
  const navigation = useNavigation();
  const [sortedPosts, setSortedPosts]= useState([]);
  const { location_id }=route.params;

  const [locationCity, setLocationCity] = useState(''); // State to store city name
 

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

  const [locatInfo, setlocatInfo]= useState([]);


const fetchSortedPosts = async () => {
  try {
    //console.log(location_id);

    // Build the query with the collection and where filter
    const foodPostsRef = collection(db, "foodPosts");
    const q = query(foodPostsRef, where('locat_id', '==', location_id));

    // Execute the query and get the documents
    const querySnapshot = await getDocs(q);

    const fetchedSortedPosts = [];
    querySnapshot.forEach((doc) => {
      fetchedSortedPosts.push({ id: doc.id, ...doc.data() });
    });
    setSortedPosts(fetchedSortedPosts); // Update state with the filtered posts
  } catch (error) {
    console.error("Error fetching posts for this location: ", error);
  }
};
useEffect(() => {
  fetchLocationCity();
  fetchSortedPosts();
}, [db, location_id]);


if (!sortedPosts) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Loading...</Text>
    </View>
  );
}// end of getting the Food Posts for the location chosen in FindFoodPosts

//get Location using location Id passed into this page
const fetchLocatInfo = async () => {
  try {
    console.log(location_id);

    // Build the query with the collection and where filter
    const locatRef = collection(db, "locations");
    const q = query(foodPostsRef, where('locat_id', '==', location_id));

    // Execute the query and get the documents
    const querySnapshot = await getDocs(q);

    const fetchedLocatInfo = [];
    querySnapshot.forEach((doc) => {
      fetchedLocatInfo.push({ id: doc.id, ...doc.data() });
    });
    setlocatInfo(fetchedLocatInfo); // Update state with the filtered posts
  } catch (error) {
    console.error("Error fetching info for this location: ", error);
  }
};
useEffect(() => {
  fetchSortedPosts();
}, [db, 'locations']);

//come back to userId field that has been taken out of foodPosts fields
//also need to add addr (address), userId, food_city, link
//make sure the field names match in here and create food posts so that 

  return (
    <View style={styles.container}>

      <Text style={styles.title}>{locationCity} Food Posts</Text>
    
      <View style={styles.container}>
            <Text style={styles.title}>{locationCity} Food Posts</Text>
        </View>
      <ScrollView>
        

      <Text style={styles.title}>Posts with ID {location_id}  </Text>
    <ScrollView>
    {locatInfo.map((location) => (
        <View key={location.id} style={styles.container}>
          <Button
            title={location.city} // Assuming each location document has a 'name' field
            onPress={() => handleLocationPress(location.id)}
          />
          <Text style={styles.itemTitle}> Locat City: <Text style={styles.postItem}>{locatInfo.city}</Text></Text>
          <Text style={styles.itemTitle}> Locat Country: <Text style={styles.postItem}>{locatInfo.country}</Text></Text>
        </View>
      ))}

      {sortedPosts.map((sortedPost) => (
            <View key={sortedPost.id} style={styles.container}>
            <Text style={styles.itemTitle}> Post from: <Text style={styles.postItem}>{sortedPost.userId}</Text></Text>
            <Text style={styles.itemTitle}> Restaurant Name: <Text style={styles.postItem}>{sortedPost.restaurant}</Text></Text>

            <Text style={styles.itemTitle}> Expense: <Text style={styles.postItem}>{sortedPost.expense}</Text></Text>
            <Text style={styles.itemTitle}> Meal Time: <Text style={styles.postItem}>{sortedPost.mealTime}</Text></Text>
            <Text style={styles.itemTitle}> Restaurant Type: <Text style={styles.postItem}>{sortedPost.restaurantType}</Text></Text>
            <Text style={styles.itemTitle}> Location Id: <Text style={styles.postItem}>{sortedPost.locat_id}</Text></Text>
            <Text style={styles.itemTitle}> Address: <Text style={styles.postItem}>{sortedPost.addr}</Text></Text>
            <Text style={styles.itemTitle}> Link to website: <Text style={styles.postItem}>{sortedPost.link}</Text></Text>
            <Text style={styles.itemTitle}> Description/Message: <Text style={styles.postItem}>{sortedPost.description}</Text></Text>
        </View>

          
        
          
      ))}
    </ScrollView>
    </View>


  );
}

// make address and link to website be conditional, only show if added
// user id make say the user name
//add dietary restrictions here

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
    fontWeight: "bold" 
  },
  postContainer: {
    marginBottom: 15,
  },
  postItem: { 
    fontSize: 18, 
    marginVertical: 10, 
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "normal" ,
  },
  itemTitle: { 
    fontSize: 22, 
    marginVertical: 10, 
    textAlign: "center",
    fontWeight: "bold" ,
    marginBottom: 5,
  },
});
