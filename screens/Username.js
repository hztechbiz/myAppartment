import {useIsFocused} from '@react-navigation/native';
import Axios from 'axios';
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
import {setFeedback} from '../actions';
import {apiActiveURL} from '../ApiBaseURL';
import FeedbackModal from '../components/FeedbackModal';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const statusBar = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const Username = (props) => {
  const isFocused = useIsFocused();
  const [value, onChangeText] = React.useState('');
  const [value2, onChangeText2] = React.useState('');
  const [value3, onChangeText3] = React.useState('');
  const [value4, onChangeText4] = React.useState('');
  console.log(props.route.params.fName);

  useEffect(() => {
    if (!isFocused) {
      return;
    }
  }, [props, isFocused]);

  const [loader, setLoader] = React.useState(false);
  const [loader2, setLoader2] = React.useState(false);

  const url = `${apiActiveURL}/registration`;
  const authenticate = (username, nav) => {
    if (nav == 'SignUpScreen') {
      setLoader(true);
    } else {
      setLoader2(true);
    }

    Axios.post(url, {
      email: props.route.params.email,
      password: props.route.params.password,
      firstname: props.route.params.fName,
      lastname: props.route.params.lName,
      username: username,
      phone: props.route.params.phone,
    })
      .then(function (response) {
        console.log(response);
        if (nav == 'SignUpScreen') {
          setLoader(false);
        } else {
          setLoader2(false);
        }

        if (response.data.status) {
          props.setFeedback(
            'MyApartment',
            'Registration Successful!',
            true,
            nav,
          );
        } else {
          props.setFeedback('MyApartment', response.data.message, true, '');
        }

        //handleInput(response);
      })
      .catch(function (error) {
        if (nav == 'SignUpScreen') {
          props.setFeedback('MyApartment', 'Something went wrong...', true, '');
          setLoader(false);
        } else {
          props.setFeedback('MyApartment', 'Something went wrong...', true, '');
          setLoader2(false);
        }
        console.log(error);
      });
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
      <View style={{height: '70%', justifyContent: 'center'}}>
        <ScrollView>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
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
            <Text
              style={{
                textAlign: 'center',
                color: '#6a6a6b',
                paddingHorizontal: 40,
                fontSize: 11,
              }}>
              Lorem ipsum dolor amet consectetur adipiscing elit. Cras eget
              sodales odio.
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => onChangeText3(text)}
              value={value3}
              placeholder="YOUR USER NAME IS:"
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

            {/* <Button style={styles.btn} color="#fff" contentStyle={{}} onPress={() => navigation.navigate('Username')}>
            SIGN IN
          </Button> */}
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                authenticate(value3, 'SignUpScreen');
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
                <Text style={{color: '#fff'}}>SIGN IN</Text>
              )}
            </TouchableOpacity>
            {/* <Button style={styles.btn2} color="#a1a3a6" contentStyle={{}} onPress={() => navigation.navigate('Confirmation')}>
            LATER
          </Button> */}
            <TouchableOpacity
              style={styles.btn2}
              onPress={() => {
                authenticate(value3, 'Account');
              }}>
              {loader2 === true ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator animating={true} color="#fff" />
                </View>
              ) : (
                <Text style={{color: '#a1a3a6'}}>LATER</Text>
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
      mynav: mynav,
    };
    dispatch(setFeedback(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Username);

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#D3D3D3',
    color: '#fff',
    borderRadius: 10,
    width: '53%',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  btn2: {
    backgroundColor: '#e2e6ec',
    color: '#a1a3a6',
    borderRadius: 10,
    width: '40%',
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  heading: {
    color: '#333333',
    fontSize: 24,
    marginTop: -4,
  },
  input: {
    width: '87%',
    height: 50,
    // borderColor: '#f0f3f7',
    textAlign: 'center',
    marginVertical: 11,
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
