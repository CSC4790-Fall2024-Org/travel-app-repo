import React from "react";
import { Text, View, StyleSheet } from "react-native";


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



export default function Posts() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Posts</Text>
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
});
