import React from "react";
import { Text, View, StyleSheet } from "react-native";

export default function Posts() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Posts</Text>
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
