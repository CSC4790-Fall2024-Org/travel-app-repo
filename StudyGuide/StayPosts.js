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
}// end of getting the Food Posts for the location chosen in FindStayPosts

useEffect(() => {
  fetchSortedStayPosts();
}, [db, 'locations']);


//come back to userId field that has been taken out of stayPosts fields
//also need to add addr (address), userId, food_city, link
//make sure the field names match in here and create food posts so that 

  return (
    <View style={styles.container}>

      <Text style={styles.title}> Places to Stay in {locationCity} </Text>
    

    <ScrollView>

    

     {sortedStayPosts.map((sortedStayPost) => (


            <View key={sortedStayPost.id} style={styles.container}>
            
             <Text style={styles.itemTitle}> Post from ID: <Text style={styles.postItem}>{sortedStayPost.userId}</Text></Text> 
            
            <Text style={styles.itemTitle}>  Name: <Text style={styles.postItem}>{sortedStayPost.stayName}</Text></Text>
            <Text style={styles.itemTitle}> Post from: <Text style={styles.postItem}>{sortedStayPost.posterName} who visited {sortedStayPost.posterVisitedCity} in {sortedStayPost.posterYear}</Text></Text>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.itemTitle}>Rating by {sortedStayPost.posterName}:</Text>
              <Stars rating={sortedStayPost.stars} readOnly={true} />
            </View>
            <Text style={styles.itemTitle}> Expense: <Text style={styles.postItem}>{sortedStayPost.expense}</Text></Text>
           {/* <Text style={styles.itemTitle}> Meal Time: <Text style={styles.postItem}>{sortedStayPost.mealTime}</Text></Text>*/}
            <Text style={styles.itemTitle}> Restaurant Type: <Text style={styles.postItem}>{sortedStayPost.restaurantType}</Text></Text>
             <Text style={styles.itemTitle}> Location Id: <Text style={styles.postItem}>{sortedStayPost.locat_id}</Text></Text> 
            
            {/* <Text style={styles.itemTitle}> Dietary Restrictions: <Text style={styles.postItem}>{sortedStayPost.dietary}</Text></Text>
             */}
          {/*   {sortedStayPost.dietary ? (
              <Text style={styles.itemTitle}>Dietary Restrictions: <Text style={styles.postItem}>{sortedStayPost.dietary}</Text></Text>
            ) : null}
            */}


            {sortedStayPost.addr ? (
              <Text style={styles.itemTitle}>Address: <Text style={styles.postItem}>{sortedStayPost.addr}</Text></Text>
            ) : null}
            
            
            
            {sortedStayPost.link ? (
              <Text style={styles.itemTitle}>Link to website: <Text style={styles.postItem}>{sortedStayPost.link}</Text></Text>
            ) : null}
            
            {/* <Text style={styles.itemTitle}> Address: <Text style={styles.postItem}>{sortedStayPost.addr}</Text></Text> 
            <Text style={styles.itemTitle}> Link to website: <Text style={styles.postItem}>{sortedStayPost.link}</Text></Text>
            */}
            
            <Text style={styles.itemTitle}> Description/Message: <Text style={styles.postItem}>{sortedStayPost.description}</Text></Text>
        </View>

    
          
      ))}        
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
