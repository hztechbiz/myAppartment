import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
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
import {Button, Title, Text, TextInput, ActivityIndicator, Portal, Modal} from 'react-native-paper';
import Icon_FA from 'react-native-vector-icons/FontAwesome';
import Icon_FA_5 from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import { setFeedback } from '../actions';
import { apiActiveURL, appId } from '../ApiBaseURL';
import FeedbackModal from '../components/FeedbackModal';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const statusBar = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const SignUpScreen = (props) => {
  const isFocused = useIsFocused();
  const [SView, setSView] = useState('85%');
  const [value, onChangeText] = React.useState('');
  const [value2, onChangeText2] = React.useState('');
  const [value3, onChangeText3] = React.useState('');
  const [value4, onChangeText4] = React.useState('');
  const [value5, onChangeText5] = React.useState('');
  const [mobile, onChangeMobile] = useState('');
  const [loader, setLoader] = React.useState(false);
  const [visiblefeedback, setVisibleFeedback] = useState(false);
  const [isPress, setIsPress] = React.useState(false);
  const [isPress2, setIsPress2] = React.useState(false);
  const hideModalFeedback = () => setVisibleFeedback(false);

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

  useEffect(() => {
     Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
     Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
 
     // cleanup function
     return () => {
       Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
       Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
     };
   }, []);

   const _keyboardDidShow = () => {
    setSView('50%');
  };

  const _keyboardDidHide = () => {
    setSView('85%');
  };

  const verificationText = (
    <>
      <Text style={{textAlign: 'center'}}>Thank you for registering. We have sent an email to your email address requiring you to confirm your registration. Please open the email and click 'Verify'. As soon as you verify your email address you will be able to enjoy all the benefits of our App.{`\n`}</Text>
      <Text style={{textAlign: 'center'}}>If you do not see the Verification Email in your Inbox after a couple of minutes, <Text style={{textDecorationLine: 'underline'}}>Please check your Junk or Spam Folder</Text></Text>
    </>
  )

  const feedbackContainerStyle = {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginHorizontal: 20,
  };

  const verificationModal = () => {
    return (
      <>
       <Portal>
        <Modal
          visible={visiblefeedback}
          onDismiss={hideModalFeedback}
          contentContainerStyle={feedbackContainerStyle}>
          <Title
            style={{
              fontSize: 18,
              textAlign: 'center',
              color: '#6697D2',
              paddingBottom: 15,
            }}>
            Please verify your Email
          </Title>
          {verificationText}
        </Modal>
      </Portal>
      </>
    )
  }


  const url = `${apiActiveURL}/registration_new`;
  const authenticate = () => {
    let ApiParamForRegistration = {
      email: value,
      password: value2,
      firstname: value3,
      lastname: value4,
      username: value,
      phone: mobile,
    };
    let options = {
      method: 'POST',
      headers: {
        AppId: appId,
      },
      data: ApiParamForRegistration,
      url,
    };
    axios(options)
      .then(function (response) {
        console.log(response);
        
        if (response.data.status) {
          // props.setFeedback('Please verify your Email', {}, true , 'SignInScreen');
          setVisibleFeedback(true);
          props.navigation.navigate('SignInScreen')
        }else{
          props.setFeedback('YourHotel', response.data.message, true , '');
        }
        setLoader(false);
        //handleInput(response);
      })
      .catch(function (error) {
        
          props.setFeedback('YourHotel', 'Something went wrong...', true , '');
          setLoader(false);
        
        console.log(error);
      });
  }; 


  const pCheck = () => {
    if (value2 == value5) {
      setLoader(true);
      authenticate();
    } else {
      setLoader(false);
      props.setFeedback('YourHotel', 'Confirm Password Incorrect', true , '');
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: 'column',
        // justifyContent: 'center',
        backgroundColor: '#fff',
      }}>
        <FeedbackModal/>
        {verificationModal()}
      <Image
        source={require('../images/Hotel360-assets/BG-SignIn.png')}
        style={styles.background_image}
      />
      <View style={{height: SView, justifyContent: 'flex-start'}}>
        <ScrollView>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-start',
              //minHeight: 550,
              zIndex: 2,

              width: '100%',
              //marginTop: 10,
              //borderColor: '#f00', borderWidth: 1,
              //marginTop: -80,
            }}>
            <Image
              source={require('../images/Hotel360-assets/hotel-logo.png')}
              style={{resizeMode: 'contain', width: '30%'}}
            />
            <Title style={styles.heading}>Welcome To My Appartment</Title>
            <Text
              style={{
                textAlign: 'center',
                color: '#6a6a6b',
                paddingHorizontal: 40,
                fontSize: 11,
              }}>
              
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => onChangeText3(text)}
              value={value3}
              placeholder="FIRST NAME"
              placeholderTextColor="#9ca5b1"
              theme={{
                colors: {primary: '#D3D3D3', underlineColor: 'transparent'},
              }}
              right={
                <TextInput.Icon
                  name={() => (
                    <Icon_FA name={'user'} size={15} color="#D3D3D3" />
                  )}
                />
              }
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) => onChangeText4(text)}
              value={value4}
              placeholder="LAST NAME"
              placeholderTextColor="#9ca5b1"
              theme={{
                colors: {primary: '#D3D3D3', underlineColor: 'transparent'},
              }}
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) => onChangeText(text)}
              value={value}
              placeholder="EMAIL ADDRESS"
              placeholderTextColor="#9ca5b1"
              theme={{
                colors: {primary: '#D3D3D3', underlineColor: 'transparent'},
              }}
              right={
                <TextInput.Icon
                  name={() => (
                    <Icon_FA name={'envelope'} size={15} color="#D3D3D3" />
                  )}
                />
              }
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) => onChangeMobile(text)}
              keyboardType='numeric'
              value={mobile}
              placeholder="MOBILE NUMBER"
              placeholderTextColor="#9ca5b1"
              theme={{
                colors: {primary: '#D3D3D3', underlineColor: 'transparent'},
              }}
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) => onChangeText2(text)}
              value={value2}
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
              onChangeText={(text) => onChangeText5(text)}
              value={value5}
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
            <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              pCheck();
              
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
              <Text style={{color: '#FFF'}}>CREATE ACCOUNT</Text>
            )}
          </TouchableOpacity>

            
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  // isLogged: state.LoginDetails.isLogged,
  // token: state.LoginDetails.token,
});

const mapDispatchToProps = (dispatch) => ({
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

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen);

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#6697D2',
    color: '#fff',
    borderRadius: 10,
    width: '57%',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  heading: {
    color: '#333333',
    fontSize: 18,
    marginTop: -4,
  },
  input: {
    width: '87%',
    height: 55,
    // borderColor: '#f0f3f7',
    textAlign: 'left',
    marginVertical: 4,
    backgroundColor: '#fff',
    fontWeight: 'bold',
    borderRadius: 8,
    fontSize: 13,
    color: '#838e9d',
    fontFamily: 'Arial',
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
