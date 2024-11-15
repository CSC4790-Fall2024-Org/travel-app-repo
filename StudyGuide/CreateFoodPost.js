import React, { useState, useEffect } from "react"; 
import { KeyboardAvoidingView, TouchableOpacity, Text, TextInput, View, StyleSheet, Button, Alert, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
//import { Picker } from '@react-native-picker/picker';
import RNPickerSelect from "react-native-picker-select"; //picker
import SectionedMultiSelect from 'react-native-sectioned-multi-select'; //multiselect picker
import Icon from "react-native-vector-icons/MaterialIcons"; //icons for multiselect
import Stars from "./Stars"
import { db } from './firebase';
import { getDocs, collection, getDoc } from 'firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth"; // Import auth to get the current user


// Fields
const CreateFoodPost = () => {
  // add user id 
  const [restaurantLocationId, setRestaurantLocation] = useState('');
  const [locationOptions, setLocationOptions] = useState([]); // Hold list of locations
  const [address, setAddress] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [mealTime, setMealTime] = useState('');
  const [restaurantType, setRestaurantType] = useState('');
  const [dietaryRes, setDietaryRes] = useState([]);
  const [expense, setExpense] = useState('');
  const [rating, setRating] = useState(0);
  //const [starRating, setStarRating] = useState('');
  const [descrip, setDescrip] = useState('');
  const [webLink, setWebLink] = useState('');
  const navigation = useNavigation();

  const [posterName, setPosterName ] = useState('');


  // check if all fields are filled


  const allFields = restaurantLocationId && restaurantName && mealTime && restaurantType && expense && rating && descrip;



  const handleSubmit = async () => {
    if (allFields) {

      try {
        // Generate a new document reference with a unique ID in the "foodPosts" collection
        // add location city and user id 

        const auth = getAuth();
        const userId = auth.currentUser ? auth.currentUser.uid : null;


        const newPostRef = doc(collection(db, "foodPosts"));
        
        // Data for the new post
        const newPostData = {

          userId: userId,
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
  
  //function to get usernames
  const fetchPosterName = async () => {
    try {
      const auth = getAuth();
      const userId = auth.currentUser ? auth.currentUser.uid : null;

     // const posterNameRef = doc(db, "users", userId);
      //const posterNameDoc = await getDoc(posterNameRef);

      const posterRef = doc(db, "users");//get users collection from db
      const q2 = query(posterRef, where('userId', '==', userId));//match user id to poster id for the doc
      const posterDoc = await getDoc(q2);//get doc from users collection for correct userId

      if (posterDoc.exists()) {
        setPosterName(posterDoc.data()); // Assuming 'city' is the field name for city name
      } else {
        setPosterName("Unknown Location");
      }
    } catch (error) {
      console.error("Error fetching username: ", error);
    }
  };
  useEffect(() => {
    fetchPosterName();
  }, []);

  // Function to fetch location from Firestore
  const fetchLocations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "locations"));
      const fetchedData = querySnapshot.docs.map((doc) => ({
        label: doc.data().city,
        value: doc.id,
      }));
      setLocationOptions(fetchedData);
    } catch (error) {
      console.error("Error fetching locations: ", error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);


  return (
    <KeyboardAvoidingView
      style={styles.container} behavior="padding"
    > 
    <ScrollView>
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
         <RNPickerSelect
          onValueChange={(value) => setRestaurantLocation(value)}
          items={locationOptions}
          placeholder={{ label: "Restaurant Location *", value: null }}
          style={pickerSelectStyles}
          value={restaurantLocationId}
          useNativeAndroidPickerStyle={false} 
        />

        {/* Address */}
        <TextInput
          placeholder="Address"
          value={address}
          onChangeText={text => setAddress(text)}
          style={styles.input}
        />

        
        {/* Meal Time */}
        <RNPickerSelect
          onValueChange={(value) => setMealTime(value)}
          items={[
            { label: 'Breakfast', value: 'breakfast' },
            { label: 'Brunch', value: 'brunch' },
            { label: 'Lunch', value: 'lunch' },
            { label: 'Dinner', value: 'dinner' }
          ]}
          placeholder={{ label: "Meal Time *", value: null }}
          style={pickerSelectStyles}
          value={mealTime}
          useNativeAndroidPickerStyle={false} 
        /> 
       
        {/* Restaurant Type */}
        <RNPickerSelect
          onValueChange={(value) => setRestaurantType(value)}
          items={[
            { label: 'Fast Food', value: 'fast food' },
            { label: 'Casual Dining', value: 'casual dining' },
            { label: 'Fine Dining', value: 'fine dining' },
            { label: 'Buffet', value: 'buffet' },
            { label: 'Cafe', value: 'cafe' }
          ]}
          placeholder={{ label: "Restaurant Type *", value: null }}
          style={pickerSelectStyles}
          value={restaurantType}
          useNativeAndroidPickerStyle={false} 
        />

        {/* Dietary Restrictions */}
        <SectionedMultiSelect
          items={[
            { name: 'Vegetarian', id: 'vegetarian' },
            { name: 'Vegan', id: 'vegan' },
            { name: 'Dairy-free', id: 'dairy-free' },
            { name: 'Lactose-free', id: 'lactose-free' },
            { name: 'Gluten-free', id: 'gluten-free' },
            { name: 'Kosher', id: 'kosher' },
            { name: 'Paleo', id: 'paleo' }
          ]}
          uniqueKey="id"
          selectText="Accomodates Dietary Restrictions:"
          onSelectedItemsChange={(selectedItems) => setDietaryRes(selectedItems)}
          selectedItems={dietaryRes}
          IconRenderer={Icon}
          single={false}
          style={{
            selectToggle: {
              padding: 15,
              backgroundColor: 'white',
              borderRadius: 10,
              marginTop: 10,
            },
          }}
        />

        {/* Expense */}
        <RNPickerSelect
          onValueChange={(value) => setExpense(value)}
          items={[
            { label: '$', value: '$' },
            { label: '$$', value: '$$' },
            { label: '$$$', value: '$$$' }
          ]}
          placeholder={{ label: "Expense *", value: null }}
          style={pickerSelectStyles}
          value={expense}
          useNativeAndroidPickerStyle={false} 
        />

      
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
});

export default CreateFoodPost;
