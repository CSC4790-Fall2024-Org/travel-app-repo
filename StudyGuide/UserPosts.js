import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db } from './firebase';
import { getAuth } from "firebase/auth";
import Stars from "./Stars"

export default function UserPosts() {
  const [userPosts, setUserPosts] = useState([]);
  const navigation = useNavigation();
  const auth = getAuth();

  // Function to fetch city name using location_id
  const fetchCityFromLocationId = async (locationId) => {
    try {
      const locationRef = doc(db, "locations", locationId);
      const locationDoc = await getDoc(locationRef);
      return locationDoc.exists() ? locationDoc.data().city : "Unknown Location";
    } catch (error) {
      console.error("Error fetching location city: ", error);
      return "Unknown Location";
    }
  };

  // Function to fetch user's posts and attach city names
  const fetchUserFoodPosts = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.log("No user ID found - user may not be signed in.");
        return;
      }

      const postsRef = collection(db, "foodPosts");
      const userPostsQuery = query(postsRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(userPostsQuery);

      if (!querySnapshot.empty) {
        const fetchedPosts = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const postData = doc.data();
            console.log("Post Data: ", postData); // Debugging line
            const city = postData.locationId
              ? await fetchCityFromLocationId(postData.locationId)
              : "Unknown Location";

            return { id: doc.id, ...postData, city };
          })
        );
        setUserPosts(fetchedPosts);
      } else {
        console.log("No posts found for the current user.");
        setUserPosts([]);
      }
    } catch (error) {
      console.error("Error fetching user food posts:", error);
    }
  };

  // Fetch posts on component mount
  useEffect(() => {
    fetchUserFoodPosts();
  }, []);

  const handlePostPress = (post) => {
    navigation.navigate("PostDetails", { post });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
      <Text style={styles.title}>Your Posts</Text>
        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <View key={post.id} style={styles.postContainer}>

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.itemTitle}>
                <Text style={styles.resturantTitle}>{post.restaurant}</Text>
              </Text>
              <Stars rating={post.stars} readOnly={true} />
            
              </View>

              <Text style={styles.postItem}>Location: {post.city}</Text>
              
              <Text style={styles.itemTitle}>
                Meal Time: <Text style={styles.postItem}>{post.mealTime}</Text>
              </Text>

              <Text style={styles.itemTitle}>
                Restaurant Type: <Text style={styles.postItem}>{post.restaurantType}</Text>
              </Text>
       
              <Text style={styles.itemTitle}>
                Expense: <Text style={styles.postItem}>{post.expense}</Text>
              </Text>

              {post.dietary && (
              <Text style={styles.itemTitle}>
                Dietary Accomodations: <Text style={styles.postItem}>{post.dietary}</Text>
              </Text>
            )}

             {post.address && (
              <Text style={styles.itemTitle}>
                Address: <Text style={styles.postItem}>{post.address}</Text>
              </Text>
            )}
            {post.link && (
              <Text style={styles.itemTitle}>
                Link to website: <Text style={styles.postItem}>{post.link}</Text>
              </Text>
            )}
 
        <Text style={styles.itemTitle}>
                Description: <Text style={styles.postItem}>{post.description}</Text>
        </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noPostsText}>No food posts available</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   // paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "LightGray"
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
    fontSize: 18,
    color: "black", 
    marginBottom: 8,
    fontWeight: "bold",
  },
  resturantTitle: {
    fontSize: 20,
    color: "black", 
    marginBottom: 8,
    fontWeight: "bold",
    textAlign: "center",
  },


  postlocat_id: {
    fontSize: 16,

  },
 
});