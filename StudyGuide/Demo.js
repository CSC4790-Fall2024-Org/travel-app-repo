import React from "react"; 
import { KeyboardAvoidingView, TouchableOpacity, Text, View, StyleSheet, ScrollView, Image } from "react-native";
import { useNavigation } from '@react-navigation/native';

function Demo() {
    const navigation = useNavigation(); 

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding"> 
            <Text style={styles.title}>Welcome to StudyGuide</Text>
            <View style={styles.imageContainer}>
                <Image 
                    source={require('./Logo.jpeg')} 
                    style={styles.image} 
                />
            </View>
            {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.button}>
                        <Text style={styles.buttonText}>Login</Text> 
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("SignUp")} style={styles.button}>
                        <Text style={styles.buttonText}>Register</Text> 
                    </TouchableOpacity>
                </View>
            {/* </ScrollView> */}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%'
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40, 
  },
  image: {        
    width: 300, 
    height: 300,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {    
    fontSize: 34, 
    fontWeight: "bold",    
    marginBottom: 20, 
    textAlign: 'center',
    fontFamily: 'Times New Roman',
    marginTop: 50,
  },
  buttonContainer: {
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 20, 
  },
  button: {
    backgroundColor: 'green',
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
});

export default Demo;
