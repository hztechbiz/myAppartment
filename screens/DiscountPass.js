import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  StatusBar,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import {
  ActivityIndicator,
  Modal,
  Portal,
  withTheme,
  Title,
  Text,
  Button,
} from 'react-native-paper';
import BackgroundLayout from '../components/BackgroundLayout';
import {connect} from 'react-redux';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';
import {apiActiveURL, appKey, appId} from '../ApiBaseURL';
import LogoBar from '../components/LogoBar';
import TitleBar from '../components/TitleBar';
import Tile from '../components/DiscountTile';
import {setFeedback, setServices} from '../actions';
import FeedbackModal from '../components/FeedbackModal';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const DiscountPass = (props) => {
  const [SView, setSView] = React.useState('50%');
  const isFocused = useIsFocused();
  const [msgTitle, setMsgTitle] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [couponservices, setCouponServices] = useState([]);
  const [loader, setLoader] = useState(true);
  const [loader2, setLoader2] = useState(true);
  const [servicephone, setServicePhone] = useState('');
  const [servicebookingurl, setServiceBookingURl] = useState('');
  const [visible, setVisible] = useState(false);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginHorizontal: 20,
  };

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    fetchCouponServices();
  }, [props, isFocused]);

  const fetchCouponServices = () => {
    setLoader(true);
    const url = `${apiActiveURL}/get_user_favorites/${props.userid}`;
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
        console.log('coupons_services', props.userid, res);
        if (res.data.code === 200) {
          setCouponServices(
            res.data.data.sort((a, b) =>
              a.title > b.title ? 1 : b.title > a.title ? -1 : 0,
            ),
          );
          setLoader(false);
        } else {
          setCouponServices([]);
          console.log('coupons_services', props.userid, res);
          // setMsgTitle('ClubLocal');
          // setMsgBody('No Data Found...');
          // setVisible(true);
          props.setFeedback('MyApartment', 'No Favorites Available', true, '');
          setLoader(false);
        }
      })
      .catch((error) => {
        // setMsgTitle('ClubLocal');
        // setMsgBody('No Data Found...');
        // setVisible(true);
        props.setFeedback('MyApartment', 'No Data Found...', true, '');
        setLoader(false);
        console.log(error, 'coupons_services api', url);
      });
  };

  const showCouponServices = () => {
    return (
      <View
        style={{
          height: SView,
          marginTop: 20,
          paddingLeft: '5.55%',
          paddingRight: '5.55%',
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text
            style={{
              lineHeight: 20,
              letterSpacing: 0.5,
              marginBottom: 10,
              textAlign: 'center',
            }}>
            Where the 360 Pass logo appears for a particular restaurant, that
            means the 360 Pass is available for use at that restaurant.{' '}
            <Image
              style={{width: 20, height: 20, marginHorizontal: 5}}
              source={require('../images/wi.png')}
            />{' '}
            means that the 360 Pass is available on weekends as well as
            mid-week. If{' '}
            <Image
              style={{width: 20, height: 20, marginHorizontal: 5}}
              source={require('../images/wid.png')}
            />{' '}
            appears the 360 Pass is not available on weekends - only mid-week.
          </Text>

          <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
            {couponservices.map((couponservice, index) => (
              <View key={index} style={{flexBasis: '50%', marginBottom: 8}}>
                <Tile
                  id={couponservice.id}
                  title={couponservice.title}
                  couponid={couponservice.coupon_id}
                  weekendindicator={couponservice.weekend_indicator}
                  passindicator={couponservice.passAvailablity_indicator}
                  fetchCouponServices={fetchCouponServices}
                  userID={props.userid}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FeedbackModal />

      <BackgroundLayout />
      <LogoBar
      //         title={`360
      // PASS`}
      //         color="#650d88"
      //         borderWidth={5}
      //         borderColor="#6697D2"
      />
      <TitleBar title={`MY FAVOURITES`} />
      {loader === true ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator animating={true} color="#6697D2" />
        </View>
      ) : (
        showCouponServices()
      )}
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  token: state.LoginDetails.token,
  userid: state.LoginDetails.userId,
  ServiceName: state.Services.name,
  servicedetailid: state.Services.id,
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
  setServices: (id, name) => {
    const data = {
      id: id,
      name: name,
    };
    dispatch(setServices(data));
  },
});

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(DiscountPass),
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  btnscontainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bookNowBtn: {
    borderColor: '#6697D2',
    borderWidth: 3,
    width: '50%',
    alignSelf: 'flex-end',
    marginRight: 10,
    borderRadius: 6,
    marginTop: 1,
  },
  logo_css: {
    width: screenWidth * 0.2555,
    height: screenHeight * 0.12,
    resizeMode: 'contain',
  },
});
