import AsyncStorage from '@react-native-async-storage/async-storage';
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
} from 'react-native';
import {Button, Title, Text, TextInput, ActivityIndicator} from 'react-native-paper';
import Icon_FA from 'react-native-vector-icons/FontAwesome';
import Icon_FA_5 from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import { checkIn, setFeedback } from '../actions';
import { apiActiveURL, appKey ,appId} from '../ApiBaseURL';
import FeedbackModal from '../components/FeedbackModal';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const statusBar = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const Confirmation = (props) => {
  
  
  //'SimGi-8igzd-pwIV4-oYpaU-XUpW3'
  const [loader, setLoader] = React.useState(false);
  const [value3, onChangeText3] = React.useState('');
  const [roomNo, setRoomNo] = useState('');
  // Mobile Apps-ixCb6
  const isFocused = useIsFocused();
  
  const handleInput = (data) => props.checkIn(data);

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    readData();
    readDataPrev();
  }, [props, isFocused]);


  const readData = async () => {
    try {
      const loggedInUser = await AsyncStorage.getItem('hotel');
      let parsed = JSON.parse(loggedInUser);
      if (parsed !== null) {
        authenticate(parsed);
        console.log(parsed , 'parsed try');
      }
    } catch (e) {
      const loggedInUser = await AsyncStorage.getItem('hotel');
      console.log(loggedInUser, 'loggedInUser catch');
    }
  };
  
  const readDataPrev = async () => {
    try {
      const loggedInUser = await AsyncStorage.getItem('photel');
      let parsed = JSON.parse(loggedInUser);
      if (parsed !== null) {
        onChangeText3(parsed);
        console.log(parsed , 'parsed try');
      }
      const loggedInUser2 = await AsyncStorage.getItem('proomNo');
      let parsed2 = JSON.parse(loggedInUser2);
      if (parsed2 !== null) {
        setRoomNo(parsed2);
        console.log(parsed2 , 'parsed try');
      }
    } catch (e) {
      const loggedInUser = await AsyncStorage.getItem('hotel');
      console.log(loggedInUser, 'loggedInUser catch');
    }
  };
  
  const authenticate = (hotel_key) => {
    const url = `${apiActiveURL}/get_hotel_id?hotel_key=${hotel_key}`;
    setLoader(true);
    axios.get(url).then((res) => {
      console.log(res.data , url);
      if(res.data.code == 200){
        AddRoomNo();
        AddRoomLog(res.data.data.hotel_id);
        saveData(hotel_key);
        get_hotel(res.data.data.hotel_id);
      }else{
        props.setFeedback('MyAppartment', 'Incorrect Key', true , '')
      }
      setLoader(false);
    })
    .catch((error) => {
      console.log(error, 'rest api');
      props.setFeedback('MyAppartment', 'Something Went with appartment Key Wrong...', true , '')
      setLoader(false);
    });
  }

  const get_hotel = (hotel_id) => {
    const url = `${apiActiveURL}/hotel/${hotel_id}`;
    setLoader(true);
    const options = {
      method: 'GET',
      headers: {
        AppKey: appKey,
        Token: props.token,
        AppId: appId
      },
      url,
    };
    axios(options).then((res) => {
      if(Object.values(res.data.data).length > 0){
        console.log(res.data.data);
        handleInput(res.data.data);
        setLoader(true);
      }else{
        //console.log(Object.values(res.data.data).length, 'categories');
        props.setFeedback('YourHotel', 'No Data', true , '')
        setLoader(false);
      }
    })
    .catch((error) => {
      console.log(error, 'rest api');
      props.setFeedback('YourHotel', 'Something Went Wrong...', true , '');
      setLoader(false);
    });
  };

  const saveData = async (res) => {
    try {
      await AsyncStorage.setItem('hotel', JSON.stringify(res));
      await AsyncStorage.setItem('photel', JSON.stringify(res));
      await AsyncStorage.setItem('roomNo', JSON.stringify(roomNo));
      await AsyncStorage.setItem('proomNo', JSON.stringify(roomNo));
      console.log(res, 'success');
    } catch (e) {
      props.setFeedback('YourHotel', 'Failed to save the data to the storage', true , '')
      
    }
  }

  const AddRoomNo = async () => {
    const url = `${apiActiveURL}/add_room_no`;
    let ApiParamForRoomNo = {
      user_id: props.userid,
      room_id: roomNo,
    };
    const options = {
      method: 'POST',
      data: ApiParamForRoomNo,
      url,
    };
    await axios(options)
      .then((res) => {
        console.log(res, 'roomNo');
        //props.setFeedback('YourHotel', 'Registration Successfully!', true , nav);
        //props.navigation.navigate('ConfirmCode', { email: email });
        if(res.data.code == 200){
          // props.setFeedback('YourHotel', 'A Customer Support Representative will be in touch with you as soon as possible during business hours.', true , '');
          // props.navigation.navigate('SignInScreen');
          //console.log('You were right');
        }else{
          // props.setFeedback('YourHotel', res.data.message, true , '');
        }
        
        // setLoader(false);
      })
      .catch((error) => {
        //props.setFeedback('YourHotel', 'Something Went Wrong!', true , '');
        console.log(error);
        // setLoader(false);
      });
  }

  const AddRoomLog = async (hotel_id) => {
    const url = `${apiActiveURL}/add_room_logs`;
    let ApiParamForRoomNo = {
      user_id: props.userid,
      hotel_id: hotel_id,
      room_number: roomNo,
    };
    const options = {
      method: 'POST',
      data: ApiParamForRoomNo,
      url,
    };
    await axios(options)
      .then((res) => {
        console.log(res, 'roomNo');
        //props.setFeedback('YourHotel', 'Registration Successfully!', true , nav);
        //props.navigation.navigate('ConfirmCode', { email: email });
        if(res.data.code == 200){
          // props.setFeedback('YourHotel', 'A Customer Support Representative will be in touch with you as soon as possible during business hours.', true , '');
          // props.navigation.navigate('SignInScreen');
          //console.log('You were right');
        }else{
          // props.setFeedback('YourHotel', res.data.message, true , '');
        }
        
        // setLoader(false);
      })
      .catch((error) => {
        //props.setFeedback('YourHotel', 'Something Went Wrong!', true , '');
        console.log(error);
        // setLoader(false);
      });
  }

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
      <View style={{height: '70%',  justifyContent: 'center'}}>
      <ScrollView >
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
          <Text style={{textAlign: 'center', color: '#6a6a6b', paddingHorizontal: 40, fontSize: 11}}>Add the Appartment Code from your Booking Confirmation or Welcome Letter. If you know your Apartment/Room number please enter it where indicated.</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'flex-start'
          }}>
          <View style={{
            // backgroundColor: 'red',
            flexDirection: 'column',
            width: '45%',
            marginRight: 3,
            marginVertical: 14
          }}>
          <TextInput
            style={[styles.input, { width: '100%', marginVertical: 0}]}
            onChangeText={(text) => setRoomNo(text)}
            value={roomNo}
            placeholder={`Apartment/
Room Number`}
            placeholderTextColor="#9ca5b1"
            theme={{colors: {primary: '#D3D3D3', underlineColor: 'transparent'}}}
            // right={
            //   <TextInput.Icon
            //     name={() => <Icon_FA name={'check'} size={15} color="#D3D3D3" />}
            //   />
            // }
          />
          <Text style={{fontSize: 10, alignSelf: 'center', color: '#9ca5b1'}}>*If unknown enter '999'</Text>
          </View>
          <TextInput
            style={[styles.input , { marginLeft: 3 }]}
            onChangeText={(text) => onChangeText3(text)}
            value={value3}
            placeholder={`APPARTMENT
CODE`}
            placeholderTextColor="#9ca5b1"
            theme={{colors: {primary: '#D3D3D3', underlineColor: 'transparent'}}}
            // right={
            //   <TextInput.Icon
            //     name={() => <Icon_FA name={'check'} size={15} color="#D3D3D3" />}
            //   />
            // }
          />
          </View>
          
          {/* <Button style={styles.btn} color="#fff" contentStyle={{}} onPress={() => props.navigation.navigate('Username')}>
            GO TO HOTEL
          </Button> */}
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              if(value3 && roomNo){
                authenticate(value3);
              }else{
                props.setFeedback('YourHotel', 'All Fields are Required.', true , '')
              }
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
              <Text style={{color: '#FFF'}}>GO TO APPARTMENT</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity disabled={true} style={styles.btn2} uppercase={false} color="#a1a3a6" contentStyle={{}} onPress={() => {}}>
            <Text style={{fontSize: 12, color:'#717273', textAlign: 'center'}}>{"If you don't have a Appartment Code, \nPlease contact Reception."}</Text>
          </TouchableOpacity>
          
        </View>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  isLogged: state.LoginDetails.isLogged,
  token: state.LoginDetails.token,
  area: state.HotelDetails.hotel.area,
  userid: state.LoginDetails.userId,
});

const mapDispatchToProps = (dispatch) => ({
  checkIn: (data) => {
    dispatch(checkIn(data));
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

export default connect(mapStateToProps, mapDispatchToProps)(Confirmation);

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#6697D2',
    color: '#fff',
    borderRadius: 10,
    width: '50%',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5
  },
  btn2: {
    backgroundColor: '#e2e6ec',
    color: '#a1a3a6',
    borderRadius: 10,
    width: '70%',
    height: 62,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    fontSize: 11
  },

  heading: {
    color: '#333333',
    fontSize: 24,
    marginTop: -4,
  },
  input: {
    width: '45%',
    height: 50,
    // borderColor: '#f0f3f7',
    textAlign: 'center',
    marginVertical: 14,
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
