import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  Keyboard,
  Linking,
} from 'react-native';
import BackgroundLayout from '../components/BackgroundLayout';
import LogoBar from '../components/LogoBar';
import TitleBar from '../components/TitleBar';
import BigTile from '../components/BigTile';
import {
  ActivityIndicator,
  Button,
  Modal,
  Portal,
  Provider,
} from 'react-native-paper';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {connect} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {apiActiveURL, appId, appKey} from '../ApiBaseURL';
import Axios from 'axios';
import HTML from 'react-native-render-html';
import {setFeedback} from '../actions';
import FeedbackModal from '../components/FeedbackModal';

const screenWidth = Dimensions.get('window').width;

const Business = (props) => {
  const [SView, setSView] = React.useState('50%');

  console.log(
    props.route.params.couponStatus,
    'props.route.params.couponStatus',
  );

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
    setSView('28%');
  };

  const _keyboardDidHide = () => {
    setSView('50%');
  };

  const [visible, setVisible] = React.useState(false);
  const [servicedetail, setServiceDetail] = useState([]);
  const [loader, setLoader] = useState(true);
  const [coupondetails, setCouponDetails] = useState({});
  const [servicelatitude, setServiceLatitude] = useState('');
  const [servicelongitude, setServiceLongitude] = useState('');
  const [servicephone, setServicePhone] = useState('');
  const [servicebookingurl, setServiceBookingURl] = useState('');
  const [promodetails, setPromoDetails] = useState();
  const [confirmationcode, setConfirmationCode] = useState('');
  const [address, setAddress] = useState('');
  const [specialCoupon, setSpecialCoupon] = useState('0');
  const [featuredpromotion, setFeaturedPromotion] = useState(
    require('../images/Hotel360-assets/promotion-placeholder-2.png'),
  );

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    setServiceDetail([]);
    setLoader(true);
    console.log(props.route.params.promoid);
    fetchServiceDetail(props.route.params.promoid);
  }, [props, isFocused]);

  const fetchServiceDetail = (promoid) => {
    const url = `${apiActiveURL}/service/${promoid}`;
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
        console.log(res.data.data, 'service');
        setPromoDetails(res.data.data.promotions);
        setServiceDetail(res.data.data.service);
        if (Object.values(res.data.data).length > 0) {
          //Special Promotion Coupon Worl
          var show = res.data.data.service.meta.find(
            (o) => o.meta_key === 'show_coupon',
          );
          console.log(show, 'show');

          //Special Promotion Coupon expiry

          if (show != undefined) {
            console.log(detail, 'detail');
            setSpecialCoupon(show.meta_value);
            // setWebsiteUrl(web_url.meta_value);
            // console.log(web_url, 'web_url')
          }

          var exp = res.data.data.service.meta.find(
            (o) => o.meta_key === 'coupon_expiry',
          );

          if (exp != undefined) {
            console.log(exp, 'exp');
            var expValue = exp.meta_value;
            // setWebsiteUrl(web_url.meta_value);
            // console.log(web_url, 'web_url')
          }
          //Special Promotion Coupon detail

          var detail = res.data.data.service.meta.find(
            (o) => o.meta_key === 'coupon_details',
          );
          if (detail != undefined) {
            console.log(detail, 'detail');
            var detailValue = detail.meta_value;

            // setWebsiteUrl(web_url.meta_value);
            // console.log(web_url, 'web_url')
          }

          //Special Promotion Coupon Description

          var short_description = res.data.data.service.meta.find(
            (o) => o.meta_key === 'coupon_short_description',
          );
          if (short_description != undefined) {
            console.log(
              short_description,
              'coupon_short_description----------------',
            );
            var shortDescription = short_description.meta_value;

            // setWebsiteUrl(web_url.meta_value);
            // console.log(web_url, 'web_url')
          }

          //Special Promotion Coupon terms

          var terms = res.data.data.service.meta.find(
            (o) => o.meta_key === 'coupon_terms',
          );
          if (terms != undefined) {
            console.log(terms, 'terms');
            var termsValue = terms.meta_value;
            // setWebsiteUrl(web_url.meta_value);
            // console.log(web_url, 'web_url')
          }

          //coupon work
          let objCoupon = res.data.data.service.meta.find(
            (o) => o.meta_key === 'coupon',
          );
          if (objCoupon?.meta_value) {
            let parseCoupon = JSON.parse(objCoupon?.meta_value);
            let today = new Date();
            let day = today.getDay();
            let daylist = [
              'sunday',
              'monday',
              'tuesday',
              'wednesday',
              'thursday',
              'friday',
              'saturday',
            ];
            if (parseCoupon.hasOwnProperty(daylist[day])) {
              let couponpercentage = parseCoupon[daylist[day]];
              setCouponDetails({
                coupon_name: parseCoupon.coupon_name,
                coupon_details: props.route.params.coupon_details
                  ? props.route.params.coupon_details
                  : detailValue,
                coupon_description: props.route.params.coupon_details
                  ? props.route.params.tagline
                  : shortDescription,
                terms: props.route.params.term_conditions
                  ? props.route.params.term_conditions
                  : termsValue,
                expiry_date: props.route.params.expiry_date
                  ? props.route.params.expiry_date
                  : expValue,
                coupon_percentage: couponpercentage,
              });
            }
          }

          //service_address work
          let serviceaddress = res.data.data.service.meta.find(
            (o) => o.meta_key === 'service_address',
          );
          setAddress(serviceaddress?.meta_value);

          //latlong work
          let servicelatitude = res.data.data.service.meta.find(
            (o) => o.meta_key === 'service_latitude',
          );
          if (servicelatitude != undefined) {
            setServiceLatitude(servicelatitude.meta_value);
          } else {
            setServiceLatitude('0.000000');
          }

          let servicelongitude = res.data.data.service.meta.find(
            (o) => o.meta_key === 'service_longitude',
          );
          if (servicelongitude != undefined) {
            setServiceLongitude(servicelongitude.meta_value);
          } else {
            setServiceLongitude('0.000000');
          }

          //phone work
          let servicephone = res.data.data.service.meta.find(
            (o) => o.meta_key === 'phone',
          );
          if (servicephone != undefined) {
            setServicePhone(servicephone.meta_value);
          }

          //booking url work
          let servicebookingurl = res.data.data.service.meta.find(
            (o) => o.meta_key === 'booking_url',
          );
          if (servicebookingurl != undefined) {
            setServiceBookingURl(servicebookingurl.meta_value);
          }

          //featured_promotion work
          let featuredImage = res.data.data.service.meta.find(
            (o) => o.meta_key === 'image',
          );
          console.log(featuredImage, 'featuredImage');
          if (featuredImage !== undefined) {
            setFeaturedPromotion({uri: featuredImage.meta_value});
          } else {
            setFeaturedPromotion(
              require('../images/Hotel360-assets/promotion-placeholder-2.png'),
            );
          }

          setConfirmationCode(generateConfirmationCode(6));

          setLoader(false);
        } else {
          // setMsgTitle('ClubLocal');
          props.setFeedback('MyApartment', 'No Data Found...', true, '');
          // setVisible(true);
          setLoader(false);
        }
      })
      .catch((e) => {
        // setMsgTitle('ClubLocal');

        props.setFeedback('MyApartment', 'No Data Found...', true, '');
        // setVisible(true);
        setLoader(false);
        console.log(e, 'service api');
      });
  };

  const generateConfirmationCode = (length) => {
    let confirmationcode = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      confirmationcode += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return confirmationcode;
  };

  const handleRequestPass = () => {
    console.log(
      props.route.params.promoid,
      props.userid,
      coupondetails,
      confirmationcode,
      props.route.params.screen,
    );
    var stringifycoupondetails = JSON.stringify(coupondetails);
    const url = `${apiActiveURL}/promotion/add`;
    let ApiParamForAddCoupon = {
      service_id:
        props.route.params.screen == 'promotion'
          ? props.route.params.promoid
          : props.ServiceId,
      user_id: props.userid,
      details: stringifycoupondetails,
      promotion_id: props.route.params.promoid,
      type: 2,
    };
    console.log(ApiParamForAddCoupon);
    const options = {
      method: 'POST',
      headers: {
        AppKey: appKey,
        Token: props.token,
        AppId: appId,
      },
      data: ApiParamForAddCoupon,
      url,
    };
    Axios(options)
      .then((res) => {
        console.log(res, 'addcoupon');
        if (res.data.code === 200) {
          // setMsgTitle('ClubLocal');
          if (res.data.hasOwnProperty('data')) {
            props.setFeedback(
              'MyApartment',
              'Promotion added successfully',
              true,
              '',
            );
            props.navigation.navigate('MyCoupons', {
              screen: 'Special Promotions',
            });
          } else {
            // props.setFeedback(
            //   'MyApartment',
            //   'Promotion already exists',
            //   true,
            //   '',
            // );
            props.navigation.navigate('MyCoupons', {
              screen: 'Special Promotions',
            });
          }

          // setVisible(true);
        } else {
          console.log(res, 'addcoupon else');
          // setMsgTitle('ClubLocal');
          props.setFeedback('MyApartment', 'Something Went Wrong...', true, '');
          // setVisible(true);
        }
      })
      .catch((error) => {
        // setMsgTitle('ClubLocal');
        props.setFeedback('MyApartment', 'Something Went Wrong...', true, '');
        // setVisible(true);
        console.log(error, 'addcoupon');
      });
  };

  const handleShowPhoneDial = () => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${servicephone}`;
    } else {
      phoneNumber = `telprompt:${servicephone}`;
    }
    if (servicephone) {
      Linking.openURL(phoneNumber);
    } else {
      setVisible(false);
      props.setFeedback('MyApartment', 'Not Available', true, '');
    }
  };

  const handleShowBookOnline = () => {
    if (servicebookingurl) {
      Linking.openURL(servicebookingurl);
    } else {
      setVisible(false);
      props.setFeedback('MyApartment', 'Not Available', true, '');
    }
  };

  const showPromoDetail = () => {
    return (
      <View
        style={{
          height: SView,
          marginTop: 20,
          //   paddingLeft: '5.55%',
          //   paddingRight: '5.55%',
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Image
            source={featuredpromotion}
            style={{
              height: 200,
              width: screenWidth * 0.89,
              marginTop: 15,
              resizeMode: 'cover',
              borderRadius: 10,
              marginHorizontal: '5.55%',
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: '5.55%',
              marginTop: 20,
            }}>
            <Button
              style={{
                backgroundColor: '#D3D3D3',
                height: 60,
                width: '46.5%',
                borderRadius: 10,
                marginRight: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              labelStyle={{color: '#fff', textAlign: 'center', fontSize: 11}}
              onPress={showModal}>
              BOOK NOW
            </Button>
            {specialCoupon === '1' || props.route.params.couponStatus === 1 ? (
              <>
                <Button
                  onPress={handleRequestPass}
                  style={{
                    backgroundColor: '#D3D3D3',
                    height: 60,
                    width: '46.5%',
                    borderRadius: 10,
                    marginLeft: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  labelStyle={{
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: 11,
                  }}>
                  GET YOUR COUPON
                </Button>
              </>
            ) : (
              <></>
            )}
          </View>
          <HTML
            tagsStyles={{
              p: {
                marginVertical: 20,
                marginHorizontal: '8%',
                textAlign: 'center',
              },
            }}
            source={{
              html:
                servicedetail.description == ''
                  ? '<p></p>'
                  : servicedetail.description,
            }}
          />
          <View style={{height: 200}}>
            {servicelatitude && servicelongitude ? (
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={{
                  latitude: parseFloat(servicelatitude),
                  longitude: parseFloat(servicelongitude),
                  latitudeDelta: 0.0,
                  longitudeDelta: 0.0121,
                }}>
                <MapView.Marker
                  coordinate={{
                    latitude: parseFloat(servicelatitude),
                    longitude: parseFloat(servicelongitude),
                  }}
                />
              </MapView>
            ) : (
              <View style={{marginVertical: 20}}>
                <Text style={{textAlign: 'center'}}>
                  No coordinates available.
                </Text>
              </View>
            )}
          </View>
          <Text
            style={{
              textAlign: 'center',
              marginVertical: 10,
              marginHorizontal: '8%',
            }}>
            {address}
          </Text>

          <Portal>
            <Modal
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={styles.containerStyle}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{marginVertical: 20}}>
                <Button
                  onPress={handleShowPhoneDial}
                  style={{
                    backgroundColor: '#D3D3D3',
                    height: 58,
                    //width: '48.5%',
                    borderRadius: 10,
                    marginBottom: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  labelStyle={{
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: 10,
                  }}>
                  CALL NOW
                </Button>
                <Button
                  onPress={handleShowBookOnline}
                  style={{
                    backgroundColor: '#D3D3D3',
                    height: 58,
                    //width: '48.5%',
                    borderRadius: 10,
                    marginTop: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  labelStyle={{
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: 10,
                  }}>
                  BOOK ONLINE
                </Button>
              </ScrollView>
            </Modal>
          </Portal>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FeedbackModal />
      <BackgroundLayout />
      <LogoBar title={props.hotelName} />
      <TitleBar title={props.route.params.promotitle} sub={true} />
      {loader === true ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator animating={true} color="#D3D3D3" />
        </View>
      ) : (
        showPromoDetail()
      )}
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  hotelName: state.HotelDetails.hotel.name,
  // hotelId: state.HotelDetails.hotel.id,
  // listingType: state.ListingType,
  token: state.LoginDetails.token,
  userid: state.LoginDetails.userId,
  //  CatId: state.Category.id,
  //  CatName: state.Category.name,
  ChildCatId: state.ChildCategory.id,
  ServiceName: state.PromotionServices.name,
  ServiceId: state.PromotionServices.id,
});

const mapDispatchToProps = (dispatch) => ({
  //  setChildCategory: (id , name) => {
  //    const data = {
  //      id: id,
  //      name: name,
  //    };
  //    dispatch(setChildCategory(data));
  //  },
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

export default connect(mapStateToProps, mapDispatchToProps)(Business);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  containerStyle: {
    backgroundColor: 'white',
    paddingHorizontal: '5.55%',
    marginHorizontal: '18%',
    height: '27%',
    borderRadius: 10,
  },
});
