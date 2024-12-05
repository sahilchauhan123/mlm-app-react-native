

import { StyleSheet, Text, View, SafeAreaView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '../assest/theme';
import firestore, { doc } from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import footerData from '../assest/data/uiData';
import blockData from '../assest/data/block';
import ImageSlider from '../assest/data/ImageSlider';
import Loader from '../assest/animation/Loader';

const HomeScreen = (props) => {
  const [userEmail, setUserEmail] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [documentId, setDocumentId] = useState(null);


  useEffect(() => {
    async function getUserEmail() {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        const parsedToken = JSON.parse(userToken);
        console.log('User email:', parsedToken.email);
        setUserEmail(parsedToken.email);
      }
    }
    getUserEmail();
  }, []);

  useEffect(() => {
    if (userEmail) {
      async function fetchUserDetails() {
        try {
          const querySnapshot = await firestore()
            .collection('Users')
            .where('email', '==', userEmail)
            .limit(1)
            .get();

          querySnapshot.forEach(documentSnapshot => {
            console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
            setUserDetails(documentSnapshot.data());
            setDocumentId(documentSnapshot.id);

            // console.log(documentId);
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
      fetchUserDetails();
    }
  }, [userEmail]);

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={styles.parent}>


        <View style={styles.header}>
          <Image
            source={require("../assest/images/logo.png")}
            style={styles.image}
          />
          {
            userDetails.photoURL ? (
              <TouchableOpacity onPress={() => props.navigation.navigate('UserProfile', { documentId })}>
                <Image
                  source={{ uri: `data:image/png;base64,${userDetails.photoURL}` }} // Use the Base64 string
                  style={[styles.image2,{borderColor:'white',borderWidth:1.5}]}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => props.navigation.navigate('UserProfile', { documentId })}>
                <Image
                  source={require("../assest/images/userimage.png")}
                  style={styles.image2}
                />
              </TouchableOpacity>
            )
          }

          

        </View>
        <View style={styles.View2}>
          <Text style={styles.text}>Welcome</Text>
          <Text style={styles.text}>{userDetails.firstName} {userDetails.lastName}</Text>


        </View>
      </View>


      <View style={styles.view3}>
        {
          blockData.map((item, index) => (
            <View style={{ padding: 10 }} key={index}>
              <TouchableOpacity style={{
                backgroundColor: colors.background,
                justifyContent: 'space-around',
                alignItems: 'center',
                borderRadius: 10,
                padding: wp(3)
              }}
           
                onPress={() => props.navigation.navigate(item.screen,{documentId})}
              >
                <Image
                  source={item.image}
                  style={{ height: wp(25), width: wp(25), margin: wp(5) }}
                />
                <Text style={{ fontSize: wp(5), color: colors.primary, fontWeight: '400', fontWeight: '600' }}>{item.title}</Text>
              </TouchableOpacity>
            </View>
          ))
        }
     

        {/* <TouchableOpacity
          className='bg-green-100'
          onPress={() => props.navigation.navigate('ViewFamilyTree', { documentId })}>
          <Text className='text-3xl'>
            hierarchy
          </Text>
        </TouchableOpacity> */}
      </View>


      <View style={styles.footer}>

        {
          footerData.map((item, key) => (
            <TouchableOpacity key={key} onPress={() => props.navigation.navigate(item.screen)} style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={item.image}
                style={styles.image3}
              />
              <Text style={{ color: colors.primary, fontSize: wp(4), fontWeight: '600' }}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))
        }

      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  view3: {
    marginHorizontal: wp(3),
    marginVertical: hp(2.5),
    flexDirection: "row",
    flexWrap: 'wrap',
    justifyContent: 'space-around'

  },
  parent: {
    backgroundColor: colors.background,
    borderBottomEndRadius: wp(8),
    borderBottomStartRadius: wp(8),
    paddingBottom: hp(2),



  },
  footer: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 15,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: hp(2),
    left: 0,
    right: 0,
    marginHorizontal: wp(3),

  },
  footerText: {
    color: '#fff',
  },
  image3: {
    height: wp(8),
    width: wp(8),

  },
  text: {
    fontSize: wp(8),
    fontWeight: '700',
    color: colors.primary,
    paddingLeft: 5,


  },
  View2: {
    marginHorizontal: wp(4.5),
    borderRadius: 5
  },
  header: {
    justifyContent: 'space-between',
    marginHorizontal: wp(4.5),
    marginVertical: hp(2.5),
    flexDirection:'row'

  },
  image: {
    height: wp(12),
    width: wp(25)
  },
  image2: {
    height: wp(13),
    width: wp(13),
    borderRadius:wp(10)

  }
});

export default HomeScreen;


// 