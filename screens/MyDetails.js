import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Dialog,
  Modal,
  Portal,
  TextInput,
  Title,
} from 'react-native-paper';
import BackgroundLayout from '../components/BackgroundLayout';
import LogoBar from '../components/LogoBar';
import TitleBar from '../components/TitleBar';
import {connect} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {apiActiveURL, appKey, appId} from '../ApiBaseURL';
import Axios from 'axios';
import Icon_FA_5 from 'react-native-vector-icons/FontAwesome5';
import {setFeedback} from '../actions';
import FeedbackModal from '../components/FeedbackModal';
import axios from 'axios';
import Icon_FA from 'react-native-vector-icons/FontAwesome';

const MyDetails = (props) => {
  const [SView, setSView] = React.useState('57%');
  const [loader, setLoader] = React.useState(true);
  const [loader2, setLoader2] = React.useState(true);
  const [loader3, setLoader3] = React.useState(true);
  const [msgTitle, setMsgTitle] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [value, onChangeText] = React.useState('');
  const [value2, onChangeText2] = React.useState('');
  const [value3, onChangeText3] = React.useState('');
  const [userDetails, setUserDetails] = useState('');

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    fetchUser();
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
    setSView('30%');
  };

  const _keyboardDidHide = () => {
    setSView('57%');
  };

  const [isPress, setIsPress] = React.useState(false);
  const [isPress2, setIsPress2] = React.useState(false);

  const toggleEye = () => {
    setIsPress(!isPress);
    Keyboard.dismiss();
  };
  const toggleEye2 = () => {
    setIsPress2(!isPress2);
    Keyboard.dismiss();
  };

  const fetchUser = () => {
    const url = `${apiActiveURL}/get_user/${props.userid}`;
    const options = {
      method: 'GET',
      headers: {
        AppKey: appKey,
        Token: props.token,
        AppId: appId,
      },
      url,
    };
    axios(options)
      .then((res) => {
        console.log('userId', res);
        if (res.data.code === 200) {
          //setUserDetails(res.data.data);
          if (res.data.data.username) {
            onChangeText(res.data.data.username);
          }
          if (res.data.data.email) {
            onChangeText3(res.data.data.email);
          }
          if (res.data.data.phone) {
            onChangeText2(res.data.data.phone);
          }
          setLoader2(false);
        } else {
          console.log('userId', res);
          props.setFeedback('MyApartment', 'No Data Found', true, '');
          setLoader2(false);
        }
      })
      .catch((error) => {
        props.setFeedback('MyApartment', 'No Data Found', true, '');
        console.log('userId', error);
        setLoader2(false);
      });
  };

  const update = (email, phone) => {
    setLoader(false);
    const url = `${apiActiveURL}/update_user/${props.userid}`;
    let ApiParamForUpdateUser = {
      username: value,
      email: email,
      phone: phone,
    };
    const options = {
      method: 'POST',
      headers: {
        AppKey: appKey,
        Token: props.token,
        AppId: appId,
      },
      data: ApiParamForUpdateUser,
      url,
    };
    Axios(options)
      .then((res) => {
        console.log(res, 'user');
        if (res.data.code === 200) {
          props.setFeedback(
            'MyApartment',
            'Form Submitted Successfully',
            true,
            '',
          );
        } else {
          console.log(res, 'user else');

          props.setFeedback('MyApartment', res.data.message, true, '');
        }
        setLoader(true);
      })
      .catch((error) => {
        props.setFeedback('MyApartment', 'Something Went Wrong', true, '');
        console.log(error, 'user');
        setLoader(true);
      });
  };

  const changePassword = (password, cpassword) => {
    setLoader3(false);
    const url = `${apiActiveURL}/forgotuserpassword/${props.userid}`;
    if (password == cpassword) {
      let ApiParamForUpdateUser = {
        password: password,
      };
      const options = {
        method: 'POST',
        headers: {
          AppKey: appKey,
          Token: props.token,
          AppId: appId,
        },
        data: ApiParamForUpdateUser,
        url,
      };
      Axios(options)
        .then((res) => {
          console.log(res, 'user');
          if (res.data.code === 200) {
            props.setFeedback(
              'MyApartment',
              'Password Reset SuccessFul!',
              true,
              '',
            );
          } else {
            console.log(res, 'user else');

            props.setFeedback('MyApartment', res.data.message, true, '');
          }
          setLoader3(true);
        })
        .catch((error) => {
          props.setFeedback('MyApartment', 'Something Went Wrong', true, '');
          console.log(error, 'user');
          setLoader3(true);
        });
    } else {
      props.setFeedback('MyApartment', 'Confirm Password Incorrect!', true, '');
    }
  };

  const showDetails = () => {
    return (
      <View
        style={{
          marginTop: 20,
          paddingHorizontal: '5.55%',
          height: SView,
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={{alignSelf: 'flex-start'}}>Username:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => onChangeText(text)}
            value={value}
            disabled={true}
            placeholder="YOUR USER NAME IS:"
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
          <Text style={{alignSelf: 'flex-start'}}>Email:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => onChangeText3(text)}
            value={value3}
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
          <Text style={{alignSelf: 'flex-start'}}>Phone Number:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => onChangeText2(text)}
            value={value2}
            keyboardType="numeric"
            placeholder="PHONE NUMBER"
            placeholderTextColor="#9ca5b1"
            theme={{
              colors: {primary: '#D3D3D3', underlineColor: 'transparent'},
            }}
          />
          <Text
            style={{
              textAlign: 'center',
              fontSize: 10,
              paddingHorizontal: 40,
              marginTop: 5,
              color: 'grey',
            }}>
            DISCLAIMER: Email and Phone Number CAN'T be changed at the same
            time.
          </Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              update(value3, value2);
            }}>
            {loader === false ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator animating={true} color="#fff" />
              </View>
            ) : (
              <Text style={{color: '#fff'}}>UPDATE</Text>
            )}
          </TouchableOpacity>
          <Text style={{alignSelf: 'flex-start', paddingTop: 10}}>
            Change Password:
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setPassword(text)}
            value={password}
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
            onChangeText={(text) => setCPassword(text)}
            value={cpassword}
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
            style={[styles.btn, {width: '55%'}]}
            onPress={() => {
              changePassword(password, cpassword);
            }}>
            {loader3 === false ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator animating={true} color="#fff" />
              </View>
            ) : (
              <Text style={{color: '#fff'}}>CHANGE PASSWORD</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FeedbackModal />
      <BackgroundLayout />
      <LogoBar title={props.hotelName} />
      <TitleBar title={'MY DETAILS'} />
      {loader2 === true ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator animating={true} color="#D3D3D3" />
        </View>
      ) : (
        showDetails()
      )}
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  hotelName: state.HotelDetails.hotel.name,
  userid: state.LoginDetails.userId,
  // hotelId: state.HotelDetails.hotel.id,
  // listingType: state.ListingType,
  token: state.LoginDetails.token,
  CatId: state.WhatsOn.id,
  CatName: state.WhatsOn.name,
  ChildCatId: state.ChildWhatsOn.id,
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

export default connect(mapStateToProps, mapDispatchToProps)(MyDetails);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    //width: '87%',
    height: 50,
    // borderColor: '#f0f3f7',
    textAlign: 'center',
    marginTop: 11,
    marginBottom: 15,
    backgroundColor: '#fafafa',
    fontWeight: 'bold',
    borderRadius: 8,
    fontSize: 13,
    color: '#838e9d',
  },
  btn: {
    backgroundColor: '#D3D3D3',
    color: '#fff',
    borderRadius: 10,
    width: '42%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 15,
  },
});
