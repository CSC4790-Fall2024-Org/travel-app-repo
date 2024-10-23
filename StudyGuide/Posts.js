import { Text, View, StyleSheet, ScrollView } from "react-native";
//import { Text, View, StyleSheet, ScrollView, Button } from "react-native";
import { useNavigation, firestore } from "@react-navigation/native";
import { db } from './firebase';
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";

/*old version
const handleLocationPress = (locationId) => {
  //db.collection
const foodRef = firestore().collection('foodPosts');
const snapshot = foodRef.where('locat_id', '==', locationId).get();
if (snapshot.empty) {
  console.log('Error: No matching Posts.');
  return;
}  

snapshot.forEach(doc => {
  console.log(doc.id, '=>', doc.data());
});
};//end of most up to date*/



export default function Posts() { 
  const [sortedPosts, setSortedPosts]= useState([]);
  const [showView, setShowView] = useState(false);

const fetchSortedPosts = async (locationId) => {
 // async function fetchSortedPosts (locationId) {
    try {
      const q = query(collection(db, "foodPosts"), where("locat_id", "==", "locationId"));
      const snapshot = await getDocs(q);
      const fetchedSortedPosts = [];
      if (snapshot.empty) {
        console.log('Error: No matching Posts.');
        return;
      } 
      snapshot.forEach((doc) => {
        fetchedSortedPosts.push({ id: doc.id, ...doc.data() });
      });
      setSortedPosts(fetchedSortedPosts);
    } catch (error) {
      console.error("Error fetching posts for this location: ", error);
    }
  };
  useEffect(()=> {
  fetchSortedPosts();
}, []);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Posts</Text>
    <ScrollView>
      {sortedPosts.map((sortedPost) => (
          <View key={sortedPost.id} style={styles.postContainer}></View>
      ))}
    </ScrollView>
  </View>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  postContainer: {
    marginBottom: 15,
  },
});

