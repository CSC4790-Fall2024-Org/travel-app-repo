import React, { useState } from "react"; 
import { KeyboardAvoidingView, TouchableOpacity, Text, TextInput, View, StyleSheet, Alert } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Profile from './Profile';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    const auth = getAuth();
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;
      console.log(user.email);
      navigation.navigate('Profile', { uid: user.uid });
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Error', 'No user found with this email. Please check your email or register.');
      } else if (error.code === 'auth/invalid-login-credentials') {
        Alert.alert('Error', 'This password is incorrect. Please try again or click forgot password below.');
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
      <Text style={styles.title}>Sign In</Text>
      <View style={styles.inputContainer}>
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text> 
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
        >
          <Text style={styles.buttonText}>Forgot Password?</Text> 
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

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
    marginTop: 30,
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
    marginTop: 5,
  },
  buttonText: {
    color: 'white', 
    fontSize: 15,
  },
});

export default LoginScreen;
