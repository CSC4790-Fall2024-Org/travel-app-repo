import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { db } from './firebase';
import { getAuth } from "firebase/auth";
import Stars from "./Stars";

export default function UserPosts() {
  const [userPosts, setUserPosts] = useState([]);
  const auth = getAuth();

  const fetchUserFoodPosts = async () => {
    try {
      const userId = auth.currentUser ? auth.currentUser.uid : null;
      if (!userId) {
        console.log("No user ID found - user may not be signed in.");
        return;
      }

      const postsRef = collection(db, "foodPosts");
      const userPostsQuery = query(postsRef, where("userid", "==", userId));
      const querySnapshot = await getDocs(userPostsQuery);

      let fetchedPosts = [];
      
      if (!querySnapshot.empty) {
        fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched Posts for User:", fetchedPosts);
      } else {
        console.log("No posts found for the current user.");
      }

      setUserPosts(fetchedPosts); 
    } catch (error) {
      console.error("Error fetching user food posts:", error);
    }
  };

  useEffect(() => {
    fetchUserFoodPosts();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Posts</Text>
      <ScrollView>
        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <View key={post.id} style={styles.postContainer}>
              {post.locat_id && <Text style={styles.postlocat_id}>Location: {post.locat_id}</Text>}
              {post.restaurant && <Text style={styles.postrestaurant}>Name: {post.restaurant}</Text>}
              {post.mealTime && <Text style={styles.postmealTime}>Meal Time: {post.mealTime}</Text>}
              {post.restaurantType && <Text style={styles.postrestaurantType}>Type: {post.restaurantType}</Text>}
              {post.expense && <Text style={styles.postexpense}>Expense: {post.expense}</Text>}
              {post.stars && <Stars style={styles.poststars} readOnly={true}>Stars: {post.stars}</Stars>}
              {post.link && <Text style={styles.postlink}>Link: {post.link}</Text>}
              {post.dietary && <Text style={styles.postdietary}>Dietary Restrictions: {post.dietary}</Text>}
              {post.description && <Text style={styles.postdescription}>Description: {post.description}</Text>}
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
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  postContainer: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
  },
  postlocat_id: {
    fontSize: 16,
    fontWeight: "bold",
  },
  postrestaurant: { fontSize: 16 },
  postmealTime: { fontSize: 16 },
  postrestaurantType: { fontSize: 16 },
  postexpense: { fontSize: 16 },
  poststars: { fontSize: 25 },
  postlink: { fontSize: 16 },
  postdietary: { fontSize: 16 },
  postdescription: { fontSize: 16 },
  noPostsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});
