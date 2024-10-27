import React, { useState } from "react"; 
import { KeyboardAvoidingView, TouchableOpacity, Text, TextInput, View, StyleSheet, Alert } from "react-native";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from "react-native-picker-select";
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [year, setYear] = useState('');
  const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const checkEmail = (email) => {
    return email.includes('.edu');
  };

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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Sign Up</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={text => setName(text)}
            style={styles.input}
          />
          {/* City */}
          <RNPickerSelect
          onValueChange={(value) => setCity(value)}
          items={[
            { label: 'Cádiz', value: 'Cádiz' },
            { label: 'Cambridge', value: 'Cabridge' },
            { label: 'Dingle', value: 'Dingle' },
            { label: 'Galway', value: 'Galway' },
            { label: 'Lille', value: 'Lille' },
            { label: 'Philadelphia', value: 'Philadelphia' },
            { label: 'Rome', value: 'Rome' },
            { label: 'St. Andrews', value: 'St. Andrews' },
            { label: 'Singapore', value: 'Singapore' },
            { label: 'Sydney', value: 'Sydney' },
            { label: 'Urbino', value: 'Urbino' },
          ]}
          placeholder={{ label: "City", value: null }}
          style={pickerSelectStyles}
          value={city}
          useNativeAndroidPickerStyle={false} 
        />
          {/* Year */}
          <RNPickerSelect
          onValueChange={(value) => setYear(value)}
          items={[
            { label: '2000', value: '2000' },
            { label: '2001', value: '2001' },
            { label: '2002', value: '2002' },
            { label: '2003', value: '2003' },
            { label: '2004', value: '2004' },
            { label: '2005', value: '2005' },
            { label: '2006', value: '2006' },
            { label: '2007', value: '2007' },
            { label: '2008', value: '2008' },
            { label: '2009', value: '2009' },
            { label: '2010', value: '2010' },
            { label: '2011', value: '2011' },
            { label: '2012', value: '2012' },
            { label: '2013', value: '2013' },
            { label: '2014', value: '2014' },
            { label: '2015', value: '2015' },
            { label: '2016', value: '2016' },
            { label: '2017', value: '2017' },
            { label: '2018', value: '2018' },
            { label: '2019', value: '2019' },
            { label: '2020', value: '2020' },
            { label: '2021', value: '2021' },
            { label: '2022', value: '2022' },
            { label: '2023', value: '2023' },
            { label: '2024', value: '2024' },
            { label: '2025', value: '2025' },
            { label: '2026', value: '2026' },
            { label: '2027', value: '2027' },
            { label: '2028', value: '2028' },
            { label: '2029', value: '2029' },
            { label: '2030', value: '2030' },
          ]}
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

export default SignUpScreen;
