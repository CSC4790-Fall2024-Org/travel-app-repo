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
                        <Text style={styles.buttonText}>Sign up</Text> 
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
    marginVertical: 10, 
  },
  image: {        
    width: 400, 
    height: 400,
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
    marginBottom: 10, 
    textAlign: 'center',
    fontFamily: 'Times New Roman',
    marginTop: 30,
  },
  buttonContainer: {
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 20, 
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
});

export default Demo;
