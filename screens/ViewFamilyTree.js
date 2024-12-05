import { SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../assest/theme';
import Loader from '../assest/animation/Loader';

const ViewFamilyTree = ({ route }) => {
  const documentId = route.params?.documentId; // The document ID of the user
  const [familyTree, setFamilyTree] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading,setLoading] = useState(true);


  const fetchFamilyTree = async (uniqueId, level = 1) => {
    if (level > 10) return; // Limit to 10 levels

    try {
      const userDoc = await firestore().collection('Users').where('uniqueId', '==', uniqueId).get();
      
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        const parentId = userData.parentId;

        // Add current user to the family tree
        setFamilyTree(prev => [...prev, { name: `${userData.firstName} ${userData.lastName}`, level }]);

        // If there's a parent, fetch the parent data recursively
        if (parentId) {
          fetchFamilyTree(parentId, level + 1);
        }
      } else {
        setErrorMessage("User not found.");
        setLoading(false)

      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching family tree:", error);
      setErrorMessage("Error fetching family tree.");
      setLoading(false)
    }
  };

  useEffect(() => {
    if (documentId) {
      const fetchUserData = async () => {
        try {
          const userDoc = await firestore().collection('Users').doc(documentId).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            const uniqueId = userData.uniqueId; // Get the unique ID from the document
            
            // Start fetching the family tree using the unique ID
            fetchFamilyTree(uniqueId);
          } else {
            setErrorMessage("User document not found.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setErrorMessage("Error fetching user data.");
        }
        setLoading(false)
      };

      fetchUserData(); // Fetch the user's unique ID and start fetching the family tree
    } else {
      setErrorMessage("Document ID is required.");
    }
  }, [documentId]);

  if(loading) return <Loader/>
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <Text style={styles.title}>Chain Tree</Text>
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        {familyTree.length === 0 ? (
          <Text>No family data available.</Text>
        ) : (
          familyTree.map((member, index) => (
            <View style={styles.innercontainer} key={index}>

            
            <Text  style={styles.memberText}>

              Level {member.level}: {member.name}
            </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewFamilyTree;

const styles = StyleSheet.create({
  innercontainer:{
    backgroundColor:colors.white,
    marginVertical:hp(1),
    padding:wp(1),
    borderRadius:5
  },
  container: {
    padding: wp(5),
  },
  title: {
    fontSize: wp(8),
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: hp(2),
  },
  memberText: {
    fontSize: wp(4.5),
    color: 'black',
    fontWeight:'500'
  },
  errorText: {
    color: 'red',
    marginBottom: hp(2),
  },
});
