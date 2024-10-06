import React, { useState } from "react"; 
import { KeyboardAvoidingView, TouchableOpacity, Text, TextInput, View, StyleSheet, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
//import { Picker } from '@react-native-picker/picker';
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

// export default function CreateFoodPost() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Create Food Post</Text>

//     </View>
//   );
// }

const CreateFoodPost = () => {
  const [restaurantName, setRestaurantName] = useState('');
  const [mealTime, setMealTime] = useState('');
  const [restaurantType, setRestaurantType] = useState('');
  const [expense, setExpense] = useState('');
  const [descrip, setDescrip] = useState('');
  const navigation = useNavigation();


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    > 
      <Text style={styles.title}>Create Food Post</Text>
      <View style={styles.inputContainer}>

        <TextInput
          placeholder="Restaurant Name"
          value={restaurantName}
          onChangeText={text => setRestaurantName(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Meal Time"
          value={mealTime}
          onChangeText={text => setMealTime(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Restaurant Type"
          value={restaurantType}
          onChangeText={text => setRestaurantType(text)}
          style={styles.input}
        />

        {/* <Text>Select an expense level:</Text>
          <Picker
            selectedValue={expense}
            onValueChange={(itemValue) => setExpense(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="$" value="$" />
            <Picker.Item label="$$" value="$$" />
            <Picker.Item label="$$$" value="$$$" />
          </Picker> */}

        <TextInput
          placeholder="Expense"
          value={expense}
          onChangeText={text => setExpense(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Description"
          value={descrip}
          onChangeText={text => setDescrip(text)}
          style={styles.input}
        />
        
      </View>
      <View style={styles.buttonContainer}>

    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Create Post</Text> 
    </TouchableOpacity>
    
      </View>
    </KeyboardAvoidingView>
  );
};

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
