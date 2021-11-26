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
  Keyboard
} from 'react-native';
import {Button, Title, Text, TextInput, ActivityIndicator} from 'react-native-paper';
import Icon_FA from 'react-native-vector-icons/FontAwesome';
import Icon_FA_5 from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import {setFeedback, signIn} from '../actions';
import axios from 'axios';
import {apiActiveURL} from '../ApiBaseURL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FeedbackModal from '../components/FeedbackModal';
import { useIsFocused } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const statusBar = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const RenewPassword = (props) => {
  const isFocused = useIsFocused();
  const [value, onChangeText] = React.useState('');
  const [value2, onChangeText2] = React.useState('');
  const [isPress, setIsPress] = React.useState(false);
  const [isPress2, setIsPress2] = React.useState(false);

  const toggleEye = () => {
    setIsPress(!isPress);
    Keyboard.dismiss();
  }
  const toggleEye2 = () => {
    setIsPress2(!isPress2);
    Keyboard.dismiss();
  }

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    
  }, [props, isFocused]);
 
  const [loader, setLoader] = React.useState(false);
  
  const authenticate = (password, cpassword) => {
    if(password == cpassword){
      const url = `${apiActiveURL}/change_password`;
      setLoader(true);
    axios
      .post(url, {
        email: props.route.params.email,
        password: password,
        code: props.route.params.code
      })
      .then(function (response) {
        if(response.data.code == 200){
          props.setFeedback('YourHotel', 'Password Reset!', true , 'SignInScreen');
        }else{
          props.setFeedback('YourHotel', 'Something went Wrong', true , '');
        }
        setLoader(false);
      })
      .catch(function (error) {
        setLoader(false);
        console.log(error);
        props.setFeedback('YourHotel', 'Something went Wrong', true , '');
      });

    }else{
      props.setFeedback('YourHotel', "Passwords Don't Match", true , '');
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
        <FeedbackModal/>
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
          <Title style={styles.heading}>Renew Password!</Title>
          <TextInput
              style={styles.input}
              onChangeText={(text) => onChangeText(text)}
              value={value}
              secureTextEntry={isPress ? false : true}
              placeholder="PASSWORD"
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
            <TextInput
              style={styles.input}  
              onChangeText={(text) => onChangeText2(text)}
              value={value2}
              secureTextEntry={isPress2 ? false : true}
              placeholder="CONFIRM PASSWORD"
              placeholderTextColor="#9ca5b1"
              theme={{
                colors: {primary: '#D3D3D3', underlineColor: 'transparent'},
              }}
              right={
                <TextInput.Icon
                  name={() => (
                    <Icon_FA_5 name={'eye'} size={15} color="#D3D3D3" />
                  )}
                  onPress={toggleEye2}
                />
              }
            />
          
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
                <ActivityIndicator animating={true} color="#fff" />
              </View>
            ) : (
              <Text style={{color: '#fff'}}>RENEW PASSWORD</Text>
            )}
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
      mynav: mynav
    };
    dispatch(setFeedback(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(RenewPassword);

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#D3D3D3',
    color: '#fff',
    borderRadius: 10,
    width: '47%',
    height: '11%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
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
    textAlign: 'center',
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
