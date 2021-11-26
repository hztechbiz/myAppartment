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
import {setFeedback,} from '../actions';
import FeedbackModal from '../components/FeedbackModal';
import axios from 'axios';
import Icon_FA from 'react-native-vector-icons/FontAwesome';

const ContactClubLocal = (props) => {

  const [SView, setSView] = React.useState('50%');
  const [loader, setLoader] = React.useState(false);
  const [loader2, setLoader2] = React.useState(true);
  const [email, onChangeEmail] = useState('');
  const [subject, onChangeSubject] = useState('');
  const [message, onChangeMesaage] = useState('');

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      return;
    }
  }, [props, isFocused]);

  const handleContact = () => {
    setLoader(true);
    let currentdate = new Date(); 
    let datetime = currentdate.getFullYear() + "-" 
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getDate() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    const url = `${apiActiveURL}/add_contact`;
    let ApiParamForContact = {
      user_id: props.userid,
      email: email,
      subject: subject,
      message: message,
      date: datetime
    };
    const options = {
      method: 'POST',
      headers: {
        AppKey: appKey,
        Token: props.token,
        AppId: appId,
      },
      data: ApiParamForContact,
      url,
    };
    axios(options)
      .then((res) => {
        console.log(res, 'Contact');
        if (res.data.code === 200) {
          setLoader(false);
          props.setFeedback('YourHotel', 'Form Submission Successfully!!', true , '');
          onChangeEmail('');
          onChangeSubject('');
          onChangeMesaage('');
        } else {
          setLoader(false);
          props.setFeedback('YourHotel', 'No Data Found ... ', true , '');
        }
      })
      .catch((error) => {
        setLoader(false);
        props.setFeedback('YourHotel', 'No Data Found ... ', true , '');
        console.log('how', error);
      });
  };

  const showContactYourHotel = () => {
    return (
      <View
        style={{
          marginTop: 20,
          paddingHorizontal: '5.55%',
          height:'50%'
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TextInput
            autoFocus={true}
            style={[styles.input, {height: 50}]}
            onChangeText={(text) => onChangeEmail(text)}
            value={email}
            placeholder="EMAIL ADDRESS"
            placeholderTextColor="#838e9d"
            theme={{colors: {primary: '#D3D3D3', underlineColor: 'transparent'}}}
          />
          <TextInput
            style={[styles.input, {height: 50}]}
            onChangeText={(text) => onChangeSubject(text)}
            value={subject}
            placeholder="SUBJECT"
            placeholderTextColor="#838e9d"
            theme={{colors: {primary: '#D3D3D3', underlineColor: 'transparent'}}}
          />
          <TextInput
            style={[styles.input, {paddingTop: 5}]}
            onChangeText={(text) => onChangeMesaage(text)}
            value={message}
            placeholder="MESSAGE"
            placeholderTextColor="#838e9d"
            theme={{colors: {primary: '#D3D3D3', underlineColor: 'transparent'}}}
            multiline={true}
            numberOfLines={7}
            
          />
          <TouchableOpacity style={styles.btn} onPress={() => handleContact()}>
            {loader === true ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator animating={true} color="#fff" />
              </View>
            ) : (
              <Text style={{color: '#fff'}}>Send</Text>
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
      <TitleBar title={'CONTACT US'} />
      {showContactYourHotel()}
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

export default connect(mapStateToProps, mapDispatchToProps)(ContactClubLocal);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    //width: '87%',
    //height: 50,
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
    backgroundColor: '#6697D2',
    color: '#fff',
    borderRadius: 10,
    width: '42%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 15
  },
});
