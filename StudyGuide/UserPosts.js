import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db } from './firebase';
import { getAuth } from "firebase/auth";
import Stars from "./Stars"

export default function UserPosts() {
  const [userFoodPosts, setUserFoodPosts] = useState([]);
  const [userActivityPosts, setUserActivityPosts] = useState([]);
  const [userStayPosts, setUserStayPosts] = useState([]);
  const navigation = useNavigation();
  const auth = getAuth();

  
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

            return { id: doc.id, ...postData};
          })
        );
        setUserFoodPosts(fetchedPosts);
      } else {
        console.log("No food posts found for the current user.");
        setUserFoodPosts([]);
      }
    } catch (error) {
      console.error("Error fetching user food posts:", error);
    }
  };

  // Fetch posts on component mount
  useEffect(() => {
    fetchUserFoodPosts();
  }, []);







  const fetchUserActivityPosts = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.log("No user ID found - user may not be signed in.");
        return;
      }

      const postsRef = collection(db, "activityPosts");
      const userPostsQuery = query(postsRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(userPostsQuery);

      if (!querySnapshot.empty) {
        const fetchedPosts = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const postData = doc.data();
            console.log("Post Data: ", postData); // Debugging line

            return { id: doc.id, ...postData};
          })
        );
        setUserActivityPosts(fetchedPosts);
      } else {
        console.log("No activity posts found for the current user.");
        setUserActivityPosts([]);
      }
    } catch (error) {
      console.error("Error fetching user activity posts:", error);
    }
  };

  // Fetch posts on component mount
  useEffect(() => {
    fetchUserActivityPosts();
  }, []);


  const fetchUserStayPosts = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.log("No user ID found - user may not be signed in.");
        return;
      }

      const postsRef = collection(db, "stayPosts");
      const userPostsQuery = query(postsRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(userPostsQuery);

      if (!querySnapshot.empty) {
        const fetchedPosts = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const postData = doc.data();
            console.log("Post Data: ", postData); // Debugging line

            return { id: doc.id, ...postData};
          })
        );
        setUserStayPosts(fetchedPosts);
      } else {
        console.log("No stay posts found for the current user.");
        setUserStayPosts([]);
      }
    } catch (error) {
      console.error("Error fetching user stay posts:", error);
    }
  };

  // Fetch posts on component mount
  useEffect(() => {
    fetchUserStayPosts();
  }, []);





  return (
    <View style={styles.container}>
      <ScrollView>
      <Text style={styles.mainTitle}>Your Food Posts</Text>
        {userFoodPosts.length > 0 ? (
          userFoodPosts.map((foodPost) => (
            <View key={foodPost.id} style={styles.postContainer}>

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.itemTitle}>
                <Text style={styles.title}>{foodPost.restaurant}</Text>
              </Text>
              <Stars rating={foodPost.stars} readOnly={true} />
            
              </View>
              <Text style={styles.itemTitle}>
                Location: <Text style={styles.postItem}>{foodPost.locat_city}</Text>
              </Text>
              
              <Text style={styles.itemTitle}>
                Meal Time: <Text style={styles.postItem}>{foodPost.mealTime}</Text>
              </Text>

              <Text style={styles.itemTitle}>
                Restaurant Type: <Text style={styles.postItem}>{foodPost.restaurantType}</Text>
              </Text>
       
              <Text style={styles.itemTitle}>
                Expense: <Text style={styles.postItem}>{foodPost.expense}</Text>
              </Text>

              {foodPost.dietary && (
              <Text style={styles.itemTitle}>
                Dietary Accomodations: <Text style={styles.postItem}>{foodPost.dietary}</Text>
              </Text>
            )}

             {foodPost.address && (
              <Text style={styles.itemTitle}>
                Address: <Text style={styles.postItem}>{foodPost.address}</Text>
              </Text>
            )}
            {foodPost.link && (
              <Text style={styles.itemTitle}>
                Link to website: <Text style={styles.postItem}>{foodPost.link}</Text>
              </Text>
            )}
 
        <Text style={styles.itemTitle}>
                Description: <Text style={styles.postItem}>{foodPost.description}</Text>
        </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noPostsText}>No food posts available</Text>
        )}



  <Text style={styles.mainTitle}>Your Activity Posts</Text>
        {userActivityPosts.length > 0 ? (
          userActivityPosts.map((activityPost) => (
            <View key={activityPost.id} style={styles.postContainer}>

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.itemTitle}>
                <Text style={styles.title}>{activityPost.activityName}</Text>
              </Text>
              <Stars rating={activityPost.stars} readOnly={true} />
            
              <Text style={styles.itemTitle}> Expense: <Text style={styles.postItem}>{activityPost.expense}</Text></Text>
            <Text style={styles.itemTitle}> Activity Type: <Text style={styles.postItem}>{activityPost.activityType}</Text></Text>
            
              
             <Text style={styles.itemTitle}> Activity Time: <Text style={styles.postItem}>{activityPost.activityTime}</Text></Text>
             
            {activityPost.address ? (
              <Text style={styles.itemTitle}>Address: <Text style={styles.postItem}>{activityPost.address}</Text></Text>
            ) : null}
            
            
            
            {activityPost.link ? (
              <Text style={styles.itemTitle}>Link to website: <Text style={styles.postItem}>{activityPost.link}</Text></Text>
            ) : null}
            
            <Text style={styles.itemTitle}> Description/Message: <Text style={styles.postItem}>{activityPost.description}</Text></Text>
        </View>

                </View>
          ))
        ) : (
          <Text style={styles.noPostsText}>No activity posts available</Text>
        )}




        
  <Text style={styles.mainTitle}>Your Stay Posts</Text>
        {userStayPosts.length > 0 ? (
          userStayPosts.map((stayPost) => (
            <View key={stayPost.id} style={styles.postContainer}>

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.itemTitle}>
                <Text style={styles.title}>{stayPost.stayName}</Text>
              </Text>
              <Stars rating={stayPost.stars} readOnly={true} />
              <Text style={styles.itemTitle}> Expense: <Text style={styles.postItem}>{stayPost.expense}</Text></Text>
          

            <Text style={styles.itemTitle}> Type of Place to Stay: <Text style={styles.postItem}>{stayPost.stayType}</Text></Text>
           
            <Text style={styles.itemTitle}> Ammenities: <Text style={styles.postItem}>{stayPost.ammenities}</Text></Text>
            <Text style={styles.itemTitle}> Would return? <Text style={styles.postItem}>{stayPost.wouldReturn}</Text></Text>

            {stayPost.address ? (
              <Text style={styles.itemTitle}>Address: <Text style={styles.postItem}>{stayPost.address}</Text></Text>
            ) : null}
            
            {stayPost.closeTo ? (
              <Text style={styles.itemTitle}>Nearby: <Text style={styles.postItem}>{stayPost.closeTo}</Text></Text>
            ) : null}
            
            {stayPost.link ? (
              <Text style={styles.itemTitle}>Link to website: <Text style={styles.postItem}>{stayPost.link}</Text></Text>
            ) : null}
            
  
            
            <Text style={styles.itemTitle}> Description/Message: <Text style={styles.postItem}>{stayPost.description}</Text></Text>
       
            
              
            
            
          
        </View>

                </View>
          ))
        ) : (
          <Text style={styles.noPostsText}>No stay posts available</Text>
        )}









        
      </ScrollView>
    </View>

    /////////// ACTIVITY SECTION 
   
      













//////////////////// STAY SECTION








  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   // paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "LightGray"
  },
  mainTitle: {
    fontSize: 30,
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
  title: {
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