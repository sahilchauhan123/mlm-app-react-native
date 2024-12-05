import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Image, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../assest/theme'; // Adjust path as needed
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loader from '../assest/animation/Loader'; // Adjust path as needed

const EditProfile = ({ route, navigation }) => {
  const { documentId } = route.params;
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    upiId: '',
    phoneNo: '',
    photoURL: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const documentSnapshot = await firestore().collection('Users').doc(documentId).get();
        if (documentSnapshot.exists) {
          setUserDetails(documentSnapshot.data());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error fetching user data', error.message);
      } finally {
        setLoading(false);
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
      cropperCircleOverlay: true,
    })
      .then((image) => {
        setUserDetails((prevDetails) => ({ ...prevDetails, photoURL: image.data }));
      })
      .catch((error) => {
        console.error('ImagePicker Error: ', error);
      });
  };

  const updateProfile = async () => {
    try {
      await firestore().collection('Users').doc(documentId).update({
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        upiId: userDetails.upiId,
        phoneNo: userDetails.phoneNo,
        photoURL: userDetails.photoURL,
      });
      Alert.alert('Profile updated successfully!');
      navigation.goBack(); // Navigate back after successful update
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error updating profile', error.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <SafeAreaView style={{ flex: 1 ,backgroundColor:colors.background}}>
      <View style={{ backgroundColor: colors.background, padding: wp(4) }}>
        <Text style={styles.headerText}>Edit Profile</Text>

        <TouchableOpacity onPress={selectImage} style={styles.imagePicker}>
          {userDetails.photoURL ? (
            <Image
              source={{ uri: `data:image/png;base64,${userDetails.photoURL}` }}
              style={styles.image}
            />
          ) : (
            <Image
              source={require('../assest/images/userimage.png')}
              style={styles.image}
            />
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={userDetails.firstName}
          onChangeText={(text) => setUserDetails({ ...userDetails, firstName: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={userDetails.lastName}
          onChangeText={(text) => setUserDetails({ ...userDetails, lastName: text })}
        />
       
        <TextInput
          style={styles.input}
          placeholder="Enter UPI ID"
          placeholderTextColor={'red'}
          value={userDetails.upiId}
          onChangeText={(text) => setUserDetails({ ...userDetails, upiId: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Phone Number"
          placeholderTextColor={'red'}
          value={userDetails.phoneNo}
          onChangeText={(text) => setUserDetails({ ...userDetails, phoneNo: text })}
        />

        <TouchableOpacity style={styles.button} onPress={updateProfile}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: wp(7),
    color: colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: hp(2),
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: hp(2),
    marginHorizontal:wp(30),
    
    
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
    marginVertical: hp(2),
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius:8,
    marginBottom: wp(4),
    paddingHorizontal: wp(2),
    color:colors.white
  },
  button: {
    backgroundColor: colors.primary,
    padding: wp(3),
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.background,
    fontSize: wp(4),
    fontWeight:'500'
  },
});

export default EditProfile;
