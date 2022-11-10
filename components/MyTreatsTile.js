import React, { useState } from 'react';
import {
  TouchableHighlight,
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import {
  ActivityIndicator,
  Modal,
  Portal,
  Title,
  Text,
  Button,
} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import { setServiceDetail, setFeedback } from '../actions';
import { apiActiveURL, appKey, appId } from '../ApiBaseURL';
import axios from 'axios';

const MyTreatsTile = (props) => {
  console.log(props.treat, props.id, '------------props-----------');
  console.log(props.route?.params?.treat?.file, 'params');

  var [isPress, setIsPress] = useState(false);
  const navigation = useNavigation();
  const [msgTitle, setMsgTitle] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [loader, setLoader] = useState(true);
  const [visible, setVisible] = useState(false);
  const [visiblebtn, setVisibleBtn] = useState(false);
  const [loader2, setLoader2] = useState(true);
  const [servicephone, setServicePhone] = useState('');
  const [servicebookingurl, setServiceBookingURl] = useState('');

  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginHorizontal: 20,
  };

  const handleNavigation = () => {
    setIsPress(true);
    setTimeout(() => {
      setIsPress(false);
      //   props.setServiceDetail(props.id, props.title);
      //   navigation.navigate('Restaurants', {
      //     screen: 'Business',
      //     params: {couponserviceid: props.id, couponservicetitle: props.title},
      //   });
      navigation.navigate('Extra', {
        screen: 'TreatDetail',
        params: { treat: props.treat },
      });
    }, 0);
  };

  const handleDeleteCoupon = (couponid) => {
    console.log(props.userid, props.id, appId, 'deleteeeeeeeedataaaaaa');
    const url = `${apiActiveURL}/remove_treat_favourite/${props.userid}/${props.id}`;
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
        console.log(res, 'coupon delete ===================');
        if (res.data.code === 200) {
          props.setFeedback(
            'YourHotel',
            'Coupon deleted successfully',
            true,
            '',
          );
          props.fetchCouponServices();
        } else {
          props.setFeedback('YourHotel', 'Something went Wrong ..', true, '');
          setLoader(true);
        }
      })
      .catch((error) => {
        console.log(error, 'error');
        props.setFeedback('YourHotel', 'Something went Wrongggg ..', true, '');
        setLoader(true);
      });
  };

  // const showModal = (id, name) => {
  //     setMsgTitle(name);
  //     fetchServiceDetail(id);
  //     setVisibleBtn(true);
  // };

  // const fetchServiceDetail = (servicedetailid) => {
  //     const url = `${apiActiveURL}/service/${servicedetailid}`;
  //     const options = {
  //         method: 'GET',
  //         headers: {
  //             AppKey: appKey,
  //             Token: props.token,
  //             AppId: appId,
  //         },
  //         url,
  //     };
  //     axios(options)
  //         .then((res) => {
  //             if (Object.values(res.data.data).length > 0) {
  //                 let servicephone = res.data.data.service.meta.find(
  //                     (o) => o.meta_key === 'phone',
  //                 );
  //                 if (servicephone != undefined) {
  //                     setServicePhone(servicephone.meta_value);
  //                 }

  //                 //booking url work
  //                 let servicebookingurl = res.data.data.service.meta.find(
  //                     (o) => o.meta_key === 'booking_url',
  //                 );
  //                 if (servicebookingurl != undefined) {
  //                     setServiceBookingURl(servicebookingurl.meta_value);
  //                 }
  //                 setLoader2(false);
  //             } else {
  //                 setMsgTitle('ClubLocal');
  //                 setMsgBody('No Data Found...');
  //                 setVisible(true);
  //                 setLoader2(false);
  //             }
  //         })
  //         .catch((e) => {
  //             setMsgTitle('ClubLocal');
  //             setMsgBody('No Data Found...');
  //             setVisible(true);
  //             setLoader2(false);
  //             console.log(error, 'service api');
  //         });
  // };

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
      props.setFeedback('YourHotel', 'Something went Wrong ..', true, '');
    }
  };

  // const handleShowBookOnline = () => {
  //     if (servicebookingurl) {
  //         Linking.openURL(servicebookingurl);
  //     } else {
  //         hideModalBtn();
  //         setMsgTitle('ClubLocal');
  //         setMsgBody('Not available');
  //         setVisible(true);
  //     }
  // };

  const showBtn = () => {
    return (
      <Portal>
        <Modal
          visible={visiblebtn}
          onDismiss={hideModalBtn}
          contentContainerStyle={containerStyle}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: -15,
                marginBottom: 15,
              }}>
              <Image
                source={require('../images/logo.png')}
                style={styles.logo_css}
              />
              <Title style={{ marginLeft: 10, width: '70%' }}>{msgTitle}</Title>
            </View>
            {loader2 === true ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator animating={true} color='#6697D2' />
              </View>
            ) : (
              <>
                <Button
                  onPress={handleShowPhoneDial}
                  style={{
                    backgroundColor: '#6697D2',
                    height: 58,
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
                    backgroundColor: '#c219b7',
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
              </>
            )}
          </ScrollView>
        </Modal>
      </Portal>
    );
  };
  const hideModalBtn = () => {
    setVisibleBtn(false);
  };

  return (
    <>
      {showBtn()}
      <LinearGradient
        colors={['#D3D3D3', '#6697D2']}
        style={{ height: 110, width: 155, borderRadius: 10 }}>
        <TouchableHighlight
          style={isPress ? styles.tilePressed : styles.tileNormal}
          activeOpacity={1}
          underlayColor="#fff"
          onPress={() => handleNavigation()}>
          <>
            <TouchableOpacity
              style={styles.removebtn}
              onPress={() => handleDeleteCoupon(props.couponid)}>
              <Text style={styles.removetext}>Remove</Text>
            </TouchableOpacity>
            <Text
              style={isPress ? styles.tileTextPressed : styles.tileTextNormal}>
              {props.title}
            </Text>

            <View style={styles.btnscontainer}>
              {/* <View style={styles.item}>
                <TouchableOpacity
                  style={[styles.bookNowBtn, {}]}
                  onPress={() => showModal(props.id, props.title)}>
                  <Text style={styles.booknowtext}>Book{'\n'}Now</Text>
                </TouchableOpacity>
              </View> */}

              {props.passindicator ? (
                <>
                  <View style={styles.item2}>
                    <Text
                      style={{
                        fontSize: 11,
                        textAlign: 'center',
                        alignSelf: 'flex-end',
                        color: '#9e1b95',
                        borderWidth: 1,
                        borderColor: '#6697D2',
                        textAlignVertical: 'center',
                        padding: 2,
                        borderRadius: 10,
                      }}>
                      360{'\n'}Pass
                    </Text>
                  </View>

                  <View style={styles.item3}>
                    <Image
                      style={{ width: 20, height: 20, marginLeft: 5 }}
                      source={
                        props.weekendindicator === true
                          ? require('../images/wi.png')
                          : require('../images/wid.png')
                      }
                    />
                  </View>
                </>
              ) : (
                <></>
              )}
            </View>
          </>
        </TouchableHighlight>
      </LinearGradient>
    </>
  );
};

const mapStateToProps = (state) => ({
  token: state.LoginDetails.token,
  userid: state.LoginDetails.userId,
});

const mapDispatchToProps = (dispatch) => ({
  setServiceDetail: (id, name) => {
    const data = {
      id: id,
      name: name,
    };
    dispatch(setServiceDetail(data));
  },
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

export default connect(mapStateToProps, mapDispatchToProps)(MyTreatsTile);

const styles = StyleSheet.create({
  tileNormal: {
    height: 110,
    width: 155,
    borderWidth: 2,
    borderColor: '#cac8c8',
    borderRadius: 10,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 5,
  },
  tilePressed: {
    height: 110,
    width: 155,
    borderWidth: 3,
    borderColor: 'transparent',
    borderRadius: 10,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 5,
  },
  tileTextNormal: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  tileTextPressed: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#6697D2',
    marginBottom: 10,
  },
  btnscontainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    position: 'absolute',
    bottom: 8,
    left: 2,
    right: 2,
    alignItems: 'center',
  },
  item: {
    width: '35%',
  },
  item2: {
    width: '45%',
  },
  item3: {
    width: '20%',
  },
  removebtn: {
    borderColor: '#6697D2',
    borderWidth: 1,
    alignSelf: 'flex-end',
    borderRadius: 5,
    padding: 1,
    position: 'absolute',
    top: 5,
    right: 7,
  },
  removetext: {
    textAlign: 'center',
    color: '#9e1b95',
    fontSize: 11,
  },
  bookNowBtn: {
    borderColor: '#6697D2',
    borderWidth: 1,
    alignSelf: 'flex-start',
    borderRadius: 5,
    padding: 1,
    marginLeft: 5,
  },
  booknowtext: {
    textAlign: 'center',
    color: '#32CD32',
    fontSize: 11,
  },
  logo_css: {
    width: 80,
    height: 100,
    resizeMode: 'contain',
  },
});
