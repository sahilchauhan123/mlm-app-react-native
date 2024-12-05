// src/components/ImageSlider.js

import React from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width } = Dimensions.get('window');

// Example image URLs
const images = [
  { uri: 'https://via.placeholder.com/600x300/FF5733/FFFFFF?text=Image+1' },
  { uri: 'https://via.placeholder.com/600x300/33FF57/FFFFFF?text=Image+2' },
  { uri: 'https://via.placeholder.com/600x300/3357FF/FFFFFF?text=Image+3' },
];

const ImageSlider = () => {
  const renderItem = ({ item }) => (
    <Image source={item} style={styles.sliderImage} resizeMode="cover" />
  );

  return (
    <View style={styles.slider}>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  slider: {
    height: 200, // Adjust height as needed,
    marginVertical:hp(1),
  },
  sliderImage: {
    width: width, // Full width
    height: '100%', // Full height of the slider
    
  },
});

export default ImageSlider;
