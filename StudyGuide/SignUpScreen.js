import React, { useState, useEffect } from "react"; 
import { KeyboardAvoidingView, TouchableOpacity, Text, TextInput, View, StyleSheet, Alert, ScrollView} from "react-native";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from "react-native-picker-select";
import { db } from './firebase';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';


const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [year, setYear] = useState('');
  const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const [locationOptions, setLocationOptions] = useState([]); // Hold list of locations

  const checkEmail = (email) => {
    return email.includes('.edu');
  };

  const fetchLocations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "locations"));
      const fetchedData = querySnapshot.docs.map((doc) => ({
        label: doc.data().city,
        value: doc.data().city,
      }));
      setLocationOptions(fetchedData);
    } catch (error) {
      console.error("Error fetching locations: ", error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);


  const handleSignUp = async () => {
    if (!checkEmail(email)) {
      Alert.alert('Error', 'StudyGuide is designed for university students. Please enter an email address associated with a university.');
      return;
    }
    
    const auth = getAuth();
    
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;

      // Send verification email
      await sendEmailVerification(user);
      Alert.alert('Verification Email Sent', 'Please check your email to verify your account.');

      // Reload and check verification status every 5 seconds
      const checkVerificationStatus = async () => {
        await user.reload(); // Reload user data


        if (user.emailVerified) {

          console.log('email verified');
                    
          await setDoc(doc(db, 'users', user.uid), {
            email,
            name,
            year,
            city,
            userId: user.uid,
          });
          
          
          Alert.alert('Sign Up Successful', 'Your email is verified. Welcome to StudyGuide! You can login now.');
        } else {
          setTimeout(checkVerificationStatus, 5000); // Retry after 5 seconds if not verified
        }
      };

      // Start checking for verification status
      setTimeout(checkVerificationStatus, 5000);

    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'This email is already in use. Please log in or use another email.');
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    > 
      <ScrollView contentContainerStyle={[styles.scrollContainer, { flexGrow: 1 }]}>
        
        <Text style={styles.title}>Sign Up</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={text => setName(text)}
            style={styles.input}
          />
          {/* City */}
           {/* Restaurant Location */}
         <RNPickerSelect
          onValueChange={(value) => setCity(value)}
          items={locationOptions}
          placeholder={{ label: "City", value: null }}
          style={pickerSelectStyles}
          value={city}
          useNativeAndroidPickerStyle={false} 
        />
          {/* Year */}
          <RNPickerSelect
          onValueChange={(value) => setYear(value)}
          items={Array.from({ length: 31 }, (_, i) => {
            const year = 2000 + i;
            return { label: year.toString(), value: year.toString() };
          })}
          placeholder={{ label: "Year", value: null }}
          style={pickerSelectStyles}
          value={year}
          useNativeAndroidPickerStyle={false}
        />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.input}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={text => setPassword(text)}
              style={styles.passwordInput}
              secureTextEntry={!showPassword} 
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.showButton}>{showPassword ? "Hide" : "Show"}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleSignUp}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Sign Up</Text> 
          </TouchableOpacity>
        </View>
        <Text style={styles.infoText}>To create an account your email must be educational (ending with edu).</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 0,
    fontSize: 14,
    paddingVertical: 15,
    paddingHorizontal: 15,
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center", // Center content vertically
    alignItems: "center",
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
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
    marginTop: 40, // Space between password and sign-up button, this isnt doing anything
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

export default SignUpScreen;
