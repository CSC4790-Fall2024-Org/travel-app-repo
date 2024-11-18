// import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
// import React, { useState, useEffect } from "react";
// import { Text, View, StyleSheet, ScrollView } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { db } from './firebase';
// import { getAuth } from "firebase/auth";
// import Stars from "./Stars"

// export default function UserPosts() {
//   const [userPosts, setUserPosts] = useState([]);
//   const navigation = useNavigation();
//   const auth = getAuth();

//   // Function to fetch city name using location_id
//   const fetchCityFromLocationId = async (locationId) => {
//     try {
//       const locationRef = doc(db, "locations", locationId);
//       const locationDoc = await getDoc(locationRef);
//       return locationDoc.exists() ? locationDoc.data().city : "Unknown Location";
//     } catch (error) {
//       console.error("Error fetching location city: ", error);
//       return "Unknown Location";
//     }
//   };

//   // Function to fetch user's posts and attach city names
//   // const fetchUserFoodPosts = async () => {
//   //   try {
//   //     const userId = auth.currentUser ? auth.currentUser.uid : null;
//   //     if (!userId) {
//   //       console.log("No user ID found - user may not be signed in.");
//   //       return;
//   //     }

//   //     const postsRef = collection(db, "foodPosts");
//   //     const userPostsQuery = query(postsRef, where("userid", "==", userId));
//   //     const querySnapshot = await getDocs(userPostsQuery);

//   //     if (!querySnapshot.empty) {
//   //       const fetchedPosts = await Promise.all(
//   //         querySnapshot.docs.map(async (doc) => {
//   //           const postData = doc.data();
//   //           const city = await fetchCityFromLocationId(postData.location_id); // Fetch city name using location_id
//   //           return { id: doc.id, ...postData, city };
//   //         })
//   //       );
//   //       setUserPosts(fetchedPosts);
//   //     } else {
//   //       console.log("No posts found for the current user.");
//   //       setUserPosts([]);
//   //     }
//   //   } catch (error) {
//   //     console.error("Error fetching user food posts:", error);
//   //   }
//   // };
//   const fetchUserFoodPosts = async () => {
//     try {
//       const userId = auth.currentUser ? auth.currentUser.uid : null;
//       if (!userId) {
//         console.log("No user ID found - user may not be signed in.");
//         return;
//       }

  
//       const postsRef = collection(db, "foodPosts");
//       const userPostsQuery = query(postsRef, where("userid", "==", userId));
//       const querySnapshot = await getDocs(userPostsQuery);
  
//       if (!querySnapshot.empty) {
//         const fetchedPosts = await Promise.all(
//           querySnapshot.docs.map(async (doc) => {
//             const postData = doc.data();
//             console.log("Post Data:", postData); // Debugging line
  
//             // Safely fetch city
//             const city = postData.location_id 
//               ? await fetchCityFromLocationId(postData.location_id) 
//               : "Unknown Location";
  
//             return { id: doc.id, ...postData, city };
//           })
//         );
//         setUserPosts(fetchedPosts);
//       } else {
//         console.log("No posts found for the current user.");
//         setUserPosts([]);
//       }

//     } catch (error) {
//       console.error("Error fetching user food posts:", error);
//     }
//   };
  

//   // Fetch posts on component mount
//   useEffect(() => {
//     fetchUserFoodPosts();
//   }, []);

//   const handlePostPress = (post) => {
//     navigation.navigate("PostDetails", { post });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Your Posts</Text>
//       <ScrollView>
//         {userPosts.length > 0 ? (
//           userPosts.map((post) => (
//             <View key={post.id} style={styles.postContainer}>

              
//               <Text style={styles.postrestaurant}>Name: {post.restaurant}</Text>
              
//               <Text style={styles.postlocat_id}>Location: {post.city}</Text>

//               <Text style={styles.postmealTime}>Meal Time: {post.mealTime}</Text>
//               <Text style={styles.postrestaurantType}>Type: {post.restaurantType}</Text>
//               <Text style={styles.postexpense}>Expense: {post.expense}</Text>
//               <Text style={styles.poststars}>Stars: {post.stars}</Text>
//               <Text style={styles.postlink}>Link: {post.link}</Text>
//               <Text style={styles.postdietary}>Dietary Restrictions: {post.dietary}</Text>
//               <Text style={styles.postdescription}>Description: {post.description}</Text>

//             </View>
//           ))
//         ) : (
//           <Text style={styles.noPostsText}>No food posts available</Text>
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 50,
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   postContainer: {
//     marginBottom: 15,
//     padding: 15,
//     borderRadius: 8,
//     backgroundColor: "#f8f8f8",
//   },
//   postlocat_id: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   postrestaurant: { fontSize: 16 },
//   postmealTime: { fontSize: 16 },
//   postrestaurantType: { fontSize: 16 },
//   postexpense: { fontSize: 16 },
//   poststars: { fontSize: 25 },
//   postlink: { fontSize: 16 },
//   postdietary: { fontSize: 16 },
//   postdescription: { fontSize: 16 },
//   noPostsText: {
//     textAlign: "center",
//     fontSize: 16,
//     color: "#888",
//     marginTop: 20,
//   },
// });



import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db } from './firebase';
import { getAuth } from "firebase/auth";

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
      const userPostsQuery = query(postsRef, where("userid", "==", userId));
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
      <Text style={styles.title}>Your Posts</Text>
      <ScrollView>
        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <View key={post.id} style={styles.postContainer}>
              <Text style={styles.postrestaurant}>Name: {post.restaurant}</Text>
              <Text style={styles.postlocat_id}>Location: {post.city}</Text>
              <Text style={styles.postmealTime}>Meal Time: {post.mealTime}</Text>
              <Text style={styles.postrestaurantType}>Type: {post.restaurantType}</Text>
              <Text style={styles.postexpense}>Expense: {post.expense}</Text>
              <Text style={styles.poststars}>Stars: {post.stars}</Text>
              <Text style={styles.postlink}>Link: {post.link}</Text>
              <Text style={styles.postdietary}>Dietary Restrictions: {post.dietary}</Text>
              <Text style={styles.postdescription}>Description: {post.description}</Text>
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
    //fontWeight: "bold",
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
