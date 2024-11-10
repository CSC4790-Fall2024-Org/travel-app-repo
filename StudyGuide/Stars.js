import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

function RatingReview({ rating, setRating }) {
  const [halfStars, setHalfStars] = useState({}); // Track stars

  const handleTap = (star) => {
    if (halfStars[star]) {
      // If half, make it full
      setRating(star);
      setHalfStars({ ...halfStars, [star]: false });
    } else {
      // If not half, make it half
      setRating(star - 0.5);
      setHalfStars({ ...halfStars, [star]: true });
    }
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFull = rating >= star;
        const isHalf = rating === star - 0.5;
        
        return (
          <TouchableOpacity
            key={star}
            activeOpacity={0.7}
            onPress={() => handleTap(star)}
            style={{ marginHorizontal: 5 }} // space b/n stars
          >
            {isFull ? (
              <Ionicons name="star" size={35} color="gold" />
            ) : isHalf ? (
              <Ionicons name="star-half" size={35} color="gold" />
            ) : (
              <Ionicons name="star-outline" size={35} color="gray" />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default RatingReview;
