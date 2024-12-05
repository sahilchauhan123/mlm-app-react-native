import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../assest/theme'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Setting = (props) => {


  async function logout() {
    await AsyncStorage.removeItem('userToken');
    console.log("Async data cleared");
    props.navigation.navigate('LoginUser');
  }

  return (
    <SafeAreaView style={{backgroundColor:colors.background,flex:1}}>

      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>
            Logout 
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Setting

const styles = StyleSheet.create({
  buttonText: {
    fontSize: wp(5),
    textAlign: 'center',
    fontWeight: '700',
    color: 'white',
  },
  headerContainer: {
    marginTop: hp(4),
    marginHorizontal: wp(5),
  },
  button: {
    borderRadius: 7,
    backgroundColor: colors.primary,
    paddingVertical: hp(1),
  },
})