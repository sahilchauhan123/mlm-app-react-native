import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';


import Level from './screens/level';
import Myteam from './screens/Myteam';
import Signup from './screens/Signup';
import LoginUser from './screens/LoginUser';
import HomeScreen from './screens/HomeScreen';
import Setting from './screens/Setting';
import Earning from './screens/Earning';
import Live from './screens/Live';
import UserProfile from './screens/UserProfile';
import Loader from './assest/animation/Loader';
import AddUser from './screens/AddUser';
import ViewFamilyTree from './screens/ViewFamilyTree';
import EditProfile from './screens/EditProfile';



const Stack = createNativeStackNavigator();

function App() {
  const [initialRoute, setInitialRoute] = useState("");
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const checkUserSession = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      if(userToken){
        setInitialRoute("HomeScreen");
      }
      else{
        setInitialRoute("LoginUser");
      }
      setLoading(false); 
    };
    checkUserSession();
  },[])

  if (loading) {
    return <Loader/>;
  }

  return (
    <NavigationContainer >
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
        <Stack.Screen name="Level" component={Level} />
        <Stack.Screen name="Myteam" component={Myteam} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="LoginUser" component={LoginUser} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Setting" component={Setting} />
        <Stack.Screen name="Earning" component={Earning} />
        <Stack.Screen name="Live" component={Live} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="AddUser" component={AddUser} />
        <Stack.Screen name="ViewFamilyTree" component={ViewFamilyTree} />
        <Stack.Screen name="EditProfile" component={EditProfile} />



      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;


