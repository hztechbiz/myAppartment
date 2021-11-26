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
import ModalTile from '../components/ModalTile';
import {ActivityIndicator, Button, Modal, Portal, Provider} from 'react-native-paper';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import { apiActiveURL, appKey, appId } from '../ApiBaseURL';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Axios from 'axios';
import HTML from 'react-native-render-html';
import { setFeedback } from '../actions';
import FeedbackModal from '../components/FeedbackModal';

const screenWidth = Dimensions.get('window').width;

const TableHead = (props) => {
  const headings = props.headings;
  const Items = headings.map((heading) => (
    <Text style={{paddingTop: 8, fontWeight: '700', fontSize: 13}}>
      {heading}
    </Text>
  ));
  return Items;
};
const TableItem = (props) => {
  const Items = props.Items;
  const check = Items.map((Item, index) =>
    Item == '1' ? (
      <Icon
        key={index}
        name="check"
        size={12}
        color="#6697D2"
        style={{paddingVertical: 12}}
      />
    ) : (
      <Icon
      key={index}
        name="close"
        size={12}
        color="#bfbfbf"
        style={{paddingVertical: 5}}
      />
    ),
  );
  return check;
};

const GDBusiness = (props) => {
  const myNavigation = useNavigation();
  const [SView, setSView] = React.useState('50%');
  const isFocused = useIsFocused();
  const [servicephone, setServicePhone] = useState('');
  const [coupondetails, setCouponDetails] = useState({});
  const [servicelatitude, setServiceLatitude] = useState('');
  const [servicelongitude, setServiceLongitude] = useState('');
  const [servicebookingurl, setServiceBookingURl] = useState('');
  const [calendardetails, setCalendarDetails] = useState();
  const [promodetails, setPromoDetails] = useState([]);
  const [confirmationcode, setConfirmationCode] = useState('');
  const [mondiscount, setMonDiscount] = useState('');
  const [discount, setDiscount] = useState('');
  const [vaccine, setVaccine] = useState("");
  const [menuURL, setMenuURL] = useState("");

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

  var [tableHead, setTableHeads] = React.useState([
    'M',
    'T',
    'W',
    'T',
    'F',
    'S',
    'S',
  ]);
  var [tableTitle, setTableTitle] = React.useState([
    'Breakfast',
    'Lunch',
    'Dinner',
    'AllDay',
  ]);
  var [tableData, setTableData] = React.useState([
    ['Check', 'unCheck', 'Check', 'Check', 'unCheck', 'Check', 'unCheck'],
    ['unCheck', 'Check', 'unCheck', 'Check', 'Check', 'unCheck', 'Check'],
    ['Check', 'Check', 'unCheck', 'Check', 'unCheck', 'Check', 'Check'],
    ['Check', 'Check', 'Check', 'Check', 'Check', 'Check', 'Check'],
  ]);

  const [visible, setVisible] = React.useState(false);
  const [visible2, setVisible2] = React.useState(false);
  const [loader, setLoader] = useState(true);
  const [servicedetail, setServiceDetail] = useState([]);
  const [featuredpromotion, setFeaturedPromotion] = useState(require('../images/Placeholder2.png'));

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const showModal2 = () => setVisible2(true);
  const hideModal2 = () => setVisible2(false);

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    setServiceDetail([]);
    setLoader(true);
    fetchServiceDetail(props.servicedetailid);
  }, [props, isFocused]);


  const fetchServiceDetail = (servicedetailid) => {
    const url = `${apiActiveURL}/service/${servicedetailid}`;
    const options = {
      method: 'GET',
      headers: {
        AppKey: appKey,
        Token: props.token,
        AppId: appId
      },
      url,
    };
    Axios(options)
      .then((res) => {
        console.log(res.data.data, 'service');
        setPromoDetails(res.data.data.promotions);
        setServiceDetail(res.data.data.service);
        if (Object.values(res.data.data).length > 0) {
          //coupon work
          let objCoupon = res.data.data.service.meta.find(
            (o) => o.meta_key === 'coupon',
          );
          let parseCoupon = JSON.parse(objCoupon.meta_value);
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
            let moncouponpercentage = parseCoupon.monday;
            setMonDiscount(moncouponpercentage);
            setDiscount(couponpercentage);
            setCouponDetails({
              coupon_name: parseCoupon.coupon_name,
              coupon_details: parseCoupon.coupon_details,
              coupon_percentage: couponpercentage,
            });
          }

          //vaccine_password work
          // let vaccine_pass = res.data.data.service.meta.find(
          //   (o) => o.meta_key === 'vaccine_password',
          // );
          // if(vaccine_pass){
          //   if(vaccine_pass.meta_value == '1'){
          //     setVaccine(require('../images/vaccine_pass.jpg'));
          //   }else if(vaccine_pass.meta_value == '0'){
          //     setVaccine(require('../images/vaccine_pass_cross.png'));
          //   }else{
          //     setVaccine("");
          //   }
          // }
          
          //hotel_menu_url work
          let hotel_menu_url = res.data.data.service.meta.find(
            (o) => o.meta_key === 'hotel_menu_url',
          );
          if(hotel_menu_url){
            setMenuURL(hotel_menu_url.meta_value);
          }

          //service_details work
          let objServiceDetails = res.data.data.service.meta.find(
            (o) => o.meta_key === 'service_details',
          );
          if (objServiceDetails != undefined) {
            let parseServiceDetails = JSON.parse(objServiceDetails.meta_value);
            setCalendarDetails([
              [
                parseServiceDetails.monday.breakfast,
                parseServiceDetails.tuesday.breakfast,
                parseServiceDetails.wednesday.breakfast,
                parseServiceDetails.thursday.breakfast,
                parseServiceDetails.friday.breakfast,
                parseServiceDetails.saturday.breakfast,
                parseServiceDetails.sunday.breakfast,
              ],
              [
                parseServiceDetails.monday.lunch,
                parseServiceDetails.tuesday.lunch,
                parseServiceDetails.wednesday.lunch,
                parseServiceDetails.thursday.lunch,
                parseServiceDetails.friday.lunch,
                parseServiceDetails.saturday.lunch,
                parseServiceDetails.sunday.lunch,
              ],
              [
                parseServiceDetails.monday.dinner,
                parseServiceDetails.tuesday.dinner,
                parseServiceDetails.wednesday.dinner,
                parseServiceDetails.thursday.dinner,
                parseServiceDetails.friday.dinner,
                parseServiceDetails.saturday.dinner,
                parseServiceDetails.sunday.dinner,
              ],
              [
                parseServiceDetails.monday.allday,
                parseServiceDetails.tuesday.allday,
                parseServiceDetails.wednesday.allday,
                parseServiceDetails.thursday.allday,
                parseServiceDetails.friday.allday,
                parseServiceDetails.saturday.allday,
                parseServiceDetails.sunday.allday,
              ],
            ]);
          } else {
            setCalendarDetails([
              ['0', '0', '0', '0', '0', '0', '0'],
              ['0', '0', '0', '0', '0', '0', '0'],
              ['0', '0', '0', '0', '0', '0', '0'],
              ['0', '0', '0', '0', '0', '0', '0'],
            ]);
          }
          //latlong work
          let servicelatitude = res.data.data.service.meta.find(
            (o) => o.meta_key === 'service_latitude',
          );
          if(servicelatitude != undefined){
            setServiceLatitude(servicelatitude.meta_value);
          }else{
            setServiceLatitude('0.000000');
          }

          let servicelongitude = res.data.data.service.meta.find(
            (o) => o.meta_key === 'service_longitude',
          );
          if(servicelongitude != undefined){
            setServiceLongitude(servicelongitude.meta_value);
          }else{
            setServiceLongitude('0.000000');
          }

           //phone work
           let servicephone = res.data.data.service.meta.find(
            (o) => o.meta_key === 'phone',
          );
          if(servicephone != undefined){
            setServicePhone(servicephone.meta_value);
          }

          //booking url work
          let servicebookingurl = res.data.data.service.meta.find(
            (o) => o.meta_key === 'booking_url',
          );
          if(servicebookingurl != undefined){
            setServiceBookingURl(servicebookingurl.meta_value);
          }

           //featured_promotion work
           let featuredImage = res.data.data.service.meta.find(
            (o) => o.meta_key === 'image',
          );
          if(featuredImage !== undefined){
            setFeaturedPromotion( {uri: featuredImage.meta_value} );
          }else{
            setFeaturedPromotion(require('../images/Hotel360-assets/promotion-placeholder-2.png'));
          }

          setConfirmationCode(generateConfirmationCode(6));
          
          //console.log(promodetails, 'pro');
          
          setLoader(false);
        } else {
          // setMsgTitle('ClubLocal');
          // setMsgBody('No Data Found...');
          // setVisibleFeedback(true);
          props.setFeedback('YourHotel', 'No Data Found...', true , '');
          setLoader(false);
        }
      })
      .catch((e) => {
        setLoader(false);
        props.setFeedback('YourHotel', 'Something Went Wrong...', true , '');
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
    if (mondiscount <= 0) {
      props.setFeedback('YourHotel', `There is no 360 Pass available at ${props.ServiceName}.`, true , '');
      return;
    }
    //console.log(props.servicedetailid, props.userid, coupondetails, confirmationcode, servicelatitude, servicelongitude);
    var stringifycoupondetails = JSON.stringify(coupondetails);
    const url = `${apiActiveURL}/coupon/add`;
    let ApiParamForAddCoupon = {
      service_id: props.servicedetailid,
      user_id: props.userid,
      details: stringifycoupondetails,
    };
    const options = {
      method: 'POST',
      headers: {
        AppKey: appKey,
        Token: props.token,
        AppId: appId
      },
      data: ApiParamForAddCoupon,
      url,
    };
    Axios(options)
      .then((res) => {
        //console.log(res, 'addcoupon');
        if (res.data.code === 200) {
          // setMsgTitle('ClubLocal');
          // setMsgBody('Coupon added successfully');
          // setVisibleFeedback(true);
          if (res.data.hasOwnProperty('data')) {
            props.setFeedback('YourHotel', `Pass added to My Favourites. You can use 360 Pass at ${props.ServiceName} and enjoy a discount of ${discount}%.`, true , '');
            props.navigation.navigate('MyCoupons', { screen: 'My Pass' });
          }else{
            props.setFeedback('YourHotel', '360 Pass Coupon already exists', true , '');
          }
        } else {
          console.log(res, 'addcoupon else');
          // setMsgTitle('ClubLocal');
          // setMsgBody('Something Went Wrong');
          props.setFeedback('YourHotel', 'Something Went Wrong...', true , '');
          // setVisibleFeedback(true);
        }
      })
      .catch((error) => {
        // setMsgTitle('ClubLocal');
        props.setFeedback('YourHotel', 'Something Went Wrong...', true , '');
        // setVisibleFeedback(true);
        console.log(error, 'addcoupon');
      });
  };


  const handleShowPhoneDial = () => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${servicephone}`;
    }
    else {
      phoneNumber = `telprompt:${servicephone}`;
    }
    if(servicephone){
      Linking.openURL(phoneNumber);
    }else{
      hideModal2();
      props.setFeedback('YourHotel', 'No Phone Booking', true , '');
    }
    
  }

  const handleShowBookOnline = () => {
    if(servicebookingurl){
      Linking.openURL(servicebookingurl);
    }else{
      hideModal2();
      props.setFeedback('YourHotel', 'No Online Booking', true , '');
    }
    
  }

  const showServiceDetail = () => {
    return(
      <View
          style={{
            height: SView,
            marginTop: 20,
            //   paddingLeft: '5.55%',
            //   paddingRight: '5.55%',
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* <Image
              source={featuredpromotion}
              style={{
                height: 200,
                width: screenWidth * 0.89,
                marginTop: 15,
                resizeMode: 'cover',
                borderRadius: 10,
                marginHorizontal: '5.55%',
              }}
            /> */}
            <Portal>
              <Modal
                visible={visible2}
                onDismiss={hideModal2}
                contentContainerStyle={styles.containerStyle2}>
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
                      backgroundColor: '#6697D2',
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
            {/* <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: '5.55%',
                marginTop: 10,
              }}>
                
              <Button
                style={{
                  backgroundColor: '#D3D3D3',
                  height: 60,
                  width: '48.5%',
                  borderRadius: 10,
                  marginRight: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                labelStyle={{color: '#fff', textAlign: 'center', fontSize: 11}}
                onPress={showModal2}
                >
                BOOK NOW
              </Button>
              <Button
              onPress={handleRequestPass}
                style={{
                  backgroundColor: '#6697D2',
                  height: 60,
                  width: '48.5%',
                  borderRadius: 10,
                  marginLeft: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                labelStyle={{color: '#fff', textAlign: 'center', fontSize: 11}}>
                REQUEST 360 PASS
              </Button>
            </View> */}
            <HTML
            tagsStyles={{
              p: {
                marginVertical: 10,
                marginHorizontal: '8%',
                textAlign: 'center',
              },
            }}
            source={{html: servicedetail.description == '' ? '<p>No Description Available</p>' : servicedetail.description}}
          />
            {/* <View
              style={{
                marginHorizontal: '5.55%',
                marginVertical: 20,
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <View
                style={{
                  borderColor: '#cac8c8',
                  borderWidth: 1,
                  borderRadius: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      width: 70,
                      paddingTop: 8,
                      fontSize: 18,
                      color: '#6697D2',
                      fontWeight: '700',
                    }}>
                    OPEN
                  </Text>
                  <TableHead headings={tableHead} />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      width: 70,
                      paddingVertical: 12,
                      fontWeight: '700',
                      fontSize: 13,
                    }}>
                    Breakfast
                  </Text>
                  <TableItem Items={calendardetails[0]} />
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#cac8c8',
                    marginHorizontal: 15,
                  }}></View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      width: 70,
                      paddingVertical: 12,
                      fontWeight: '700',
                      fontSize: 13,
                    }}>
                    Lunch
                  </Text>
                  <TableItem Items={calendardetails[1]} />
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#cac8c8',
                    marginHorizontal: 15,
                  }}></View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      width: 70,
                      paddingVertical: 12,
                      fontWeight: '700',
                      fontSize: 13,
                    }}>
                    Dinner
                  </Text>
                  <TableItem Items={calendardetails[2]} />
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#cac8c8',
                    marginHorizontal: 15,
                  }}></View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      width: 70,
                      paddingVertical: 12,
                      fontWeight: '700',
                      fontSize: 13,
                    }}>
                    AllDay
                  </Text>
                  <TableItem Items={calendardetails[3]} />
                </View>
              </View>
            </View> */}
            {/* <View style={{height: 200}}>
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
            </View> */}

            <Portal>
        <Modal
          visible={visible}
          onDismiss={hideOffersModal}
          contentContainerStyle={styles.containerStyle}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ marginVertical: 20 }}>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
              {promodetails.map((promo, index) => (
                <View key={index} style={{ flexBasis: '50%', paddingHorizontal: 5 }}>
                  <ModalTile
                    id={promo.id}
                    title={promo.title}
                    content={promo.description}
                    navigationprops={myNavigation}
                    handleHideOffersModal={hideOffersModal}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        </Modal>
      </Portal>
      <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
              alignContent: 'center',
          }}>
            {/* <View
              style={{
                // flex: 1,
                justifyContent: 'center',
                alignContent: 'center',
                flexBasis: '48.5%',
                // flexDirection: 'row'
              }}>
              <Button
                style={{
                  backgroundColor: '#6697D2',
                  height: 60,
                  
                  borderRadius: 10,
                  // marginTop: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  // alignSelf: 'center',
                }}
                labelStyle={{color: '#fff', textAlign: 'center', fontSize: 11}}
                onPress={showOffersModal}>
                SPECIAL OFFERS
              </Button>
              
            </View> */}
            {vaccine ? (
              <Image
              source={vaccine}
              style={{
                height: 60,
                width: 60,
                resizeMode: 'contain',
                alignSelf: 'center',
                marginHorizontal: 5
              }}
              />
            ) : (<></>)}
              {menuURL ? (
                <TouchableOpacity onPress={() => Linking.openURL(menuURL)}>
                <Image
                source={require('../images/menu_symbol.jpg')}
                style={{
                  height: 60,
                  width: 80,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                  marginHorizontal: 5
                }}
                />
              </TouchableOpacity>
              ) : (<></>)}
            
          </View>
          </ScrollView>
        </View>
    );
  }
  const hideOffersModal = (promoid, promotitle) => {
    if(promoid == undefined){
      setVisible(false);
      return;
    }
    props.navigation.navigate('Promotions', { screen: 'Promotion Business', params: { promoid: promoid, promotitle: promotitle }, });
    setVisible(false);
  };
  const showOffersModal = () => {
    if(promodetails.length > 0){
      setVisible(true);
    }else{
      props.setFeedback('YourHotel', `${props.ServiceName} has no Special Offers at the moment`, true , '');
    }
  };

  return (
    
      <SafeAreaView style={styles.container}>
        <FeedbackModal/>
        <BackgroundLayout />
        <LogoBar title={props.hotelName} />
        <TitleBar title={props.ServiceName} />
        
        {loader === true ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator animating={true} color="#6697D2" />
        </View>
      ) : (
          showServiceDetail()
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
 ChildCatId: state.ChildGuestD.id,
 ServiceName: state.GuestDServices.name,
 servicedetailid: state.GuestDServices.id,
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
    mynav: mynav
  };
  dispatch(setFeedback(data));
},
});

export default connect(mapStateToProps, mapDispatchToProps)(GDBusiness);

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
    marginHorizontal: '5.55%',
    height: '60%',
    borderRadius: 10,
  },
  containerStyle2: {
    backgroundColor: 'white',
    paddingHorizontal: '5.55%',
    marginHorizontal: '18%',
    height: '27%',
    borderRadius: 10,
  },
});
