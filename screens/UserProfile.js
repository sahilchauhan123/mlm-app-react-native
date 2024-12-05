
import React, { useEffect, useState } from 'react';
import { View, Button, Image, Alert, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../assest/theme'; // Fixed path
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loader from '../assest/animation/Loader'; // Fixed path

const UpdateProfile = ({ route,navigation}) => {
  const userDet = route.params?.documentId || {};
  const [documentId, setDocumentId] = useState(userDet);
  const [photo, setPhoto] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (documentId) {
        try {
          const documentSnapshot = await firestore()
            .collection('Users')
            .doc(documentId)
            .get();

          if (documentSnapshot.exists) {
            setUserDetails(documentSnapshot.data());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          Alert.alert('Error fetching user data', error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [documentId]);

  const selectImage = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      includeBase64: true,
      cropping: true,
      compressImageQuality: 0.8,
      cropperCircleOverlay: true
    })
      .then((image) => {
        setPhoto(image.data);
        updateProfileImage(image.data);
      })
      .catch((error) => {
        console.error('ImagePicker Error: ', error);
        Alert.alert('Error selecting image', error.message);
      });
  };

  const updateProfileImage = async (base64Image) => {
    try {
      await firestore().collection('Users').doc(documentId).update({
        photoURL: base64Image,
      });
      Alert.alert('Profile image updated successfully!');
    } catch (error) {
      console.error('Error updating profile image: ', error);
      Alert.alert('Error updating profile image', error.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <View style={{ backgroundColor: colors.background, borderBottomLeftRadius: wp(7), borderBottomRightRadius: wp(7) }}>


        <View style={styles.View1}>
          <View style={{flex:2}}>
          <Text style={[styles.headerText,{textAlign:'right',paddingRight:wp(5.1)}]}>Profile</Text>

          </View>

          <View style={{flex:1}}>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile',{documentId})}>
          <Text style={[styles.headerText,{textAlign:'right',fontSize:wp(3)}]}>Edit</Text>
          </TouchableOpacity>
          </View>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', }}>
          {
            userDetails?.photoURL ? (
              
                <Image
                  source={{ uri: `data:image/png;base64,${userDetails.photoURL}` }}
                  style={styles.image2}
                />
             
            ) : (
           
                <Image
                  source={require("../assest/images/userimage.png")}
                  style={styles.image2}
                />
    
            )
          }
          <View>

          </View>
          <Text style={styles.name}>
            {userDetails.firstName} {userDetails.lastName}
          </Text>
        </View>
       
      </View>

      <View style={{ marginVertical: wp(5), marginHorizontal: wp(5) }}>
        



        

        {/* for email */}
        <View style={styles.detail}>
          <Image
            style={styles.imageicon}
            source={require('../assest/images/id.png')}
          />
          <Text style={styles.placeholdertext}>
            Unique Id
          </Text>
        </View>
        <Text style={styles.inputtext} >{userDetails.uniqueId}</Text>
        <View style={styles.divider} />
        <View style={styles.divider} />


        {/* for email */}
        <View style={styles.detail}>
          <Image
            style={styles.imageicon}
            source={require('../assest/images/mail.png')}
          />
          <Text style={styles.placeholdertext}>
            Email
          </Text>
        </View>
        <Text style={styles.inputtext}>
          {userDetails.email}
        </Text>
        <View style={styles.divider} />
        <View style={styles.divider} />

        {/* for mobile number  */}
        <View style={styles.detail}>
          <Image
            style={[styles.imageicon]}
            source={require('../assest/images/upi2.png')}
          />
          <Text style={styles.placeholdertext}>
            UPI
          </Text>
        </View>
        {
          userDetails.upiId ? ( 
          <Text style={styles.inputtext}>
            {userDetails.upiId}hi
          </Text>):(
            <TouchableOpacity>
            <Text style={styles.inputtext} >
            Add UPI 
          </Text>
          </TouchableOpacity>)
        }

        <View style={styles.divider} />
        <View style={styles.divider} />

        {/* for upi id  */}
        <View style={styles.detail}>
          <Image
            style={styles.imageicon}
            source={require('../assest/images/phone.png')}
          />
          <Text style={styles.placeholdertext}>
            Mobile
          </Text>
        </View>
        
        {
          userDetails.phoneNo ? (
            <Text>{userDetails.phoneNo}</Text>
          ) : (
            <Text style={styles.inputtext} >Add phone number</Text>
          )
        }

        <View style={styles.divider} />
        <View style={styles.divider} />

        {/* for upi id  */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  divider: {
    height: wp(0.1),
    width: 'auto',
    backgroundColor: colors.background,
    marginBottom: wp(3)
  },
  View1: {
    marginHorizontal: wp(4.5),
    marginTop: hp(2.5),
    flexDirection:'row',
    alignItems:"center"
    

  },
  inputtext: {
    marginLeft: wp(11),
    fontWeight: '600',
    fontSize: wp(3.5),
    color: colors.background,
    marginBottom: wp(5)
  },
  placeholdertext: {
    fontWeight: '600', color: colors.light
  },
  headerText: {
    fontSize: wp(7),
    textAlign: 'center',
    color: colors.primary,
    fontWeight: 'bold',
  },
  image2: {
    width: 100,
    height: 100,
    borderRadius: 50, // Make it circular
    marginVertical: hp(2),
    borderWidth: 2,
    borderColor: 'white'
  },
  name: {
    fontSize: wp(5),
    color: colors.primary,
    fontWeight:'600',
    marginBottom:wp(2)
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageicon: {
    height: wp(8),
    width: wp(8),
    marginRight: wp(3)
  }
});

export default UpdateProfile;
