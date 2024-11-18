// import React, { useState } from "react"; 
// import { KeyboardAvoidingView, TouchableOpacity, Text, TextInput, View, StyleSheet, Alert, ScrollView } from "react-native";
// import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
// import { useNavigation } from '@react-navigation/native';
// import { getFirestore, db, doc, getDoc } from 'firebase/firestore'; // Import Firestore functions


// const LoginScreen = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const navigation = useNavigation();
//   const auth = getAuth();
//   const db = getFirestore(); // Initialize Firestore

  

//   // const handleLogin = async () => {
//   //   try {
//   //     const userCredentials = await signInWithEmailAndPassword(auth, email, password);
//   //     const user = userCredentials.user;

//   //     const userDocRef = doc(db, 'users', user.uid);
//   //     const userDocSnapshot = await getDoc(userDocRef);

//   //     if (userDocSnapshot.exists()) {   // Check if the user document exists
//   //       console.log("User's email is verified.");
//   //       navigation.navigate('Profile', { uid: user.uid });
    
//   //     } else {
//   //     // reached this statement but only after user has signed up but not authenticated
      
//   //       console.log("User document does not exist.");
//   //       Alert.alert('Error', 'No user found with those credentials. Please verify your email and password or signup.')
        
//   //   }
    
//   //   } catch (error) {
//   //     switch (error.code) {
//   //       case 'auth/user-not-found': // not working, this situation should be taken care of in the else above
//   //       console.log("in auth/user-not-found");
//   //         Alert.alert('Error', 'No user found with this email. Please check your email or register.');
//   //         break;
//   //       //case 'auth/wrong-password':
//   //       case 'auth/invalid-login-credentials':
//   //         console.log("in auth/invalid login credentials");
//   //         Alert.alert('Error', 'No user found with this email. Please check your email or register. ')
//   //         break;
//   //       case 'auth/invalid-credential':
//   //         Alert.alert('Error', 'These credentials are incorrect. Please try again or click forgot password below.');
//   //         break;
//   //       case 'auth/missing-password':
//   //         Alert.alert('Error', 'Please enter your password.');
//   //         break;
//   //       case 'auth/invalid-email':
//   //         Alert.alert('Error', 'Please enter your email.');
//   //         break;
//   //       default:
//   //         Alert.alert('Error', error.message);
//   //     }
//   //   }
//   // };
//   const handleLogin = async () => {
//     try {
//       const userCredentials = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredentials.user;
  
//       // Fetch the user's document from Firestore
//       const userDocRef = doc(db, 'users', user.uid);
//       const userDocSnapshot = await getDoc(userDocRef);
  
//       if (userDocSnapshot.exists()) { // Check if the user document exists
//         const userData = userDocSnapshot.data();
//         const isVerified = userData.emailVerified; // Check the `emailVerified` field in Firestore
  
//         if (isVerified) {
//           console.log("User's email is verified.");
//           navigation.navigate('Profile', { uid: user.uid });
//         } else {
//           console.log("User's email is not verified.");
//           Alert.alert('Error', 'Your email is not verified. Please verify your email before logging in.');
//         }
//       } else {
//         console.log("User document does not exist.");
//         Alert.alert('Error', 'No user found with those credentials. Please verify your email and password or sign up.');
//       }
//     } catch (error) {
//       switch (error.code) {
//         case 'auth/user-not-found':
//           console.log("in auth/user-not-found");
//           Alert.alert('Error', 'No user found with this email. Please check your email or register.');
//           break;
//         case 'auth/wrong-password':
//           console.log("in auth/wrong-password");
//           Alert.alert('Error', 'Incorrect password. Please try again.');
//           break;
//         case 'auth/invalid-credential':
//           Alert.alert('Error', 'These credentials are incorrect. Please try again or click forgot password below.');
//           break;
//         case 'auth/missing-password':
//           Alert.alert('Error', 'Please enter your password.');
//           break;
//         case 'auth/invalid-email':
//           Alert.alert('Error', 'Please enter a valid email.');
//           break;
//         default:
//           Alert.alert('Error', error.message);
//       }
//     }
//   };
  

//   const handleForgotPassword = async () => {
//     try {
//       await sendPasswordResetEmail(auth, email);
//       Alert.alert('Success', 'Password reset email sent! Check your inbox.');
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   return (
//     <KeyboardAvoidingView style={styles.container} behavior="padding"> 
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <Text style={styles.title}>Sign In</Text>
//         <View style={styles.inputContainer}>
//           <TextInput
//             placeholder="Email"
//             value={email}
//             onChangeText={text => setEmail(text)}
//             style={styles.input}
//           />
//           <View style={styles.passwordContainer}>
//             <TextInput
//               placeholder="Password"
//               value={password}
//               onChangeText={text => setPassword(text)}
//               style={styles.passwordInput}
//               secureTextEntry={!showPassword} 
//             />
//             <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//               <Text style={styles.showButton}>{showPassword ? "Hide" : "Show"}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity onPress={handleLogin} style={styles.button}>
//             <Text style={styles.buttonText}>Login</Text> 
//           </TouchableOpacity>
//           <TouchableOpacity onPress={handleForgotPassword} style={styles.button}>
//             <Text style={styles.buttonText}>Forgot Password?</Text> 
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   inputContainer: {
//     width: '100%',
//     maxWidth: 400,
//   },
//   title: {    
//     fontSize: 34, 
//     fontWeight: "bold",    
//     marginBottom: 20, 
//     textAlign: 'center',
//     padding: 20,
//     marginTop: 100,
//     //fontFamily: 'Times New Roman',
//   },
//   input: {
//     backgroundColor: 'white',
//     paddingHorizontal: 15,
//     paddingVertical: 15,
//     borderRadius: 10,
//     marginTop: 30,
//     borderWidth: 0,
//   },
//   passwordContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 15,
//     backgroundColor: 'white',
//     borderRadius: 10,
//   },
//   passwordInput: {
//     flex: 1,
//     paddingHorizontal: 15,
//     paddingVertical: 15,
//     borderRadius: 10,
//     borderWidth: 0,
//   },
//   showButton: {
//     paddingHorizontal: 10,
//     paddingVertical: 15,
//     color: 'rgb(60, 179, 113)',
//     fontWeight: 'bold',
//   },
//   buttonContainer: {
//     width: '100%',
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 20,
//   },
//   button: {
//     backgroundColor: 'green',
//     width: '100%', 
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   buttonText: {
//     color: 'white', 
//     fontSize: 15,
//     fontWeight: "bold",    
//     //fontFamily: 'Times New Roman',
//   },
// });

// export default LoginScreen;











// code from old commit to git 



import React, { useState } from "react"; 
import { KeyboardAvoidingView, TouchableOpacity, Text, TextInput, View, StyleSheet, Alert, ScrollView } from "react-native";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { getFirestore, db, doc, getDoc } from 'firebase/firestore'; // Import Firestore functions


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const auth = getAuth();
  const db = getFirestore(); // Initialize Firestore

  

  const handleLogin = async () => {
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {   // Check if the user document exists
        console.log("User's email is verified.");
        navigation.navigate('Profile', { uid: user.uid });
    
      } else {
      // reached this statement but only after user has signed up but not authenticated
      
        console.log("User document does not exist.");
        Alert.alert('Error', 'No user found with those credentials. Please verify your email and password or signup.')
        
    }
    
    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found': // not working, this situation should be taken care of in the else above
        console.log("in auth/user-not-found");
          Alert.alert('Error', 'No user found with this email. Please check your email or register.');
          break;
        //case 'auth/wrong-password':
        case 'auth/invalid-login-credentials':
          console.log("in auth/invalid login credentials");
          Alert.alert('Error', 'No user found with this email. Please check your email or register. ')
          break;
        case 'auth/invalid-credential':
          Alert.alert('Error', 'These credentials are incorrect. Please try again or click forgot password below.');
          break;
        case 'auth/missing-password':
          Alert.alert('Error', 'Please enter your password.');
          break;
        case 'auth/invalid-email':
          Alert.alert('Error', 'Please enter your email.');
          break;
        default:
          Alert.alert('Error', error.message);
      }
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'Password reset email sent! Check your inbox.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding"> 
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text> 
          </TouchableOpacity>
          <TouchableOpacity onPress={handleForgotPassword} style={styles.button}>
            <Text style={styles.buttonText}>Forgot Password?</Text> 
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
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
    padding: 20,
    marginTop: 100,
    //fontFamily: 'Times New Roman',
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
    marginTop: 20,
  },
  button: {
    backgroundColor: 'green',
    width: '100%', 
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white', 
    fontSize: 15,
    fontWeight: "bold",    
    //fontFamily: 'Times New Roman',
  },
});

export default LoginScreen;