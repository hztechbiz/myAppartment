import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  Dimensions,
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
import Pdf from 'react-native-pdf';

const TermsConditions = (props) => {
  const [SView, setSView] = React.useState('50%');
  const [loader, setLoader] = React.useState(true);
  const [msgTitle, setMsgTitle] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [visible, setVisible] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [termsconditions, setTermsConditions] = useState('');

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    fetchTermsConditions();
  }, [props, isFocused]);

  const fetchTermsConditions = () => {
    const url = `${apiActiveURL}/term`;
    const options = {
      method: 'GET',
      headers: {
        AppKey: appKey,
        Token: props.token,
        AppId: appId,
      },
      url,
    };
    Axios(options)
      .then((res) => {
        console.log('TermsConditions', res);
        if (res.data.code === 200) {
          setTermsConditions(res.data.data);
          setLoader(false);
        } else {
          console.log('TermsConditions', res);
          props.setFeedback('MyApartment', 'No Data Found', true, '');
          setLoader(false);
        }
      })
      .catch((error) => {
        props.setFeedback('MyApartment', 'No Data Found', true, '');
        setLoader(false);
        console.log('TermsConditions', error);
      });
  };

  const showTermsConditions = () => {
    return (
      <View
        style={{
          marginTop: 20,
          paddingHorizontal: '5.55%',
          height: '50%',
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={{fontSize: 14, lineHeight: 20}}>{termsconditions}</Text>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FeedbackModal />
      <BackgroundLayout />
      <LogoBar title={props.hotelName} />
      <TitleBar title={'TERMS & CONDITIONS'} />
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
        // showTermsConditions()
        <>
          <Pdf
            source={require('./../assets/pdfs/YourHotel_Membership_Terms_and_Conditions.pdf')}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`current page: ${page}`);
            }}
            onError={(error) => {
              console.log(error);
            }}
            onPressLink={(uri) => {
              console.log(`Link presse: ${uri}`);
            }}
            // singlePage={false}
            // page={4}
            style={styles.pdf}
          />
        </>
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

export default connect(mapStateToProps, mapDispatchToProps)(TermsConditions);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pdf: {
    // flex:1,
    alignSelf: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.67,
  },
});
