import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LottieView from "lottie-react-native";
import { colors } from '../theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const Loader = () => {
  return (
    <View style={{justifyContent:'center',alignItems:'center',flex:1,backgroundColor:colors.background}}>
      <LottieView
      source={require("../animation/loader.json")}
      style={{width:wp(50), height:wp(50)}}
      autoPlay
      loop
    />
    </View>
  )
}

export default Loader;

