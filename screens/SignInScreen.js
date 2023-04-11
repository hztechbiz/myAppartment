import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Keyboard,
} from 'react-native';
import {
  Button,
  Title,
  Text,
  TextInput,
  ActivityIndicator,
} from 'react-native-paper';
import Icon_FA from 'react-native-vector-icons/FontAwesome';
import Icon_FA_5 from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import {setFeedback, signIn} from '../actions';
import axios from 'axios';
import {apiActiveURL, appId} from '../ApiBaseURL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FeedbackModal from '../components/FeedbackModal';
import {useIsFocused} from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const statusBar = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const SignInScreen = (props) => {
  const isFocused = useIsFocused();
  const [value, onChangeText] = React.useState('');
  const [value2, onChangeText2] = React.useState('');

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    readDataPrev();
  }, [props, isFocused]);

  const readDataPrev = async () => {
    try {
      const loggedInUser = await AsyncStorage.getItem('user2');
      let parsed = JSON.parse(loggedInUser);
      if (parsed !== null) {
        parsed = JSON.parse(parsed.config.data);
        onChangeText(parsed.email);
        onChangeText2(parsed.password);
        authenticate(parsed.email, parsed.password);
        console.log(parsed.email, 'parsed try');
      }
    } catch (e) {
      const loggedInUser = await AsyncStorage.getItem('user');
      console.log(loggedInUser, 'loggedInUser catch');
    }
  };

  const [loader, setLoader] = React.useState(false);
  const [isPress, setIsPress] = React.useState(false);
  const handleInput = (data) => props.signIn(data);
  const url = `${apiActiveURL}/login_new`;
  const authenticate = (email, password) => {
    let ApiParamForLogin = {
      email: email,
      password: password,
      remember: 1,
    };
    let options = {
      method: 'POST',
      headers: {
        AppId: appId,
      },
      data: ApiParamForLogin,
      url,
    };
    setLoader(true);
    axios(options)
      .then(function (response) {
        console.log(response);
        if (response.data.code == 200) {
          //props.setFeedback('MyApartment', 'Registration Successfully!', true , nav);
        } else if (response.data.code == 401) {
          //props.setFeedback('MyApartment', 'Registration Successfully!', true , nav);
          props.navigation.navigate('verifyAccount', {email: email});
        } else {
          props.setFeedback(
            'MyApartment',
            'Incorrect username or password',
            true,
            '',
          );
        }
        setLoader(false);
        saveData(response);
        handleInput(response);
      })
      .catch(function (error) {
        setLoader(false);
        console.log(error);
        props.setFeedback('MyApartment', 'Something went Wrong', true, '');
      });
  };

  const toggleEye = () => {
    setIsPress(!isPress);
    Keyboard.dismiss();
  };
  const saveData = async (res) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(res));
      await AsyncStorage.setItem('user2', JSON.stringify(res));
      console.log(res, 'success');
    } catch (e) {
      props.setFeedback(
        'MyApartment',
        'Failed to save the data to the storage',
        true,
        '',
      );
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}>
      <FeedbackModal />
      <Image
        source={require('../images/Hotel360-assets/BG-SignIn.png')}
        style={styles.background_image}
      />

      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: 500,
            zIndex: 2,

            width: '100%',
            marginTop: 50,
            //marginTop: -80,
          }}>
          <Image
            source={require('../images/Hotel360-assets/hotel-logo.png')}
            style={{resizeMode: 'contain', width: '30%'}}
          />
          <Title style={styles.heading}>Welcome Back! Sign In</Title>
          <TextInput
            style={styles.input}
            onChangeText={(text) => onChangeText(text)}
            value={value}
            placeholder="USERNAME"
            placeholderTextColor="#9ca5b1"
            theme={{
              colors: {primary: '#D3D3D3', underlineColor: 'transparent'},
            }}
            right={
              <TextInput.Icon
                name={() => <Icon_FA name={'user'} size={15} color="#D3D3D3" />}
              />
            }
          />
          <Text
            style={{
              fontSize: 10,
              alignSelf: 'baseline',
              paddingLeft: '8%',
              color: '#9ca5b1',
            }}>
            (The Email Address used to register with Us)
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => onChangeText2(text)}
            value={value2}
            placeholder="PASSWORD"
            secureTextEntry={isPress ? false : true}
            placeholderTextColor="#9ca5b1"
            theme={{
              colors: {primary: '#D3D3D3', underlineColor: 'transparent'},
            }}
            right={
              <TextInput.Icon
                name={() => (
                  <Icon_FA_5 name={'eye'} size={15} color="#D3D3D3" />
                )}
                onPress={toggleEye}
              />
            }
          />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: 10,
              marginBottom: 15,
            }}>
            <Text style={{fontSize: 12}}>Forgetten Your </Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('ConfirmEmail')}>
              <Text
                style={{
                  color: '#D3D3D3',
                  textDecorationLine: 'underline',
                  fontSize: 12,
                }}>
                Username or Password
              </Text>
            </TouchableOpacity>
          </View>
          {/* <Button style={styles.btn} color="#fff" contentStyle={{}} onPress={() => navigation.navigate('Confirmation')}>
            SIGN IN
          </Button> */}
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              authenticate(value, value2);
            }}>
            {loader === true ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator animating={true} color="#FFF" />
              </View>
            ) : (
              <Text style={{color: '#FFF'}}>SIGN IN</Text>
            )}
          </TouchableOpacity>
          <Text style={{marginTop: 12, marginBottom: 3, fontSize: 12}}>
            Don’t Have an Account?
          </Text>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('SignUpScreen')}>
            <Text
              style={{
                color: '#D3D3D3',
                textDecorationLine: 'underline',
                fontSize: 12,
              }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  isLogged: state.LoginDetails.isLogged,
  token: state.LoginDetails.token,
});

const mapDispatchToProps = (dispatch) => ({
  signIn: (data) => {
    dispatch(signIn(data));
  },
  setFeedback: (msgTitle, msgBody, visible, mynav) => {
    const data = {
      msgTitle: msgTitle,
      msgBody: msgBody,
      visible: visible,
      mynav: mynav,
    };
    dispatch(setFeedback(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#6697D2',
    color: '#000',
    borderRadius: 10,
    width: '42%',
    height: '11%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  heading: {
    color: '#333333',
    fontSize: 18,
    marginTop: -10,
  },
  input: {
    width: '90%',
    height: '11%',
    borderColor: '#f0f3f7',
    borderWidth: 0,
    textAlign: 'left',
    marginBottom: 6,
    marginTop: 6,
    backgroundColor: '#fff',
    fontWeight: 'bold',
    borderRadius: 8,
    fontSize: 13,
    color: '#838e9d',
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
    justifyContent: 'center',
    borderColor: 'red',
  },
  background_image: {
    height: '100%',
    width: screenWidth,
    resizeMode: 'stretch',
    position: 'absolute',
    bottom: 0,
  },
});
