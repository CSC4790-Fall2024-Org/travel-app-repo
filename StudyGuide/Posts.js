import { Text, View, StyleSheet, ScrollView, Button } from "react-native";
//import { Text, View, StyleSheet, ScrollView, Button } from "react-native";
import { db } from './firebase';
//import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
//import { locationId, attribute } from './FindFoodPosts';
import { getFirestore, firestore, where, collection, getDocs, query,  Filter, doc, QueryFieldFilterConstraint, DocumentSnapshot, QuerySnapshot, getDoc } from "firebase/firestore";
//import firestore from '@react-native-firebase/firestore';
//for working code: 
import { useNavigation } from "@react-navigation/native";


//import {firestore, where, collection } from '@react-native-firebase/firestore';


export default function Posts({ route }) { 
  const db = getFirestore(); // Firestore database instance
  const navigation = useNavigation();
  const [sortedPosts, setSortedPosts]= useState([]);
  //const [showView, setShowView] = useState(false);
  const { location_id }=route.params;
  const [locationCity, setLocationCity] = useState(''); // State to store city name
 // const {foodcity}=route.params;

 /*
useEffect(()=> {
  const postSnap = firestore().collection('foodPosts')
  .where('locat_id', '==', location_id)
  onSnapshot(querySnapshot => {
    const sortedPostData = [];
    querySnapshot.forEach(doc => {
      sortedPostData.push({ id: doc.id, ...doc.data() });
    });
    setSortedPosts;

});
return ()=> postSnap;
}, []);
 */


  //has bug
 
  
// const fetchSortedPosts = async () => {
//     try { 

//      //works but it lists all posts
//      console.log(location_id);
//      const querySnapshot = await getDocs(collection(db, "foodPosts"), where('locat_id', '==', location_id));
//     // const querySnapshot = await getDocs(collection(db, "foodPosts"), where('locat_id', 'in', [{location_id}]));
//    // const querySnapshot= db.where('locat_id', '==', 'location_id');
//    //const querySnapshot = firestore().collection('foodPosts').where('locat_id', '==', location_id).get();
     
//      //where to push docs with locat_id
//       const fetchedSortedPosts = [];
//       //pushing on fetched posts
//       querySnapshot.forEach((doc) => {
//         // fetchedSortedPosts.push({ id: doc.id, ...doc.data() });
        
//         fetchedSortedPosts.push({ id: doc.id, ...doc.data() }); 
//       });
//       setSortedPosts(fetchedSortedPosts);//setting what gets displayed
      
//     } catch (error) {
//       console.error("Error fetching posts for this location: ", error);
//     } //end of works
      
//   }; //end of const 


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


}



  return (
    <View style={styles.container}>
      <Text style={styles.title}>{locationCity} Food Posts</Text>
    <ScrollView>
      {sortedPosts.map((sortedPost) => (
            <View key={sortedPost.id} style={styles.container}>
            <Text style={styles.itemTitle}> Post from <Text style={styles.postItem}>{sortedPost.userId}</Text></Text>
            <Text style={styles.itemTitle}> Restaurant Name: <Text style={styles.postItem}>{sortedPost.restaurant}</Text></Text>
            <Text style={styles.itemTitle}> Message: <Text style={styles.postItem}>{sortedPost.description}</Text></Text>
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
