import React from "react";
import { Text, View, StyleSheet } from "react-native";

export default function CreateStaysPost() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Stays Post</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});