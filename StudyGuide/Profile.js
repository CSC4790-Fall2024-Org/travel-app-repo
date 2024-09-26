import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { getFirestore, doc, getDoc } from "firebase/firestore"; 

export default function Profile({ route }) {
  const { uid } = route.params; // Get the uid from the route parameters
  const [profileData, setProfileData] = useState(null); // State to hold user profile data
  const db = getFirestore(); // Firestore database instance

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const docRef = doc(db, "users", uid); // Reference to the specific user document using uid
        const docSnap = await getDoc(docRef);
  


        if (docSnap.exists()) {
          setProfileData(docSnap.data()); // Set the user data to state
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching profile data: ", error);
      }
    };

    fetchProfileData(); // Fetch profile data when component mounts
  }, [db, uid]);

  if (!profileData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Page</Text>
      <Text style={styles.profileItem}>Name: {profileData.name}</Text>
      <Text style={styles.profileItem}>Email: {profileData.email}</Text>
      <Text style={styles.profileItem}>City: {profileData.city}</Text>
      <Text style={styles.profileItem}>Year: {profileData.year}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, fontWeight: "bold" },
  profileItem: { fontSize: 18, marginVertical: 10 },
});
