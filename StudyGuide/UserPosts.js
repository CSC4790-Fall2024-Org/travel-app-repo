import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db } from './firebase';
import { getAuth } from "firebase/auth";

export default function UserPosts() {
  const [userPosts, setUserPosts] = useState([]);
  const navigation = useNavigation();
  const auth = getAuth();

  const fetchUserFoodPosts = async () => {
    const User = auth.User;
    try {
      const foodPostsRef = collection(db, "foodPosts");
      const userPostsQuery = query(foodPostsRef, where("userId", "==", User.uid)); // Use currentUser.uid
      const querySnapshot = await getDocs(userPostsQuery);

      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setUserPosts(fetchedData);
    } catch (error) {
      console.error("Error fetching user food posts: ", error);
    }
  };

  useEffect(() => {
    fetchUserFoodPosts();
  }, []);

  const handlePostPress = (post) => {
    navigation.navigate("PostDetails", { post });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Food Posts</Text>
      <ScrollView>
        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <View key={post.id} style={styles.postContainer}>
              <TouchableOpacity onPress={() => handlePostPress(post)}>
                <Text style={styles.postlocat_id}>Location: {post.locat_id}</Text>
                <Text style={styles.postrestaurant}>Name: {post.restaurant}</Text>
                <Text style={styles.postmealTime}>Meal Time: {post.mealTime}</Text>
                <Text style={styles.postrestaurantType}>Type: {post.restaurantType}</Text>
                <Text style={styles.postexpense}>Expense: {post.expense}</Text>
                <Text style={styles.poststars}>Stars: {post.stars}</Text>
                <Text style={styles.postlink}>Link: {post.link}</Text>
                <Text style={styles.postdietary}>Dietary Restrictions: {post.dietary}</Text>
                <Text style={styles.postdescription}>Description: {post.description}</Text>
              </TouchableOpacity>
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
  postrestaurant: { fontSize: 16, },
  postmealTime: { fontSize: 16, },
  postrestaurantType: { fontSize: 16, },
  postexpense: { fontSize: 16, },
  poststars: { fontSize: 25, },
  postlink: { fontSize: 16, },
  postdietary: { fontSize: 16, },
  postdescription: { fontSize: 16, },
  noPostsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});
