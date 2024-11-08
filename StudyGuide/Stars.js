import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function RatingReview({ rating, setRating }) {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => setRating(star)}>
          <Text style={[styles.star, { color: rating >= star ? 'gold' : 'gray' }]}>
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  star: {
    fontSize: 35,
    marginHorizontal: 5,
  },
});

export default RatingReview;
