import React, { useState, useEffect } from "react"; 
import { KeyboardAvoidingView, TouchableOpacity, Text, TextInput, View, StyleSheet, Alert, ScrollView} from "react-native";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
//import RNPickerSelect from "react-native-picker-select";
import DropDownPicker from 'react-native-dropdown-picker'; //dropdown picker
import { db } from './firebase';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';


const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const [year, setYear] = useState('');
  // const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const navigation = useNavigation();
  // const [locationOptions, setLocationOptions] = useState([]); // Hold list of locations

  // Dropdown 1: Locations
  const [locationOpen, setLocationOpen] = useState(false);
  const [restaurantLocationId, setRestaurantLocation] = useState('');
  const [locationItems, setLocationItems] = useState([]);

  // Dropdown 2: Years
  const [yearOpen, setYearOpen] = useState(false);
  const [year, setYear] = useState(null);


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
      setLocationItems(fetchedData);
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
        const intervalId = setInterval(async () => {
          await user.reload();
          if (user.emailVerified) {
            console.log('Email verified');
            clearInterval(intervalId); 
            
            await setDoc(doc(db, 'users', user.uid), {
              email,
              name,
              year,
              city: restaurantLocationId,
              userId: user.uid,
            });
      
            Alert.alert('Sign Up Successful', 'Your email is verified. Welcome to StudyGuide! You can login now.');
          }
        }, 5000);
      };
      
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
      <ScrollView 
        contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 }} 
        style={{ flex: 1 }}
        horizontal={false}
        showsHorizontalScrollIndicator={false}
      >
        
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
        <View style={{ zIndex: 2000, marginTop: 5, marginBottom: 5 }}>
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
            placeholder="Where did you study?"
            zIndex={2000}
            zIndexInverse={1000}
            listMode="SCROLLVIEW"
          />
        </View>


        {/* Year */}
        <View style={{ zIndex: 1000, marginBottom: 5 }}>
          <DropDownPicker
            open={yearOpen}
            value={year} 
            items={Array.from({ length: 31 }, (_, i) => {
              const year = 2000 + i;
              return { label: year.toString(), value: year.toString() };
            })}
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            placeholderStyle={styles.dropdownPlaceholder}

            setOpen={setYearOpen}
            setValue={setYear}
            placeholder="What year did you or will you study?"
            zIndex={1000}
            zIndexInverse={500}
            labelStyle={styles.dropdownLabelStyle}
            itemStyle={styles.dropdownItem}
            listMode="SCROLLVIEW"
          />
        </View>

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
          <Text style={styles.infoText}>   To create an account your email must be educational (ending with edu).</Text>

          <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text> 
          </TouchableOpacity>
          <Text style={styles.infoText}>   If you have already registered, Login.</Text>

        </View>
        
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
    //paddingRight: 30
    //backgroundColor: 'white',
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white', 
  },
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center", 
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
    textAlign: 'center',
    marginVertical: 35, 
    fontFamily: 'Times New Roman',
  },
  input: {
    backgroundColor: '#EEEEEE',
    color: 'grey',
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
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
    marginBottom: 10,
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
    color: '#70A533',
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    alignItems: "center",
    marginTop: 30,
  },
  button: {
    backgroundColor: '#70A533',
    width: '100%', 
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: 'white', 
    fontSize: 18,
    fontWeight: "bold",  
  },
  infoText: {
    color: 'gray', 
    fontSize: 13,
    fontWeight: "light",  
  },

   //Dropdown style
   dropdownContainer: {
    backgroundColor: '#EEEEEE',
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
    color: '#6D6D6D',
    fontWeight: 'normal',
  },
  dropdownPlaceholder: {
    color: '#B0B0B0',
    fontWeight: 'normal',
  },
  dropdownLabelStyle: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#6D6D6D',
  },
  dropdownItem: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    color: '#6D6D6D',
    fontWeight: 'normal',
  },
  dropdownBadge: {
    backgroundColor: '#6D6D6D',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    fontSize: 14,
    fontWeight: 'normal',
  },
});

export default SignUpScreen;
