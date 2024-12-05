import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../assest/theme';
import Loader from '../assest/animation/Loader';
import { ScrollView } from 'react-native';

const Myteam = (props) => {
  const [userData, setUserData] = useState(null);
  const [userChildren, setUserChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [documentId, setDocumentId] = useState(null);


  // Fetch user data based on email from AsyncStorage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data...");

        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          const parsedToken = JSON.parse(userToken);
          const querySnapshot = await firestore()
            .collection('Users')
            .where('email', '==', parsedToken.email)
            .limit(1)
            .get();

          if (!querySnapshot.empty) {
            const user = querySnapshot.docs[0].data();
            setUserData({ ...user, id: querySnapshot.docs[0].id });
            setDocumentId(querySnapshot.docs[0].id);
             
            console.log("User data fetched:", user);
          } else {
            console.log('No matching documents.');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Fetch children data after user data is set
  useEffect(() => {
    const fetchChildrenData = async () => {
      if (userData && userData.childrenIds && userData.childrenIds.length > 0) {
        try {
          const childrenData = [];

          for (const childId of userData.childrenIds) {
            const querySnapshot = await firestore()
              .collection('Users')
              .where('uniqueId', '==', childId)
              .limit(1)
              .get();

            querySnapshot.forEach(doc => {
              childrenData.push(doc.data());
            });
          }

          setUserChildren(childrenData);
        } catch (error) {
          console.error('Error fetching children data:', error);
        }
      }

      // Set loading to false only after all data fetching is complete
      setLoading(false);
    };

    if (userData) {
      fetchChildrenData();
    }
  }, [userData]);

  // Render loading state
  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: colors.background, borderBottomEndRadius: 15, borderBottomStartRadius: 15, marginHorizontal: wp(2) }}>
        <View style={styles.header}>
          <Text style={styles.headerText}>My Team</Text>
        </View>
      </View>
      <ScrollView>

      
      <View style={styles.userDataContainer}>
        <Text style={styles.userDataText}>
          Users {userChildren.length}/3
        </Text>
      </View>

      <View style={styles.childrenContainer}>
        {userChildren.length > 0 ? (
          userChildren.map((child, index) => (
            <View key={index} style={styles.childContainer}>
              <Text style={styles.childName}>{child.firstName} {child.lastName}</Text>
              <Text style={styles.childPhone}>Phone: {child.phoneNo || 'N/A'}</Text>

              {child.childrenIds && child.childrenIds.length > 0 ? (
                child.childrenIds.map((grandchildId, idx) => (
                  <View key={idx} style={styles.grandchildContainer}>
                    <Text style={styles.grandchildText}>Grandchild ID: {grandchildId}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noChildrenText}>No children for this user</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noChildrenText}>No children data available</Text>
        )}

        {/* Show Add User option if the user has less than 3 children */}
        {userData && userData.childrenIds && userData.childrenIds.length < 3 && (
          <TouchableOpacity onPress={() => props.navigation.navigate('AddUser', {documentId })}>
          <View style={{
            justifyContent: 'space-between', alignItems: 'center',flexDirection:'row',
            borderRadius:15,
            margin: wp(2),
            backgroundColor:colors.background,
            paddingHorizontal: wp(4),

            
            }}>
            <Text style={styles.childName}>Add Member</Text>
            <View style={{ borderRadius: 15,margin:wp(1)}}>
              
                <Image
                  style={{ height: wp(15), width: wp(15) }}
                  source={require('../assest/images/adduser.png')}
                />
              
            </View>
          </View>
          </TouchableOpacity>
        )}
      </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.white
  },
  header: {
    borderRadius: 15,
    backgroundColor: colors.background,
    margin: 5,
    padding: hp(1),
  },
  headerText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: wp('8%'),
    color: colors.primary,
  },
  userDataContainer: {
    marginTop: wp(6),
    marginHorizontal: wp(2),
    justifyContent: 'flex-end',
  },
  userDataText: {
    fontSize: wp(5),
    color: colors.background,
    fontWeight: '600',
    textAlign: 'right',
  },
  childrenContainer: {
    justifyContent: 'space-between',
  },
  childContainer: {
    backgroundColor: colors.background,
    margin: wp(2),
    padding: wp(4),
    borderRadius: 16,
  },
  childName: {
    fontSize: wp('6%'),
    color: colors.primary,
  },
  childPhone: {
    fontSize: wp('5%'),
    color: '#FFFFFF',
  },
  grandchildContainer: {
    backgroundColor: colors.accent,
    padding: 8,
    margin: 8,
    borderRadius: 15,
  },
  grandchildText: {
    fontSize: wp('5%'),
    color: '#FFFFFF',
  },
  noChildrenText: {
    fontSize: wp('5%'),
    color: '#FFFFFF',
    textAlign:'center',
    color:colors.secondary
  },
});

export default Myteam;
