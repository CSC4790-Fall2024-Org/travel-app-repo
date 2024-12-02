import { Text, View, StyleSheet, ScrollView, Button } from "react-native";
import { db } from './firebase';
import React, { useState, useEffect } from "react";
import { getFirestore, firestore, where, collection, getDocs, query,  Filter, doc, QueryFieldFilterConstraint, DocumentSnapshot, QuerySnapshot, getDoc } from "firebase/firestore";
import Stars from "./Stars"
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from 'react-native-dropdown-picker'; //dropdown picker


export default function FoodPosts({ route }) { 
  const db = getFirestore(); // Firestore database instance
  const navigation = useNavigation();
  const [sortedPosts, setSortedPosts]= useState([]);
  const { location_id }=route.params;
  const [locationCity, setLocationCity] = useState(''); // State to store city name

  // Dropdown Expense for filter
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [expense, setExpense] = useState(null);
  const [expenseItems, setExpenseItems] = useState([
    { label: '$', value: '$' },
    { label: '$$', value: '$$' },
    { label: '$$$', value: '$$$' }
  ]);

 
//get Location using location Id passed into this page
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


const fetchSortedPosts = async () => {
  try {
    //console.log(location_id);

    // Build the query with the collection and where filter
    const foodPostsRef = collection(db, "foodPosts");
    const q = query(foodPostsRef, where('locat_id', '==', location_id));

    // Execute the query and get the documents
    const querySnapshot = await getDocs(q);

    const fetchedSortedPosts = [];
    querySnapshot.forEach(async (postDoc) => {
     //orig: 
     fetchedSortedPosts.push({ id: postDoc.id, ...postDoc.data() });

     //something to try:
     //const userId = UsersRef.data().userId;
     //const UsersRef = query(collection(db, "users"), where('userId', '==', userId));
     // const posterName = UsersRef.data().name;
     // firestore().collection('posts').add({posterName: posterName});

    });
    setSortedPosts(fetchedSortedPosts); // Update state with the filtered posts

  } catch (error) {
    console.error("Error fetching posts for this location: ", error);
  }
  
}  

useEffect(() => {
  fetchLocationCity();
  
}, [db, location_id]);


if (!sortedPosts) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Loading...</Text>
    </View>
  );
}// end of getting the Food Posts for the location chosen in FindFoodPosts

useEffect(() => {
  fetchSortedPosts();
}, [db, 'locations']);

  return (
    <ScrollView>

      <Text style={styles.title}>Places to Eat in {locationCity}</Text>
    
    {/* Expense */}
      <View style={{ width: '100%', zIndex: 2000, marginBottom: 10 }}>
          <DropDownPicker
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            placeholderStyle={styles.dropdownPlaceholder}
            labelStyle={styles.dropdownLabelStyle}
            itemStyle={styles.dropdownItem}
            badgeStyle={styles.dropdownBadge}

            open={expenseOpen}
            value={expense}
            items={expenseItems}
            setOpen={setExpenseOpen}
            setValue={setExpense}
            setItems={setExpenseItems}
            placeholder="Filter by expense:"
            zIndex={2000}
            zIndexInverse={1000}
            listMode="SCROLLVIEW"
          />    
      </View>   

  {sortedPosts.map((sortedPost) => (
    <View key={sortedPost.id} style={styles.postContainer}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={styles.itemTitle}>
        <Text style={styles.resturantTitle}>{sortedPost.restaurant}</Text>
      </Text>
      <Stars rating={sortedPost.stars} readOnly={true} />
     
      </View>

      <Text style={styles.itemTitle}>
        Post from: <Text style={styles.postItem}>{sortedPost.posterName} who visited {sortedPost.posterVisitedCity} in {sortedPost.posterYear}</Text>
      </Text>
  
      <Text style={styles.itemTitle}>
        Expense: <Text style={styles.postItem}>{sortedPost.expense}</Text>
      </Text>
      <Text style={styles.itemTitle}>
        Meal Time: <Text style={styles.postItem}>{sortedPost.mealTime}</Text>
      </Text>
      <Text style={styles.itemTitle}>
        Restaurant Type: <Text style={styles.postItem}>{sortedPost.restaurantType}</Text>
      </Text>
      {sortedPost.dietary && (
        <Text style={styles.itemTitle}>
          Dietary Accomodations: <Text style={styles.postItem}>{sortedPost.dietary}</Text>
        </Text>
      )}
      {sortedPost.address && (
        <Text style={styles.itemTitle}>
          Address: <Text style={styles.postItem}>{sortedPost.address}</Text>
        </Text>
      )}
      {sortedPost.link && (
        <Text style={styles.itemTitle}>
          Link to website: <Text style={styles.postItem}>{sortedPost.link}</Text>
        </Text>
      )}
      <Text style={styles.itemTitle}>
        Description: <Text style={styles.postItem}>{sortedPost.description}</Text>
      </Text>
    </View>
  ))}
</ScrollView>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
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
    fontSize: 15,
    color: "black", 
    marginBottom: 5,
    marginTop: 10,
    fontWeight: "bold",
  },
  resturantTitle: {
    fontSize: 20,
    color: "black", 
    marginBottom: 8,
    fontWeight: "bold",
  },

  //Dropdown style
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 0,
    marginTop: 10,
    width: '50%',
    marginLeft: 180,
    //maxWidth: 320,
  },
  dropdown: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    borderColor: 'transparent',
    borderWidth: 0, 
    fontSize: 14,
    color: 'grey',
    fontWeight: 'normal',
  },
  dropdownPlaceholder: {
    color: '#B0B0B0',
    fontWeight: 'normal',
  },
  dropdownLabelStyle: {
    fontSize: 14,
    fontWeight: 'normal',
    color: 'grey',
  },
  dropdownItem: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    color: 'grey',
    fontWeight: 'normal',
  },
  dropdownBadge: {
    backgroundColor: 'grey',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    fontSize: 14,
    fontWeight: 'normal',
  },
});