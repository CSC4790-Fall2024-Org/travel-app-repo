import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, Button } from "react-native";
import { useNavigation, firestore } from "@react-navigation/native";
import { db } from './firebase';
//import firestore from '@react-native-firebase/firestore';
//for new attempt to load data:
//import { collection, query, where, getDocs } from "firebase/firestore";

  
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

 /*   //two things happen on pressing a location
  const handleLocationPress = (locationId) => {
    navigateToPosts();
    displayPosts();
  };*/

 // function useSortedPosts(locationId){
   // const [sortedPosts, setSortedPosts]= useState([]);

    //hook
    
      //const fetchSortedPosts = async (locationId) => {
        async function fetchSortedPosts (locationId) {
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

    //return
   // return sortedPosts;
  //}

   // const handleLocationPress = (locationId) => {
      //call function
      //fetchSortedPosts(locationId);
      
      
   // };

      // Function to fetch food posts (filtered) documents from Firestore
    /*const fetchSortedPosts = async (locationId) => {
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
  
    useEffect(() => {
      fetchSortedPosts();
    }, []); */

    

/*most up to date!!!!!!
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


    const handleLocationPress = (locationId) => {
      //this one line navigates you to Posts page:
      navigation.navigate("Posts"); // Navigate to posts page with location ID
     
    };
  
    // orig return
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
   
   /* return (
      <View style={styles.container}>
        <Text style={styles.title}>Select Location</Text>
        <ScrollView>
          {locations.map((location) => (
            <View key={location.id} style={styles.locationContainer}>
              <Button
                title={location.city} // Assuming each location document has a 'name' field
                //onPress={() => (handleLocationPress(location.id), setShowView)}
                onPress={() => (fetchSortedPosts(location.id), setShowView(true))}
              />
              {showView && (
                <ScrollView>
                  {sortedPosts.map((sortedPost) => (
                    <View key={sortedPost.id} style={styles.postContainer}></View>
                  ))}
                </ScrollView>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    );*/
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
    postContainer: {
      marginBottom: 15,
    },
  });