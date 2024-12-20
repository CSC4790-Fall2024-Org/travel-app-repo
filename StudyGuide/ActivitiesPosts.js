import { Text, View, StyleSheet, ScrollView, Button } from "react-native";
import { db } from './firebase';
import React, { useState, useEffect } from "react";
import { getFirestore, firestore, where, collection, getDocs, query,  Filter, doc, QueryFieldFilterConstraint, DocumentSnapshot, QuerySnapshot, getDoc } from "firebase/firestore";
import Stars from "./Stars"
import { useNavigation } from "@react-navigation/native";

export default function ActivitiesPosts({ route }) { 
  const db = getFirestore(); // Firestore database instance
  const navigation = useNavigation();
  const [sortedActPosts, setSortedActPosts]= useState([]);
  const { location_id }=route.params;
  const [locationCity, setLocationCity] = useState(''); // State to store city name

 
//get Location using location Id passed into this page
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


const fetchSortedActPosts = async () => {
  try {
    //console.log(location_id);

    // Build the query with the collection and where filter
    const activityPostsRef = collection(db, "activityPosts");
    const q = query(activityPostsRef, where('locat_id', '==', location_id));

    // Execute the query and get the documents
    const querySnapshot = await getDocs(q);

    const fetchedSortedActPosts = [];
    querySnapshot.forEach(async (postDoc) => {
     
     fetchedSortedActPosts.push({ id: postDoc.id, ...postDoc.data() });


    });
    setSortedActPosts(fetchedSortedActPosts); // Update state with the filtered posts

  } catch (error) {
    console.error("Error fetching posts for this location: ", error);
  }
  
}  

useEffect(() => {
  fetchLocationCity();
  
}, [db, location_id]);


if (!sortedActPosts) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Loading...</Text>
    </View>
  );
}// end of getting the Food Posts for the location chosen in FindFoodPosts

useEffect(() => {
  fetchSortedActPosts();
}, [db, 'locations']);


  return (
    <View style={styles.container}>

     

    <ScrollView>
    <Text style={styles.title}> Things to do in {locationCity} </Text>
              {/* Check if sortedPosts is empty */}
    {sortedActPosts.length === 0 ? (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={styles.noPostsText}>No activities posts yet. Go to create post to be the first!</Text>
        </View>
      ) : (
     sortedActPosts.map((sortedActPost) => (


            <View key={sortedActPost.id} style={styles.postContainer}>
              <Text style={styles.itemPosterInfo}>
                Post from {sortedActPost.posterName} who visited {sortedActPost.posterVisitedCity} in {sortedActPost.posterYear}
              </Text>

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.resturantTitle}>{sortedActPost.activityName}</Text>
            <Stars rating={sortedActPost.stars} readOnly={true} />
            </View>
            
                    
            <Text style={styles.itemTitle}> Expense: <Text style={styles.postItem}>{sortedActPost.expense}</Text></Text>
            <Text style={styles.itemTitle}> Activity Type: <Text style={styles.postItem}>{sortedActPost.activityType}</Text></Text>
            
              
             <Text style={styles.itemTitle}> Activity Time: <Text style={styles.postItem}>{sortedActPost.activityTime}</Text></Text>
             
            {sortedActPost.address ? (
              <Text style={styles.itemTitle}>Address: <Text style={styles.postItem}>{sortedActPost.address}</Text></Text>
            ) : null}
            
            
            
            {sortedActPost.link ? (
              <Text style={styles.itemTitle}>Link to website: <Text style={styles.postItem}>{sortedActPost.link}</Text></Text>
            ) : null}
            
            <Text style={styles.itemTitle}> Description/Message: <Text style={styles.postItem}>{sortedActPost.description}</Text></Text>
        </View>
      ))
    )}       
    </ScrollView>
    </View>
  );
}

// make address and link to website be conditional, only show if added
// user id make say the user name
//add dietary restrictions here
// also add stars

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "LightGray",
  },
  title: {
    fontSize: 40,
  //  color: '#70A533',
  //  fontFamily: 'San Francisco',
  //  color: "green",
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
  //  backgroundColor: "#90EE90",
    shadowColor: "#000", // Shadow for card elevation
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android elevation
  },
  postItem: {
    fontSize: 15,
    color: "black",
    marginTop: 5, 

    fontWeight: "normal",
  //  color: "green",
  //  fontFamily: 'San Francisco',
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
  //  fontFamily: 'San Francisco',
   // color: "green",
  },
  itemPosterInfo: {
    fontSize: 12,
    color: "gray", 
    marginBottom: 5,
    marginTop: 10,
    fontWeight: "italic",
  //  fontFamily: 'San Francisco',
  },

  noPostsText: {
    fontSize: 18,
    color: "back",
    textAlign: "center",
  },
});