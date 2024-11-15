import React, { useState, useEffect } from "react"; 
import { KeyboardAvoidingView, TouchableOpacity, Text, TextInput, View, StyleSheet, Button, Alert, ScrollView} from "react-native";
import { useNavigation } from '@react-navigation/native';
//import { Picker } from '@react-native-picker/picker';
//import RNPickerSelect from "react-native-picker-select"; //picker
import DropDownPicker from 'react-native-dropdown-picker'; //dropdown picker
//import SectionedMultiSelect from 'react-native-sectioned-multi-select'; //multiselect picker
//import Icon from "react-native-vector-icons/MaterialIcons"; //icons for multiselect
import Stars from "./Stars"
import { db } from './firebase';

import { getDocs, collection, getDoc, where, query } from 'firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth"; // Import auth to get the current user


// Input Fields
const CreateFoodPost = () => {
  // add user id 
  const [address, setAddress] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [rating, setRating] = useState(0);
  const [descrip, setDescrip] = useState('');
  const [webLink, setWebLink] = useState('');
  const navigation = useNavigation();
  
  const [posterName, setPosterName ] = useState("");



  // Dropdown 1: Locations
  const [locationOpen, setLocationOpen] = useState(false);
  const [restaurantLocationId, setRestaurantLocation] = useState('');
  const [locationItems, setLocationItems] = useState([]);

  // Dropdown 2: Meal Time
  const [mealTimeOpen, setMealTimeOpen] = useState(false);
  const [mealTime, setMealTime] = useState(null);
  const [mealTimeItems, setMealTimeItems] = useState([
    {label: 'Breakfast', value: 'breakfast'},
    {label: 'Brunch', value: 'brunch'},
    {label: 'Lunch', value: 'lunch'},
    {label: 'Dinner', value: 'dinner'}
  ]);

  // Dropdown 3: Restaurant type
  const [restaurantTypeOpen, setRestaurantTypeOpen] = useState(false);
  const [restaurantType, setRestaurantType] = useState(null);
  const [restaurantTypeItems, setRestaurantTypeItems] = useState([
    { label: 'Casual Dining', value: 'casual dining' },
    { label: 'Fine Dining', value: 'fine dining' },
    { label: 'Buffet', value: 'buffet' },
    { label: 'Cafe', value: 'cafe' }
  ]);

  // Dropdown 4: Expense
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [expense, setExpense] = useState(null);
  const [expenseItems, setExpenseItems] = useState([
    { label: '$', value: '$' },
    { label: '$$', value: '$$' },
    { label: '$$$', value: '$$$' }
  ]);

  // Dropdown 5: Dietary Restrictions
  const [dietaryResOpen, setDietaryResOpen] = useState(false);
  const [dietaryRes, setDietaryRes] = useState([]);
  const [dietaryResItems, setDietaryResItems] = useState([
    { label: 'Vegetarian', value: 'vegetarian' },
    { label: 'Vegan', value: 'vegan' },
    { label: 'Dairy-free', value: 'dairy-free' },
    { label: 'Lactose-free', value: 'lactose-free' },
    { label: 'Gluten-free', value: 'gluten-free' },
    { label: 'Kosher', value: 'kosher' },
    { label: 'Paleo', value: 'paleo' }
  ]);

  // show the selected items for dietary multiselect
  const selectedDietaryRes = dietaryRes.length > 0
    ? dietaryRes.map(item => item).join(', ')
    : 'Dietary Accomodations:';


  // check if all fields are filled to submit
  const allFields = restaurantLocationId && restaurantName && mealTime && restaurantType && expense && rating && descrip;


  const handleSubmit = async () => {
    if (allFields) {

      try {
        // Generate a new document reference with a unique ID in the "foodPosts" collection
        // add location city and user id 

        const auth = getAuth();
        const userId = auth.currentUser ? auth.currentUser.uid : null;

      /*  //get user name from userId
        const postersRef = collection(db, "users");
    const q = query(postersRef, where('userId', '==', userId));
    //Execute the query and get the documents
    const posterName = await getDoc(q).name;
*/
if (!userId) {
  Alert.alert("You must be logged in to post. You don't have an id.");
  return;
}
//getting user name from user's id
let posterName = "Unknown poster name";
  try {
    const postersRef = collection(db, "users");
  const q = query(postersRef, where('userId', '==', userId));
  //Execute the query and get the documents
//const q2 = doc(db, "users", where('userId', '==', userId));
  const querySnapshot = await getDocs(q);

    // Check if we have any matching documents
  if (!querySnapshot.empty) {
    const posterDoc = querySnapshot.docs[0];  // Assuming userId is unique, take the first match
    console.log(posterDoc.data());
    posterName = posterDoc.data().name || "Unknown poster name";

    // Set poster name from the first matching document
    //setPosterName(posterDoc.data().name || "Unknown poster name");
  } //else {
   // setPosterName("Unknown poster name");  // No matching user found
 // }
} catch (error) {
  console.error("Error fetching username: ", error);
}




        const newPostRef = doc(collection(db, "foodPosts"));
        
        // Data for the new post
        const newPostData = {
          userid: userId,
          locat_id: restaurantLocationId,  
          restaurant: restaurantName,        
          mealTime: mealTime,                
          restaurantType: restaurantType, 
          dietary: dietaryRes,   
          expense: expense, 
          stars: rating,                 
          description: descrip,
          link: webLink,  

          posterName: posterName 

          // also add something so that the id of the specific user is also included           
        };
  
        // Add the new post to Firebase
        await setDoc(newPostRef, newPostData);
  
        // Navigate to the "FindFoodPosts" screen with the location_id
        navigation.navigate('Posts', { location_id: restaurantLocationId });
        // don't let them navigate backwards to create food post again
  
        console.log("New post added successfully!");
  
      } catch (error) {
        console.error("Error adding post: ", error);
        Alert.alert("An error occurred while adding the post. Please try again.");
      }

    } else {
      Alert.alert("Fill out all fields before submitting.");
    }
  };
  

  // Function to fetch location from Firestore
  const fetchLocations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "locations"));
      const fetchedData = querySnapshot.docs.map((doc) => ({
        label: doc.data().city,
        value: doc.id,
      }));
      setLocationItems(fetchedData);
    } catch (error) {
      console.error("Error fetching locations: ", error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);


  // function to get usernames
  const fetchPosterName = async () => {
    try {
     // const userId = auth().currentUser.uid;

     // const posterNameRef = doc(db, "users", userId);
      //const posterNameDoc = await getDoc(posterNameRef);
/*
      const posterRef = doc(db, "users");//get users collection from db
      const q2 = query(posterRef, where('userId', '==', userId));//match user id to poster id for the doc
      const posterDoc = await getDoc(q2);//get doc from users collection for correct userId
*/
      const postersRef = collection(db, "users");
    const q = query(postersRef, where('userId', '==', userId));
    //Execute the query and get the documents
    const posterDoc = await getDoc(q);
    console.log(posterDoc);


      if (posterDoc.exists()) {
        setPosterName(posterDoc.data().name); // Assuming 'city' is the field name for city name
      } else {
        setPosterName("Unknown poster name");

      }
    } catch (error) {
      console.error("Error fetching username: ", error);
    }
  };
/*  useEffect(() => {
    fetchPosterName();
  }, []); */





  return (
    <KeyboardAvoidingView
      style={styles.container} behavior="padding"
    > 
    <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
    
      <Text style={styles.title}>Create Food Post</Text>
      <View style={styles.inputContainer}>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Stars rating={rating} setRating={setRating} />
        </View>

        <TextInput
          placeholder="Restaurant Name *"
          value={restaurantName}
          onChangeText={text => setRestaurantName(text)}
          style={styles.input}
        />

        {/* Restaurant Location */}
        <View style={{ zIndex: 5000, marginBottom: 10 }}>
          <DropDownPicker
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            placeholderStyle={styles.dropdownPlaceholder}
            labelStyle={styles.dropdownLabelStyle}
            itemStyle={styles.dropdownItem}
            badgeStyle={styles.dropdownBadge}

            open={locationOpen}
            value={restaurantLocationId}
            items={locationItems}
            setOpen={setLocationOpen}
            setValue={setRestaurantLocation}
            setItems={setLocationItems}
            placeholder="Restaurant Location: *"
            zIndex={5000}
            zIndexInverse={4000}
          />
        </View>


        {/* Address */}
        <TextInput
          placeholder="Address"
          value={address}
          onChangeText={text => setAddress(text)}
          style={styles.input}
        />

        {/* Meal Time */}
        <View style={{ zIndex: 4000, marginBottom: 10 }}>
          <DropDownPicker
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            placeholderStyle={styles.dropdownPlaceholder}
            labelStyle={styles.dropdownLabelStyle}
            itemStyle={styles.dropdownItem}
            badgeStyle={styles.dropdownBadge}

            open={mealTimeOpen}
            value={mealTime}
            items={mealTimeItems}
            setOpen={setMealTimeOpen}
            setValue={setMealTime}
            setItems={setMealTimeItems}
            placeholder="Meal time: *"
            zIndex={4000} //Highest zIndex for top dropdown
            zIndexInverse={3000}
          />
        </View>

        {/* Restaurant Type */}
        <View style={{ zIndex: 3000, marginBottom: 10 }}>
          <DropDownPicker
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            placeholderStyle={styles.dropdownPlaceholder}
            labelStyle={styles.dropdownLabelStyle}
            itemStyle={styles.dropdownItem}
            badgeStyle={styles.dropdownBadge}

            open={restaurantTypeOpen}
            value={restaurantType}
            items={restaurantTypeItems}
            setOpen={setRestaurantTypeOpen}
            setValue={setRestaurantType}
            setItems={setRestaurantTypeItems}
            placeholder="Restaurant Type: *"
            zIndex={3000} 
            zIndexInverse={2000}
          />
        </View>
       

        {/* Dietary Restrictions */}
        <View style={{ zIndex: 2000, marginBottom: 10 }}>
          <DropDownPicker
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            placeholderStyle={styles.dropdownPlaceholder}
            labelStyle={styles.dropdownLabelStyle}
            itemStyle={styles.dropdownItem}
            badgeStyle={styles.dropdownBadge}

            open={dietaryResOpen}
            value={dietaryRes}
            items={dietaryResItems}
            setOpen={setDietaryResOpen}
            setValue={setDietaryRes}
            setItems={setDietaryResItems}
            placeholder={selectedDietaryRes}
            zIndex={2000}
            zIndexInverse={1000}
            multiple={true}
            min={0}
            mode="BADGE" //for multiselect readability
          />
        </View>
      

        {/* Expense */}
        <View style={{ zIndex: 1000, marginBottom: 500 }}>
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
            placeholder="Expense: *"
            zIndex={1000}
            zIndexInverse={500}
          />    
        </View>     

      
        {/* Description */}
        <TextInput
          placeholder="Description *"
          value={descrip}
          onChangeText={text => setDescrip(text)}
          style={styles.input}
          multiline={true}
          numberOfLines={10}
        />

        {/* Website */}
        <TextInput
          placeholder="Link to website"
          value={webLink}
          onChangeText={text => setWebLink(text)}
          style={styles.input}
          multiline={true}
          numberOfLines={10}
        />
        
      </View>
      <View style={styles.buttonContainer}>

    <TouchableOpacity 
      style={[styles.button, { backgroundColor: allFields ? 'green' : 'gray' }]} 
      onPress={handleSubmit}
      disabled={!allFields} 
    >
      <Text style={styles.buttonText}>Create Post</Text> 
    </TouchableOpacity> 
    
      </View>
    
    </ScrollView>
    </KeyboardAvoidingView> 
  );
};

// pickerSelectStyles
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 0,
    fontSize: 14,
    color: 'grey',
    paddingVertical: 12,
    paddingHorizontal: 10,
    //borderWidth: 1,
    //borderColor: 'gray',
    //borderRadius: 4,
    //color: 'black',
    //paddingRight: 30, // to ensure the text is not obscured by the icon
    //backgroundColor: 'white', // Optional
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is not obscured by the icon
    backgroundColor: 'white', // Optional
  },
});

// Normal style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 400,
    paddingVertical: 15,
  },
  title: {    
    fontSize: 34, 
    fontWeight: "bold",    
    marginBottom: 20, 
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 15,
    color: 'grey',
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 0,
  },
  label: {
    marginBottom: 5,
  },
  showButton: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    color: 'rgb(60, 179, 113)',
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: 'green',
    width: '100%', 
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white', 
    fontSize: 15,
  },

  //Dropdown style
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 0,
    marginTop: 10,
    width: '100%',
    maxWidth: 400,
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
    color: 'grey',
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

export default CreateFoodPost;
