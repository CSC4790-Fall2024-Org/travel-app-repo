import React, { useState } from "react"; 
import { KeyboardAvoidingView, TouchableOpacity, Text, View, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';

function Demo() {
    const navigation = useNavigation(); // Define navigation here

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding"> 
        <Text style={styles.title}>Welcome to StudyGuide</Text>
        <View style={styles.container}>
            {/* <Image 
                source={require('./assets/your-image.jpg')} // Adjust path to your image
                style={styles.image} 
                resizeMode="contain" // Adjust image sizing as needed
            /> */}
        </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.button}>
                        <Text style={styles.buttonText}>Login</Text> 
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("SignUp")} style={styles.button}>
                        <Text style={styles.buttonText}>Register</Text> 
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundcolor: '#D1FFBD',
  },
  image: {        
    width: 200,        
    height: 200,    
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {    
    fontSize: 34, 
    fontWeight: "bold",    
    marginBottom: 20, 
    textAlign: 'center',
    padding: 20,
    marginTop: 100,
    fontFamily: 'Times New Roman',
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
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: 'white', 
    fontSize: 18,
    fontWeight: "bold",    
    //fontFamily: 'Times New Roman',
  },
});

export default Demo; 