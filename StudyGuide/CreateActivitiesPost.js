import React, { useState, useEffect } from "react"; 
import { KeyboardAvoidingView, TouchableOpacity, Text, TextInput, View, StyleSheet, Button, Alert, ScrollView} from "react-native";
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker'; //dropdown picker
import Stars from "./Stars"
import { db } from './firebase';
import { getDocs, collection, getDoc, where, query } from 'firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth"; // Import auth to get the current user


// Input Fields
const CreateActivitiesPost = () => {
  // add user id 
  const [address, setAddress] = useState('');
  const [activityName, setActivityName] = useState('');
  const [rating, setRating] = useState(0);
  const [descrip, setDescrip] = useState('');
  const [webLink, setWebLink] = useState('');
  const navigation = useNavigation();
 

  // Dropdown 1: Locations
  const [locationOpen, setLocationOpen] = useState(false);
  const [activityLocationId, setActivityLocation] = useState('');
  const [locationItems, setLocationItems] = useState([]);

  // Dropdown 2: Time of Day
  const [timeOpen, setTimeOpen] = useState(false);
  const [time, setTime] = useState(null);
  const [timeItems, setTimeItems] = useState([
    {label: 'Morning', value: 'morning'},
    {label: 'Mid-day', value: 'mid-day'},
    {label: 'Afternoon', value: 'afternoon'},
    {label: 'Night', value: 'night'}
  ]);

  // Dropdown 3: Activity type
  const [activityTypeOpen, setActivityTypeOpen] = useState(false);
  const [activityType, setActivityType] = useState(null);
  const [activityTypeItems, setActivityTypeItems] = useState([
    { label: 'Park', value: 'park' },
    { label: 'Cultural Landmark', value: 'cultural landmark' },
    { label: 'Beach', value: 'beach' },
    { label: 'Hike', value: 'hike' },
    { label: 'Tour', value: 'tour' },
    { label: 'Museum', value: 'museum' },
    { label: 'Show', value: 'Show' },
    { label: 'Sport Game', value: 'sport game' },
    { label: 'Bar', value: 'bar' },
    { label: 'Club', value: 'club' }
  ]);

  // Dropdown 4: Expense
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [expense, setExpense] = useState(null);
  const [expenseItems, setExpenseItems] = useState([
    { label: 'Free', value: 'free' },
    { label: '$', value: '$' },
    { label: '$$', value: '$$' },
    { label: '$$$', value: '$$$' }
  ]);



  // check if all fields are filled to submit
  const allFields = activityLocationId && activityName && time && activityType && expense && rating && descrip;


  const handleSubmit = async () => {
    if (allFields) {

      try {
        const auth = getAuth();
        const userId = auth.currentUser ? auth.currentUser.uid : null;

  if (!userId) {
    Alert.alert("You must be logged in to post. You don't have an id.");
    return;
  }
  // Now, getting user's name from user's id to automatically put it in db with this post as a field
  let posterName = "Unknown poster name";
  let posterYear = "Unknown poster yr";
  let posterVisitedCity = "Unknown poster city";
  try {
    //filter to user's collection
    const postersRef = collection(db, "users");
    //get users whose userId field matches the userId from auth (above)
    const q = query(postersRef, where('userId', '==', userId));
    //Execute the query and get the documents
    const querySnapshot = await getDocs(q);

    // Check if we have any matching user documents for signed in user's ID
    if (!querySnapshot.empty) {
      const posterDoc = querySnapshot.docs[0];  // Assuming userId is unique, take poster name from the first matching document
      //console.log(posterDoc.data());
      posterName = posterDoc.data().name || "Unknown poster name";
      posterYear = posterDoc.data().year || "Unknown poster year";
      posterVisitedCity = posterDoc.data().city || "Unknown poster destination city";
    } 
  } catch (error) {
    console.error("Error fetching username: ", error);
  }



        const newPostRef = doc(collection(db, "activityPosts"));
        
        // Data for the new post
        const newPostData = {
          userId: userId,
          locat_id: activityLocationId,  
          activityName: activityName,
          address: address,        
          activityTime: time,                
          activityType: activityType,   
          expense: expense, 
          stars: rating,                 
          description: descrip,
          link: webLink,  
          
          //info added automatically to a post doc in the db about the user making the post (user doesn't submit this)
          posterName: posterName,
          posterYear: posterYear,
          posterVisitedCity: posterVisitedCity

          // also add something so that the id of the specific user is also included           
        };
  
        // Add the new post to Firebase
        await setDoc(newPostRef, newPostData);
  
        // Navigate to the "FindFoodPosts" screen with the location_id
        navigation.replace('ActivitiesPosts', { location_id: activityLocationId });
        // don't let them navigate backwards to create food post again
  
        console.log("New activity post added successfully!");
  
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



  return (
    <KeyboardAvoidingView
      style={styles.container} behavior="padding"
    > 
    <ScrollView 
      contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, width: '100%', }} 
      style={{ flex: 1 }}
      horizontal={false}
      showsHorizontalScrollIndicator={false}
    >

      <Text style={styles.title}>Create Activity Post</Text>
      <View style={styles.inputContainer}>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
          <Stars rating={rating} setRating={setRating} />
        </View>

        <TextInput
          placeholder="Activity Name *"
          value={activityName}
          onChangeText={text => setActivityName(text)}
          style={styles.input}
        />

        {/* Activity Location */}
        <View style={{ width: '100%', zIndex: 4000, marginBottom: 1 }}>
          <DropDownPicker
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            placeholderStyle={styles.dropdownPlaceholder}
            labelStyle={styles.dropdownLabelStyle}
            itemStyle={styles.dropdownItem}
            badgeStyle={styles.dropdownBadge}

            open={locationOpen}
            value={activityLocationId}
            items={locationItems}
            setOpen={setLocationOpen}
            setValue={setActivityLocation}
            setItems={setLocationItems}
            placeholder="Location: *"
            zIndex={4000}
            zIndexInverse={3000}
            listMode="SCROLLVIEW"
          />
        </View>

        {/* Address */}
        <TextInput
          placeholder="Address"
          value={address}
          onChangeText={text => setAddress(text)}
          style={styles.input}
        />

        {/* Time */}
        <View style={{ width: '100%', zIndex: 3000, marginBottom: 1 }}>
          <DropDownPicker
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            placeholderStyle={styles.dropdownPlaceholder}
            labelStyle={styles.dropdownLabelStyle}
            itemStyle={styles.dropdownItem}
            badgeStyle={styles.dropdownBadge}

            open={timeOpen}
            value={time}
            items={timeItems}
            setOpen={setTimeOpen}
            setValue={setTime}
            setItems={setTimeItems}
            placeholder="Time of day for activity: *"
            zIndex={3000} //Highest zIndex for top dropdown
            zIndexInverse={2000}
            listMode="SCROLLVIEW"
          />
        </View>

        {/* Activity Type */}
        <View style={{ width: '100%', zIndex: 2000, marginBottom: 1 }}>
          <DropDownPicker
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            placeholderStyle={styles.dropdownPlaceholder}
            labelStyle={styles.dropdownLabelStyle}
            itemStyle={styles.dropdownItem}
            badgeStyle={styles.dropdownBadge}

            open={activityTypeOpen}
            value={activityType}
            items={activityTypeItems}
            setOpen={setActivityTypeOpen}
            setValue={setActivityType}
            setItems={setActivityTypeItems}
            placeholder="Activity Type: *"
            zIndex={2000} 
            zIndexInverse={1000}
            listMode="SCROLLVIEW"
          />
        </View>
      
        {/* Expense */}
        <View style={{ width: '100%', zIndex: 1000, marginBottom: 1 }}>
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
            listMode="SCROLLVIEW"
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
          numberOfLines={5}
        />
        
      </View>
      <View style={styles.buttonContainer}>

    <TouchableOpacity 
      style={[styles.button, { backgroundColor: allFields ? 'green' : 'gray' }]} 
      onPress={handleSubmit}
      disabled={!allFields} 
    >
      <Text style={styles.buttonText}>                  Create Post                   </Text> 
    </TouchableOpacity> 
    
      </View>
    
    </ScrollView>
    </KeyboardAvoidingView> 
  );
};


// Normal style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    overflow: 'hidden',
  },
  inputContainer: {
    width: '100%',
    //maxWidth: 320,
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
    alignItems: "center",
    marginTop: 30,
  },
  button: {
    backgroundColor: 'green',
    width: '100%', 
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 0,
  },
  buttonText: {
    color: 'white', 
    fontSize: 15,
    fontWeight: "bold", 
  },

  //Dropdown style
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 0,
    marginTop: 10,
    width: '100%',
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

export default CreateActivitiesPost;
