import React, { useState } from "react"; 
import { KeyboardAvoidingView, TouchableOpacity, Text, TextInput, View, StyleSheet, Alert } from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
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

  // collection = users
  // components = city, email, name, year

  const checkEmail = (email) => {
    return email.includes('.edu');
  };

  const handleSignUp = async () => {
    if (!checkEmail(email)) {
      Alert.alert('Error', 'StudyGuide is designed for university students. Please enter and email address associated with an university.');
      return;
    }
    const auth = getAuth();
        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user;

            await setDoc(doc(db, 'users', user.uid), {
                email,
                name,
                year,
                city,
            });
            navigation.navigate('Profile');  
            Alert.alert('Sign Up Successful', 'Welcome to StudyGuide!');
          } catch (error) {

              if (error.code === 'auth/email-already-in-use') {
                  Alert.alert('Error', 'This email is already in use. Please sign in or use another email.');
              } else {
                  Alert.alert('Error', error.message);
              }
          }
          
}

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    > 
      <Text style={styles.title}>Sign Up</Text>
      <View style={styles.inputContainer}>
                <TouchableOpacity
          onPress={handleSignUp}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Sign Up</Text> 
        </TouchableOpacity>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={text => setName(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="City"
          value={city}
          onChangeText={text => setCity(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Year"
          value={year}
          onChangeText={text => setYear(text)}
          style={styles.input}
          keyboardType="numeric"
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
      </View>
      <Text>To create an account your email must be educational (ending with edu).</Text>
      <View style={styles.buttonContainer}>
    
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
