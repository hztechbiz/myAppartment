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

const PrivacyPolicy = (props) => {
  const [SView, setSView] = React.useState('50%');
  const [loader, setLoader] = React.useState(true);
  const [msgTitle, setMsgTitle] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [visible, setVisible] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [privacypolicy, setPrivacyPolicy] = useState('');

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    fetchPrivacyPolicy();
  }, [props, isFocused]);

  const fetchPrivacyPolicy = () => {
    const url = `${apiActiveURL}/policy`;
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
        console.log('PrivacyPolicy', res);
        if (res.data.code === 200) {
          setPrivacyPolicy(res.data.data);
          setLoader(false);
        } else {
          console.log('PrivacyPolicy', res);
          props.setFeedback('MyApartment', 'No Data Found', true, '');
          setLoader(false);
        }
      })
      .catch((error) => {
        // setMsgTitle('MyApartment');
        props.setFeedback('MyApartment', 'No Data Found', true, '');
        console.log('PrivacyPolicy', error);
      });
  };

  const showPrivacyPolicy = () => {
    return (
      <View
        style={{
          marginTop: 20,
          paddingHorizontal: '5.55%',
          height: '50%',
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={{fontSize: 14, lineHeight: 20}}>{privacypolicy}</Text>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FeedbackModal />
      <BackgroundLayout />
      <LogoBar title={props.hotelName} />
      <TitleBar title={'PRIVACY POLICY'} />
      {loader === true ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator animating={true} color="#D3D3D3" />
        </View>
      ) : (
        showPrivacyPolicy()
      )}
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  hotelName: state.HotelDetails.hotel.name,
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

export default connect(mapStateToProps, mapDispatchToProps)(PrivacyPolicy);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
