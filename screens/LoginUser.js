import { StyleSheet, Text, TextInput, View, TouchableOpacity,Modal, ScrollView, ActivityIndicator, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors, fonts } from './../assest/theme'; // Import theme file
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginUser = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleLogin = async () => {
        if (email && password) {
            setLoading(true);
            try {
                const userDetails = await auth().signInWithEmailAndPassword(email, password);
                const userId = userDetails.user;
                console.log('in login screen ',userId);
                await AsyncStorage.setItem('userToken', JSON.stringify(userId));
                console.log("Login Successful!", "Welcome back!");
                // setModalMessage("Login Successful!", "Welcome back!");
                // setModalVisible(true);
                props.navigation.navigate("HomeScreen");
            } catch (error) {
              
                console.log(error.message);
                setModalMessage("Enter a valid Email/Password ");
                setModalVisible(true);
            } finally {
                setLoading(false);
            }
        } else {
            console.log("All fields are required");
            setModalMessage("All fields are required");
            setModalVisible(true);
        }
    };


    

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>

                <View style={styles.headerContainer}>
                    <Text style={styles.titleText}>Login</Text>
                    <Text style={styles.subText}>Welcome back! Please log in to continue.</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.labelText}>Email</Text>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
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
                </View>

                <View style={styles.formContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator size={wp(7)} color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Login</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.footerContainer}>
                    <TouchableOpacity onPress={() => props.navigation.navigate("Signup")}>
                        <Text style={styles.footerText} >Don't have an account? <Text style={styles.linkText} onPress={() => props.navigation.navigate("Signup")}>Sign up</Text></Text>
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
    icon: {
        width: wp(6),
        height: wp(6),
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        marginTop:hp(5),
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
        fontWeight: '600',
        color:colors.background,
    },
    closeButton: {
        backgroundColor: colors.background,
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    closeButtonText: {
        color: colors.white,
        fontSize: wp(4),
        fontWeight: 'bold',
    },
});

export default LoginUser;

