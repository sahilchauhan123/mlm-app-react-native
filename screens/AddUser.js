import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../assest/theme';

const AddUser = ({ route }) => {
  const userDetails = route.params?.documentId || {}; // Fetching documentId from route
  const [doc, setDocumentId] = useState(userDetails); // Setting documentId for user
  const [uniqueId, setUniqueId] = useState(''); // Unique ID to add child
  const [childrenCount, setChildrenCount] = useState(0); // Track the count of children
  const [errorMessage, setErrorMessage] = useState('');

  // Function to add a child by unique ID
  const addUser = async () => {
    if (uniqueId) {
      try {
        const querySnapshot = await firestore()
          .collection('Users')
          .where('uniqueId', '==', uniqueId)
          .get();

        if (querySnapshot.empty) {
          setErrorMessage("No user found with this Unique ID.");
          return;
        }

        const userRef = firestore().collection('Users').doc(doc);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          const currentChildren = userData.childrenIds || [];

          if (currentChildren.length >= 3) {
            setErrorMessage("Cannot add more than 3 children.");
            return;
          }

          const childDoc = querySnapshot.docs[0];
          const childData = childDoc.data();
          if (childData.parentId) {
            setErrorMessage("This child already has a parent.");
            return;
          }

          // Add the new child ID to the parent's childrenIds array
          await userRef.update({
            childrenIds: firestore.FieldValue.arrayUnion(uniqueId),
          });

          // Update the child's parentId with the parent's unique ID
          await childDoc.ref.update({
            parentId: userData.uniqueId, // Set parentId to the parent's unique ID
          });

          console.log("Child added and parent ID updated successfully!");
          setChildrenCount(currentChildren.length + 1);
          setErrorMessage('');
        } else {
          setErrorMessage("User not found with documentId.");
        }
      } catch (error) {
        console.error("Error adding child:", error);
        setErrorMessage("Error adding child.");
      }
    } else {
      setErrorMessage("Unique ID is required.");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRef = firestore().collection('Users').doc(doc);
        const userDoc = await userRef.get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setChildrenCount(userData.childrenIds?.length || 0);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [doc]);

  return (
    <SafeAreaView style={{ backgroundColor: colors.background, flex: 1 }}>
      <View style={styles.view1}>
        <Text style={styles.Text1}>Add Users</Text>
        <Text style={styles.titleText}>Unique ID</Text>

        <View style={{ borderColor: 'grey', borderWidth: 1, borderRadius: 10, marginVertical: hp(2), backgroundColor: "white" }}>
          <TextInput
            style={styles.input}
            placeholder='Enter unique ID'
            onChangeText={setUniqueId}
          />
        </View>

        <TouchableOpacity onPress={addUser} style={{ backgroundColor: colors.primary, justifyContent: "center", alignItems: "center", borderRadius: 10 }}>
          <Text style={{ margin: wp(2), color: colors.white, fontWeight: '600', fontSize: wp(5) }}>
            Add Child
          </Text>
        </TouchableOpacity>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : (
          <Text style={{ marginTop: hp(2), fontSize: wp(4), color: colors.text }}>
            Children Count: {childrenCount}/3
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AddUser;

const styles = StyleSheet.create({
  view1: {
    marginHorizontal: wp(5),
    marginVertical: hp(5),
  },
  input: {
    fontSize: 14,
    color: 'black',
  },
  titleText: {
    color: colors.light,
    fontSize: 14,
  },
  Text1: {
    color: colors.primary,
    fontSize: wp(8),
    fontWeight: 'bold',
  },
  errorText: {
    marginTop: hp(2),
    fontSize: wp(4),
    color: 'red',
  },
});
