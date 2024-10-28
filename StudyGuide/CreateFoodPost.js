import React, { useState, useEffect } from "react"; 
import { KeyboardAvoidingView, TouchableOpacity, Text, TextInput, View, StyleSheet, Button, Alert, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
//import { Picker } from '@react-native-picker/picker';
import RNPickerSelect from "react-native-picker-select";
import { db } from './firebase';
import { getDocs, collection } from 'firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';

// Fields
const CreateFoodPost = () => {
  const [restaurantLocation, setRestaurantLocation] = useState('');
  const [locationOptions, setLocationOptions] = useState([]); // Hold list of locations
  const [restaurantName, setRestaurantName] = useState('');
  const [mealTime, setMealTime] = useState('');
  const [restaurantType, setRestaurantType] = useState('');
  const [expense, setExpense] = useState('');
  const [descrip, setDescrip] = useState('');
  const navigation = useNavigation();

  // check if all fields are filled
  const allFields = restaurantLocation && restaurantName && mealTime && restaurantType && expense && descrip;

  const handleSubmit = () => {
    if (allFields) {
      console.log('Restarant location:', restaurantLocation);
      console.log('Restaurant Name:', restaurantName);
      console.log('Meal Time:', mealTime);
      console.log('Restaurant Type', restaurantType);
      console.log('Expense', expense);
      console.log('Description', descrip);
      navigation.navigate('FindFoodPosts');
    } else {
      Alert.alert("Fill out all fields before submitting.")
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
          value={restaurantLocation}
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
