import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Text, View, Button, FlatList, TextInput, StyleSheet } from "react-native";


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCz4zCemGt4XZKZCuCI_FwQwXSFxeaqvk0",
  authDomain: "studyguide-ea1f4.firebaseapp.com",
  projectId: "studyguide-ea1f4",
  storageBucket: "studyguide-ea1f4.appspot.com",
  messagingSenderId: "1090855415134",
  appId: "1:1090855415134:web:e68c6916b6c5b7e5d9f3cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [data, setData] = useState([]);
  const [userName, setUserName] = useState("");

  // Function to add a user's name to Firestore
  const addUserName = async () => {
    if (userName.trim()) {
      try {
        await addDoc(collection(db, "testCollection"), {
          name: userName,
        });
        console.log("User name added successfully!");
        setUserName(""); // Clear the input after submission
        fetchTestData(); // Refresh the data after adding a new user
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    } else {
      console.error("Name cannot be empty");
    }
  };

  // Function to fetch documents from Firestore
  const fetchTestData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "testCollection"));
      const fetchedData = [];
      querySnapshot.forEach((doc) => {
        fetchedData.push({ id: doc.id, ...doc.data() });
      });
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  useEffect(() => {
    fetchTestData(); // Fetch data on component mount
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Enter your name"
        value={userName}
        onChangeText={setUserName}
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 20,
          marginTop: 30,
          paddingHorizontal: 10,
        }}
      />
      <Button title="Add User Name" onPress={addUserName} />
      <Text style={{ fontSize: 20, marginVertical: 20 }}>User Names:</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>{item.name}</Text>
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});