import { Text, View, StyleSheet, ScrollView, Button } from "react-native";
import { db } from './firebase';
import React, { useState, useEffect } from "react";
import { getFirestore, firestore, where, collection, getDocs, query,  Filter, doc, QueryFieldFilterConstraint, DocumentSnapshot, QuerySnapshot, getDoc } from "firebase/firestore";
import Stars from "./Stars"

import { useNavigation } from "@react-navigation/native";

export default function Posts({ route }) { 
  const db = getFirestore(); // Firestore database instance
  const navigation = useNavigation();
  const [sortedPosts, setSortedPosts]= useState([]);
  const { location_id }=route.params;
  const [locationCity, setLocationCity] = useState(''); // State to store city name

  //state to store user name, pulled from db using userid:
  const [posterInfo, setPosterInfo ] = useState('');

  const [posterName, setPosterName ] = useState('');
  const [posterYr, setPosterYr ] = useState('');

 

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

  const fetchPosterInfo = async (posterId) => {
    try {
      const posterRef = doc(db, "users");//get users collection from db
      const q2 = query(posterRef, where('userId', '==', posterId));//match user id to poster id for the doc
      const posterDoc = await getDoc(q2);//get doc from users collection for correct userId
     // const fetchedSortedPosts = [];
      if (posterDoc.exists()) {
        setPosterInfo(posterDoc.data()); // Assuming 'name' is the field name for docs in 
      } else {
        setPosterInfo("Unknown User Info");
      }
    } catch (error) {
      console.error("Error fetching user info: ", error);
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

    //new start
    
    //new end 


    const fetchedSortedPosts = [];
    querySnapshot.forEach(async (postDoc) => {
     //orig: 
     fetchedSortedPosts.push({ id: postDoc.id, ...postDoc.data() });
      
      /*new
      //fetchedSortedPosts.push(fetchPosterName(doc.userId));
      const posterId = postDoc.data().userId;
      const posterRef = doc(db, "users");//get users collection from db
      const q2 = query(posterRef, where('userId', '==', posterId));//match user id to poster id for the doc
      const posterDoc = await getDoc(q2);//get doc from users collection for correct userId
      if(posterDoc.exists){
        setPosterName(posterDoc.data().name);
        setPosterYr(posterDoc.data().year);
        
        const posterNameVar = posterDoc.data().name;
        
      }*/
      //fetchedSortedPosts.push({ id: postDoc.id, ...postDoc.data() });
       //fetchedSortedPosts.push(...posterName, posterYr);

      /*  //new
      const posterRef = collection(db, "users");
      const q2 = query(posterRef, where('userId', '==', doc.userId));
      const querySnapshot2 = await getDoc(q2);
      if (posterDoc.exists()) {
        setPosterInfo(posterDoc.data().name); // Assuming 'name' is the field name for docs in 
      } else {
        setPosterInfo("Unknown User Info");
      }
    } catch (error) {
      console.error("Error fetching user info: ", error);
    }
      //end of new*/

    });
    setSortedPosts(fetchedSortedPosts); // Update state with the filtered posts
  
    /*new start
    sortedPosts.forEach(async (postDoc)=>{
      if(postDoc.data().userId){
        const posterId = postDoc.data().userId;
      const posterRef = doc(db, "users");//get users collection from db
      const q2 = query(posterRef, where('userId', '==', posterId));//match user id to poster id for the doc
      const posterDoc = await getDoc(q2);//get doc from users collection for correct userId
      setPosterInfo(posterDoc.data());
      setPosterName(posterDoc.data().name);
        setPosterYr(posterDoc.data().year);

      }
    });
    new end*/

  } catch (error) {
    console.error("Error fetching posts for this location: ", error);
  }
};
useEffect(() => {
  fetchLocationCity();
  fetchSortedPosts();
  fetchPosterInfo();
}, [db, location_id]);


if (!sortedPosts) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Loading...</Text>
    </View>
  );
}// end of getting the Food Posts for the location chosen in FindFoodPosts

//get Location using location Id passed into this page

useEffect(() => {
  fetchSortedPosts();
}, [db, 'locations']);
useEffect(() => {
  fetchPosterInfo();
}, []);

//come back to userId field that has been taken out of foodPosts fields
//also need to add addr (address), userId, food_city, link
//make sure the field names match in here and create food posts so that 

  return (
    <View style={styles.container}>

      <Text style={styles.title}>{locationCity} Food Posts</Text>
    

    <ScrollView>
   {/* 
    {locatInfo.map((location) => (
        <View key={location.id} style={styles.container}>
          <Button
            title={location.city} // Assuming each location document has a 'name' field
            onPress={() => handleLocationPress(location.id)}
          />
          <Text style={styles.itemTitle}> Locat City: <Text style={styles.postItem}>{locatInfo.city}</Text></Text>
          <Text style={styles.itemTitle}> Locat Country: <Text style={styles.postItem}>{locatInfo.country}</Text></Text>
        </View>
      ))} */}

      {sortedPosts.map((sortedPost) => (


            <View key={sortedPost.id} style={styles.container}>
            
            <Text style={styles.itemTitle}> Post from ID: <Text style={styles.postItem}>{sortedPost.userId}</Text></Text>
            <Text style={styles.itemTitle}> Restaurant Name: <Text style={styles.postItem}>{sortedPost.restaurant}</Text></Text>
            
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={styles.itemTitle}> Poster Name: {fetchPosterInfo(sortedPost.userId)} </Text></View>
            <Text style={styles.itemTitle}> Poster's Year Abroad : <Text style={styles.postItem}>{posterYr}</Text></Text>

            {/* change so it shows stars */}
            {/* <Text style={styles.itemTitle}> Rating: <Text style={styles.postItem}>{sortedPost.stars}</Text></Text>
             */}
             
            {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
             <Text style={styles.itemTitle}> Rating: <Stars style={styles.postItem}>{sortedPost.stars}</Stars></Text>
            </View> */}
            
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.itemTitle}>Rating:</Text>
              <Stars rating={sortedPost.stars} readOnly={true} />
            </View>
       
        

            <Text style={styles.itemTitle}> Expense: <Text style={styles.postItem}>{sortedPost.expense}</Text></Text>
            <Text style={styles.itemTitle}> Meal Time: <Text style={styles.postItem}>{sortedPost.mealTime}</Text></Text>
            <Text style={styles.itemTitle}> Restaurant Type: <Text style={styles.postItem}>{sortedPost.restaurantType}</Text></Text>
            <Text style={styles.itemTitle}> Location Id: <Text style={styles.postItem}>{sortedPost.locat_id}</Text></Text>
            
            {/* <Text style={styles.itemTitle}> Dietary Restrictions: <Text style={styles.postItem}>{sortedPost.dietary}</Text></Text>
             */}
            {sortedPost.dietary ? (
              <Text style={styles.itemTitle}>Dietary Restrictions: <Text style={styles.postItem}>{sortedPost.dietary}</Text></Text>
            ) : null}
            


            {sortedPost.addr ? (
              <Text style={styles.itemTitle}>Address: <Text style={styles.postItem}>{sortedPost.addr}</Text></Text>
            ) : null}
            
            {/* <Text style={styles.itemTitle}> Address: <Text style={styles.postItem}>{sortedPost.addr}</Text></Text> */}
            {/* <Text style={styles.itemTitle}> Link to website: <Text style={styles.postItem}>{sortedPost.link}</Text></Text>
             */}
            
            {sortedPost.link ? (
              <Text style={styles.itemTitle}>Link to website: <Text style={styles.postItem}>{sortedPost.link}</Text></Text>
            ) : null}
            
            
            
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
