import React, { useState, useEffect } from "react"; 
import { KeyboardAvoidingView, TouchableOpacity, Text, TextInput, View, StyleSheet, Button, Alert, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
//import { Picker } from '@react-native-picker/picker';
import RNPickerSelect from "react-native-picker-select"; //picker
import SectionedMultiSelect from 'react-native-sectioned-multi-select'; //multiselect picker
import Icon from "react-native-vector-icons/MaterialIcons"; //icons for multiselect
import { db } from './firebase';
import { getDocs, collection } from 'firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';

// Fields
const CreateFoodPost = () => {
  // add location city and user id 
  const [restaurantLocationId, setRestaurantLocation] = useState('');
  const [locationOptions, setLocationOptions] = useState([]); // Hold list of locations
  const [restaurantName, setRestaurantName] = useState('');
  const [mealTime, setMealTime] = useState('');
  const [restaurantType, setRestaurantType] = useState('');
  const [dietaryRes, setDietaryRes] = useState([]);
  const [expense, setExpense] = useState('');
  const [starRating, setStarRating] = useState('');
  const [descrip, setDescrip] = useState('');
  const navigation = useNavigation();

  // check if all fields are filled

  const allFields = restaurantLocation && restaurantName && mealTime && restaurantType && dietaryRes && expense && starRating && descrip;


  const handleSubmit = async () => {
    if (allFields) {

      try {
        // Generate a new document reference with a unique ID in the "foodPosts" collection
        // add location city and user id 
        const newPostRef = doc(collection(db, "foodPosts"));
        
        // Data for the new post
        const newPostData = {
          locat_id: restaurantLocationId,      
          restaurant: restaurantName,        
          mealTime: mealTime,                
          restaurantType: restaurantType,    
          expense: expense,                  
          description: descrip     
          // also add something so that the id of the specific user is also included           
        };
  
        // Add the new post to Firebase
        await setDoc(newPostRef, newPostData);
  
        // Navigate to the "FindFoodPosts" screen with the location_id
        navigation.navigate('Posts', { location_id: restaurantLocationId });
  
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

        <TextInput
          placeholder="Restaurant Name"
          value={restaurantName}
          onChangeText={text => setRestaurantName(text)}
          style={styles.input}
        />

         {/* Restaurant Location */}
         <RNPickerSelect
          onValueChange={(value) => setRestaurantLocation(value)}
          items={locationOptions}
          placeholder={{ label: "Restaurant Location", value: null }}
          style={pickerSelectStyles}
          value={restaurantLocationId}
          useNativeAndroidPickerStyle={false} 
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
          placeholder={{ label: "Meal Time", value: null }}
          style={pickerSelectStyles}
          value={mealTime}
          useNativeAndroidPickerStyle={false} 
        /> 
        {/* <SectionedMultiSelect
          items={[
            { name: 'Breakfast', id: 'breakfast' },
            { name: 'Brunch', id: 'brunch' },
            { name: 'Lunch', id: 'lunch' },
            { name: 'Dinner', id: 'dinner' }
          ]}
          uniqueKey="id"
          selectText="Meal Time"
          onSelectedItemsChange={(selectedItems) => setMealTime(selectedItems)}
          selectedItems={mealTime}
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
        /> */}

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
          placeholder={{ label: "Restaurant Type", value: null }}
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
          placeholder={{ label: "Expense", value: null }}
          style={pickerSelectStyles}
          value={expense}
          useNativeAndroidPickerStyle={false} 
        />

        {/* Stars */}
        <RNPickerSelect
          onValueChange={(value) => setStarRating(value)}
          items={[
            { label: '1', value: '1' },
            { label: '2', value: '2' },
            { label: '3', value: '3' },
            { label: '4', value: '4' },
            { label: '5', value: '5' }
          ]}
          placeholder={{ label: "Star Rating", value: null }}
          style={pickerSelectStyles}
          value={starRating}
          useNativeAndroidPickerStyle={false} 
        />

        <TextInput
          placeholder="Description"
          value={descrip}
          onChangeText={text => setDescrip(text)}
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
