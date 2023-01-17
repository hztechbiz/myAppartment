import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  StatusBar,
  ScrollView,
  Keyboard,
} from 'react-native';
import {
  ActivityIndicator,
  Modal,
  Portal,
  withTheme,
  Title,
  Text,
} from 'react-native-paper';
import BackgroundLayout from '../components/BackgroundLayout';
import {connect} from 'react-redux';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';
import {apiActiveURL, appKey, appId} from '../ApiBaseURL';
import LogoBar from '../components/LogoBar';
import TitleBar from '../components/TitleBar';
import SpecialProTile from '../components/SpecialProTile';
import {setFeedback} from '../actions';
import FeedbackModal from '../components/FeedbackModal';

const SpecialPromotions = (props) => {
  const [SView, setSView] = useState('50%');
  const [msgTitle, setMsgTitle] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [promotions, setPromotions] = useState([]);
  const [loader, setLoader] = useState(true);
  const [route, setRoute] = useState('');
  const [visible, setVisible] = useState(false);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginHorizontal: 20,
  };
  const isFocused = useIsFocused();

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    fetchPromotions();
  }, [props, isFocused]);

  const fetchPromotions = () => {
    console.log(props.userid, appKey, props.token, appId);
    let url = '';
    if (props.route.params !== undefined) {
      if (props.route.params.params.screename === 'mypass') {
        url = `${apiActiveURL}/coupons/${props.userid}?listing_type=${props.route.params.params.listingtype}`;
        setRoute('Pass Business');
      } else {
        url = `${apiActiveURL}/promotions/${props.userid}`;
        setRoute('Special Business');
      }
    } else {
      url = `${apiActiveURL}/promotions/${props.userid}`;
      setRoute('Special Business');
      console.log(props.route.params, 'undefined');
    }
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
        console.log('coupons', props.userid, res.data.data, url);
        if (res.data.code === 200) {
          setPromotions(res.data.data);
          setLoader(false);
        } else {
          console.log('coupons', props.userid, res);
          // setMsgTitle('ClubLocal');
          // setMsgBody('No Data Found...');
          // setVisible(true);
          props.setFeedback('MyApartment', 'No Coupons Available', true, '');
          setLoader(false);
        }
      })
      .catch((error) => {
        // setMsgTitle('ClubLocal');
        // setMsgBody('No Data Found...');
        props.setFeedback('MyApartment', 'No Coupons Available', true, '');
        // setVisible(true);
        setLoader(false);
        console.log(error, 'coupons api');
      });
  };

  const _keyboardDidShow = () => {
    setSView('28%');
  };

  const _keyboardDidHide = () => {
    setSView('50%');
  };

  const handleTitle = (coupondetails) => {
    let parsedcoupondetails = JSON.parse(coupondetails);
    return parsedcoupondetails.coupon_name;
  };

  const handleDiscount = (coupondetails) => {
    let parsedcoupondetails = JSON.parse(coupondetails);
    return parsedcoupondetails.coupon_percentage;
  };

  const handleminAmount = (coupondetails) => {
    let parsedcoupondetails = JSON.parse(coupondetails);
    return parsedcoupondetails.min_amount;
  };

  const handleDetails = (coupondetails) => {
    let parsedcoupondetails = JSON.parse(coupondetails);
    return parsedcoupondetails.coupon_details;
  };
  const handleTerms = (termsdetails) => {
    console.log(termsdetails, 'termsdetails');

    let parsedcoupondetails = JSON.parse(termsdetails);
    return parsedcoupondetails.terms
      ? parsedcoupondetails.terms
      : parsedcoupondetails.term_conditions;
  };
  const handleExpiry = (expiry) => {
    let parsedcoupondetails = JSON.parse(expiry);
    return parsedcoupondetails.expiry_date;
  };

  const showPromotions = () => {
    return (
      <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
        {promotions.map((promotion, index) => (
          <View key={index} style={{flexBasis: '50%', marginBottom: 8}}>
            <SpecialProTile
              id={promotion.id}
              title={handleTitle(promotion.coupon_details)}
              discount={handleDiscount(promotion.coupon_details)}
              minamount={handleminAmount(promotion.coupon_details)}
              details={handleDetails(promotion.coupon_details)}
              terms={handleTerms(promotion.coupon_details)}
              expiry={handleExpiry(promotion.coupon_details)}
              route={route}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FeedbackModal />
      <BackgroundLayout />
      <LogoBar />
      <TitleBar
        title={
          props.route.params !== undefined ? '360 Pass' : `Special Promotions`
        }
      />
      <View
        style={{
          height: SView,
          marginTop: 20,
          paddingLeft: '5.55%',
          paddingRight: '5.55%',
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {loader === true ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator animating={true} color="#D3D3D3" />
            </View>
          ) : (
            showPromotions()
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  token: state.LoginDetails.token,
  userid: state.LoginDetails.userId,
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

export default connect(mapStateToProps, mapDispatchToProps)(SpecialPromotions);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
