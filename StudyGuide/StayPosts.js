import { Text, View, StyleSheet, ScrollView, Button } from "react-native";
import { db } from './firebase';
import React, { useState, useEffect } from "react";
import { getFirestore, firestore, where, collection, getDocs, query,  Filter, doc, QueryFieldFilterConstraint, DocumentSnapshot, QuerySnapshot, getDoc } from "firebase/firestore";
import Stars from "./Stars"
import { useNavigation } from "@react-navigation/native";

export default function StayPosts({ route }) { 
  const db = getFirestore(); // Firestore database instance
  const navigation = useNavigation();
  const [sortedStayPosts, setSortedStayPosts]= useState([]);
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

 // const [locatInfo, setlocatInfo]= useState([]);


const fetchSortedStayPosts = async () => {
  try {
    //console.log(location_id);

    // Build the query with the collection and where filter
    const StayPostsRef = collection(db, "stayPosts");
    const q = query(StayPostsRef, where('locat_id', '==', location_id));

    // Execute the query and get the documents
    const querySnapshot = await getDocs(q);

    const fetchedSortedStayPosts = [];
    querySnapshot.forEach(async (postDoc) => {
     //orig: 
     fetchedSortedStayPosts.push({ id: postDoc.id, ...postDoc.data() });

     //something to try:
     //const userId = UsersRef.data().userId;
     //const UsersRef = query(collection(db, "users"), where('userId', '==', userId));
     // const posterName = UsersRef.data().name;
     // firestore().collection('posts').add({posterName: posterName});

    });
    setSortedStayPosts(fetchedSortedStayPosts); // Update state with the filtered posts

  } catch (error) {
    console.error("Error fetching posts for this location: ", error);
  }
  
}  

useEffect(() => {
  fetchLocationCity();
  
}, [db, location_id]);


if (!sortedStayPosts) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Loading...</Text>
    </View>
  );
}// end of getting the Stay Posts for the location chosen in FindStayPosts

useEffect(() => {
  fetchSortedStayPosts();
}, [db, 'locations']);



  return (
    <View style={styles.container}>

    

    <ScrollView>
    <Text style={styles.title}> Places to Stay in {locationCity} </Text>
    
          {/* Check if sortedPosts is empty */}
          {sortedStayPosts.length === 0 ? (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={styles.noPostsText}>No stay posts yet. Go to create post to be the first!</Text>
        </View>
      ) : (

     sortedStayPosts.map((sortedStayPost) => (


            <View key={sortedStayPost.id} style={styles.container}>
              <Text style={styles.itemPosterTitle}>
                Post from <Text style={styles.itemPosterInfo}>{sortedStayPost.posterName} who visited {sortedStayPost.posterVisitedCity} in {sortedStayPost.posterYear}</Text>
              </Text>
             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.resturantTitle}>{sortedStayPost.stayName}</Text>
            <Stars rating={sortedStayPost.stars} readOnly={true} />
          
            </View>
           
            <Text style={styles.itemTitle}> Expense: <Text style={styles.postItem}>{sortedStayPost.expense}</Text></Text>
           {/* <Text style={styles.itemTitle}> Meal Time: <Text style={styles.postItem}>{sortedStayPost.mealTime}</Text></Text>*/}
            <Text style={styles.itemTitle}> Type of Place to Stay: <Text style={styles.postItem}>{sortedStayPost.stayType}</Text></Text>
           
            <Text style={styles.itemTitle}> Ammenities: <Text style={styles.postItem}>{sortedStayPost.ammenities}</Text></Text>
            <Text style={styles.itemTitle}> Would return? <Text style={styles.postItem}>{sortedStayPost.wouldReturn}</Text></Text>

            {sortedStayPost.address ? (
              <Text style={styles.itemTitle}>Address: <Text style={styles.postItem}>{sortedStayPost.address}</Text></Text>
            ) : null}
            
            {sortedStayPost.closeTo ? (
              <Text style={styles.itemTitle}>Nearby: <Text style={styles.postItem}>{sortedStayPost.closeTo}</Text></Text>
            ) : null}
            
            {sortedStayPost.link ? (
              <Text style={styles.itemTitle}>Link to website: <Text style={styles.postItem}>{sortedStayPost.link}</Text></Text>
            ) : null}
            
  
            
            <Text style={styles.itemTitle}> Description/Message: <Text style={styles.postItem}>{sortedStayPost.description}</Text></Text>
        </View>
      ))
    )}      
    </ScrollView>
    </View>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "LightGray"
    //backgroundColor: "#90EE90",
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
 //   fontFamily: 'San Francisco',
 //   color: "green",
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
  itemPosterTitle: {
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