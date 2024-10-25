import { Text, View, StyleSheet, ScrollView, Button } from "react-native";
//import { Text, View, StyleSheet, ScrollView, Button } from "react-native";
//import { db } from './firebase';
//import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
//import { locationId, attribute } from './FindFoodPosts';
import { collection, getFirestore, getDocs, query, where, Filter, doc, QueryFieldFilterConstraint, DocumentSnapshot, QuerySnapshot } from "firebase/firestore";
//import firestore from '@react-native-firebase/firestore';
//for working code: 
import { useNavigation, firestore } from "@react-navigation/native";



export default function Posts({ route }) { 
  const db = getFirestore(); // Firestore database instance
  const navigation = useNavigation();
  const [sortedPosts, setSortedPosts]= useState([]);
  //const [showView, setShowView] = useState(false);
  const { location_id }=route.params;
 // const {foodcity}=route.params;

  //has bug
 
const fetchSortedPosts = async () => {
    try { 

      /*this was another attempt, but it used the other
      version of firestore:
      import firestore from '@react-native-firebase/firestore';

      //create a reference to foodPosts Collection
      const foodPostsRef = await getDocs(collection(db, "foodPosts"));
      //filter food posts by location Id
      const foodPostsInLocat = query(collection(db, "foodPosts"), where('locat_id', '==', location_id));
      //const postSnap = firestore().collection('foodPosts').where(Filter('locat_id', '==', location_id)).get();
     // const postSnap = await getDocs(collection(db, "foodPosts").where(Filter('locat_id', '==', location_id)));
      const fetchedSortedPosts = [];
     // const postSnap = await getDocs(q);
     const snap = await firestore()
     .collection('foodPosts').where('locat_id', '==', location_id)
     .get()
     .then(querySnapshot => {
       console.log('Total users: ', querySnapshot.size);
   
       querySnapshot.forEach(documentSnapshot => {
         console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
       
       fetchedSortedPosts.push({ id: documentSnapshot.id, ...documentSnapshot.data() }); 
      });
      setSortedPosts(fetchedSortedPosts);//setting what gets displayed

    
  
  } )*/


     //works but it lists all posts
     const postSnap = await getDocs(collection(db, "foodPosts"), where('locat_id', '==', location_id));
     //where to push docs with locat_id
      const fetchedSortedPosts = [];
      //pushing on fetched posts
      postSnap.forEach((doc) => {
        // fetchedSortedPosts.push({ id: doc.id, ...doc.data() });
        fetchedSortedPosts.push({ id: doc.id, ...doc.data() }); 
      });
      setSortedPosts(fetchedSortedPosts);//setting what gets displayed
    } catch (error) {
      console.error("Error fetching posts for this location: ", error);
    } //end of works
      
  }; //end of const 

useEffect(() => {
  fetchSortedPosts();
}, [db, 'foodPosts']);

if (!sortedPosts) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Loading...</Text>
    </View>
  );


}



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Posts with ID {location_id}  </Text>
    <ScrollView>
      {sortedPosts.map((sortedPost) => (
          <View key={sortedPost.id} style={styles.container}>
            <Text style={styles.itemTitle}> Post from <Text style={styles.postItem}>{sortedPost.userId}</Text></Text>
            <Text style={styles.itemTitle}> Restaurant Name: <Text style={styles.postItem}>{sortedPost.restaurant}</Text></Text>
            <Text style={styles.itemTitle}> Restaurant City: <Text style={styles.postItem}>{sortedPost.food_city}</Text></Text>
            <Text style={styles.itemTitle}> Message: <Text style={styles.postItem}>{sortedPost.message}</Text></Text>
            <Text style={styles.itemTitle}> Location Id: <Text style={styles.postItem}>{sortedPost.locat_id}</Text></Text>

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
