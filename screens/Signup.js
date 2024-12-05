

import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Modal, Alert, Image, ActivityIndicator, TouchableNativeFeedbackBase } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors, fonts } from './../assest/theme';  // Import theme file
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Timestamp } from '@react-native-firebase/firestore';



const Signup = (props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');


  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');


  const handleEmailChange = (input) => {
    setEmail(input.toLowerCase()); // Convert input to lowercase
  };

  const generateUniqueId = () => {
    return Math.floor(Math.random() * 1000000000).toString(); // Generates a random number and converts it to a string

  };
  function formdata() {
    let randomNumber = generateUniqueId();
    setLoading(true);

    if (password === confirmPass && password != null) {
      if (email && firstName && lastName != null) {
        try {

          const childrenIds = [];
          const parentId = "";
          const profileImg = "";


          auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
              firestore()
                .collection('Users')
                .add({

                  email,
                  firstName,
                  lastName,
                  password,
                  phoneNo: "", // Add this if phoneNo is required
                  upiId: "", // Add this if upiId is required
                  childrenIds, // Initialized as an empty array
                  parentId, // Ensure this value is set properly
                  profileImg,
                  uniqueId: randomNumber, // Unique ID generated
                  userCreatedAt: Timestamp.now(),


                })
                .then(() => {
                  console.log('User added!');
                  setModalMessage('account created');
                  setModalVisible(true);
                });
              console.log('User account created & signed in!');
            })
            .catch(error => {
              if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
                console.log("1");
              }

              if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
                console.log("2");
              }
              // console.log('look at this : ', error);
              setModalMessage(error.message);
              setModalVisible(true);
            });
        } catch (error) {
          console.log("error eroor error ")
          console.log("3");
        }
      } else {
        console.log("all Fields are Required")
        setModalMessage('All Fields are Required');
        setModalVisible(true);
        setLoading(false);

      }
    } else {
      console.log("Passwords do not match");
      setModalMessage('Passwords do not match!');
      setModalVisible(true);
      setLoading(false);

    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Text style={styles.titleText}>Sign up</Text>
          <Text style={styles.subText}>Create an account to get started</Text>
        </View>

        <View style={styles.formContainer}>

          <Text style={styles.labelText}>First Name</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              placeholder="Enter First Name"
              value={firstName}
              onChangeText={setFirstName}
              placeholderTextColor={colors.placeholder}
            />
          </View>

          <Text style={styles.labelText}>Last Name</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              placeholder="Enter Last Name"
              value={lastName}
              onChangeText={setLastName}
              placeholderTextColor={colors.placeholder}
            />
          </View>

          <Text style={styles.labelText}>Email</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              value={email}
              onChangeText={handleEmailChange}           
              keyboardType="email-address"
              autoCapitalize='none'
              placeholderTextColor={colors.placeholder}
            />
          </View>

          <Text style={styles.labelText}>Password</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
              placeholderTextColor={colors.placeholder}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {
                isPasswordVisible ? <Image
                  source={require('../assest/images/eye.png')}
                  style={styles.icon}
                /> : <Image
                  source={require('../assest/images/eye-slash.png')}
                  style={styles.icon} />
              }

            </TouchableOpacity>
          </View>

          <Text style={styles.labelText}>Confirm Password</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              placeholder="Enter Confirm Password"
              value={confirmPass}
              onChangeText={setConfirmPass}
              secureTextEntry={true}
              placeholderTextColor={colors.placeholder}
            />
          </View>
        </View>

        <View style={styles.formContainer}>
          <TouchableOpacity style={styles.button} onPress={formdata}>

            {loading ? (
              <ActivityIndicator size={wp(7)} color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Submit</Text>
            )}


          </TouchableOpacity>
        </View>

        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={() => props.navigation.navigate("LoginUser")}>
            <Text style={styles.footerText} >Already a Member? <Text style={styles.linkText} onPress={() => props.navigation.navigate("LoginUser")}>Login</Text></Text>
          </TouchableOpacity>
        </View>

        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}  // Close the modal when the back button is pressed on Android
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{modalMessage}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    marginTop: hp(4),
    marginHorizontal: wp(5),
  },
  titleText: {
    color: colors.primary,
    fontSize: wp(8),
    fontWeight: 'bold',
    fontFamily: fonts.bold,
  },
  subText: {
    color: colors.light,
    fontWeight: '300',
    fontFamily: fonts.regular,
  },
  formContainer: {
    marginHorizontal: wp(5),
    marginTop: hp(3),
  },
  labelText: {
    color: colors.light,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: fonts.regular,
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(1),
    borderRadius: 10,
    backgroundColor: 'white',
    paddingRight: wp(2),
  },
  icon: {
    width: wp(6),
    height: wp(6),
    marginRight: wp(2),

  },
  input: {
    flex: 1,
    paddingHorizontal: wp(2),
    color: colors.text,
    fontSize: wp(4),
  },
  eyeIcon: {
    paddingLeft: wp(2),
  },
  button: {
    borderRadius: 7,
    backgroundColor: colors.primary,
    paddingVertical: hp(1),
  },
  buttonText: {
    fontSize: wp(5),
    textAlign: 'center',
    fontWeight: '700',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',  // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: wp(5),
    marginBottom: hp(3),
    fontWeight: '600'
  },
  footerContainer: {
    marginTop: hp(3),
    alignItems: 'center',
  },
  footerText: {
    color: colors.light,
    fontSize: wp(4),
  },
  linkText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: colors.background,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Signup;
