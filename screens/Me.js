import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Platform,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import {
  Button,
  Modal,
  Title,
  Text,
  Portal,
  ActivityIndicator,
  Dialog,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import {
  checkOut,
  setIsAll,
  setListingType,
  setSuburb,
  signOut,
} from '../actions';
import {useIsFocused, CommonActions} from '@react-navigation/native';
import {apiActiveURL, appId, appKey} from '../ApiBaseURL';
import Axios from 'axios';
import Pdf from 'react-native-pdf';
import PoweredBy from '../components/PoweredBy';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const statusBar = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const Me = (props) => {
  const [SView, setSView] = React.useState('64%');
  const [suburbs, setSuburbs] = useState([]);
  const [msgTitle, setMsgTitle] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [loader, setLoader] = useState(true);
  const [visibleSuburb, setVisibleSuburb] = useState(false);
  const [suburbid, setSuburbID] = useState('');
  const isFocused = useIsFocused();
  const [visibleLogOut, setVisibleLogOut] = useState(false);
  const [pdfuri, setPdfUri] = useState({uri: ''});
  const [pdfmodal, setPdfModal] = useState(false);
  const [pdfloader, setPdfLoader] = useState(false);

  const containerStyle = {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginHorizontal: 20,
    marginVertical: 20,
  };

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // console.log(props.isAll, 'isAll');
    props.isAll ? '' : props.suburb ? '' : handleSuburbId(props.hotelSubrub);
    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => {
    setSView('50%');
  };

  const _keyboardDidHide = () => {
    setSView('69.3%');
  };

  const handleLogout = () => {
    clearStorage();

    const url = `${apiActiveURL}/logout/${props.userId}`;
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
        console.log('logout Api Success');
      })
      .catch((error) => {
        console.log(url, 'rest api');
      });

    props.signOut(false);
    props.checkOut();
    //props.navigation.navigate('Me');
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('hotel');
      console.log('Storage successfully cleared!');
    } catch (e) {
      console.log('Failed to clear the async storage.');
    }
  };

  const showlogOut = () => setVisibleLogOut(true);
  const hidelogOut = () => setVisibleLogOut(!visibleLogOut);

  const showLogOutModal = () => {
    return (
      <Portal>
        <Modal
          visible={visibleLogOut}
          onDismiss={hidelogOut}
          contentContainerStyle={containerStyle}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Title
              style={{
                fontSize: 18,
                textAlign: 'center',
                color: '#6697D2',
                paddingBottom: 15,
              }}>
              Are You Sure You Want To LOGOUT?
            </Title>
            <Dialog.Actions style={{marginBottom: -10}}>
              <Button onPress={() => hidelogOut()}>
                <Text style={{color: '#D3D3D3', fontWeight: 'bold'}}>
                  Cancel
                </Text>
              </Button>
              <Button onPress={() => handleLogout()}>
                <Text style={{color: '#D3D3D3', fontWeight: 'bold'}}>Yes</Text>
              </Button>
            </Dialog.Actions>
          </ScrollView>
        </Modal>
      </Portal>
    );
  };

  const handleNavigationGD = () => {
    props.navigation.dispatch(
      CommonActions.reset({
        routes: [{name: 'GDServices'}],
      }),
    );
  };
  const handleNavigation = (categoryname) => {
    if (categoryname == 'Restaurants') {
      props.navigation.dispatch(
        CommonActions.reset({
          routes: [{name: 'Restaurants', params: {screenName: 'GetAll'}}],
        }),
      );
    } else if (categoryname != 'PromoCategories') {
      props.navigation.dispatch(
        CommonActions.reset({
          routes: [{name: categoryname}],
        }),
      );
    } else {
      props.navigation.navigate('Promotions', {screen: categoryname});
    }
  };

  const showModalSuburb = () => {
    setLoader(true);
    setVisibleSuburb(true);
    setMsgTitle('MyApartment');
    fetchSuburb();
  };

  const fetchSuburb = () => {
    const url = `${apiActiveURL}/get_subrubs/${props.cityName}`;
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
        console.log(Object.values(res.data.data).sort(), 'subrubs api');
        if (res.data.code === 200) {
          setMsgTitle('Select Suburb/Town');
          if (res.data.data) {
            let defaultvalue = {All: 'All'};
            let objset = Object.assign(defaultvalue, res.data.data);
            setSuburbs(objset);
          }
          setLoader(false);
        } else {
          setLoader(false);
          setMsgTitle('MyApartment');
          setMsgBody('Something Went Wrong...');
        }
      })
      .catch((error) => {
        setLoader(false);
        setMsgTitle('MyApartment');
        setMsgBody('Something Went Wrong...');
        console.log(error, 'subrubs api');
      });
  };

  const hideSuburbModal = () => {
    setVisibleSuburb(false);
    setMsgTitle('');
  };

  const showSuburbModal = () => {
    return (
      <Portal>
        <Modal
          visible={visibleSuburb}
          onDismiss={hideSuburbModal}
          contentContainerStyle={containerStyle}>
          <ScrollView>
            <Title
              style={{
                fontSize: 18,
                textAlign: 'center',
                color: '#6697D2',
                paddingBottom: 15,
              }}>
              {msgTitle}
            </Title>
            <>
              {loader === true ? (
                <View
                  style={{
                    marginTop: 10,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator animating={true} color="#6697D2" />
                </View>
              ) : (
                <>
                  {msgTitle === 'Select Suburb/Town' ? (
                    Object.values(suburbs)
                      .sort()
                      .map((suburb, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.arealist}
                          onPress={() => handleSuburbId(suburb)}>
                          <Text
                            style={{
                              textTransform: 'capitalize',
                              color: 'black',
                            }}>
                            {' '}
                            {suburb}{' '}
                          </Text>
                        </TouchableOpacity>
                      ))
                  ) : (
                    <Text style={{textAlign: 'center'}}>{msgBody}</Text>
                  )}
                </>
              )}
            </>
          </ScrollView>
        </Modal>
      </Portal>
    );
  };
  const handleSuburbId = (suburb) => {
    setSuburbID(suburb);
    props.setIsAll(suburb == 'All' ? true : false);
    props.setSuburb(suburb == 'All' ? '' : suburb);
    setVisibleSuburb(false);
    setMsgTitle('');
  };

  const handleShowPDF = (url, title) => {
    setMsgTitle(title);
    setPdfLoader(true);
    setPdfUri(url);
    setPdfModal(true);
    setPdfLoader(false);
  };

  const hideModalPDF = () => {
    setPdfModal(false);
  };

  const showPDF = () => {
    return (
      <Portal>
        <Modal
          visible={pdfmodal}
          onDismiss={hideModalPDF}
          contentContainerStyle={containerStyle}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Title
              style={{
                fontSize: 18,
                textAlign: 'center',
                color: '#6697D2',
              }}>
              {msgTitle}
            </Title>

            {pdfloader === true ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator animating={true} color="#6697D2" />
              </View>
            ) : (
              <Pdf
                source={pdfuri}
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
            )}
          </ScrollView>
          <Dialog.Actions>
            <Button onPress={hideModalPDF}>Close</Button>
          </Dialog.Actions>
        </Modal>
      </Portal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {showLogOutModal()}
      {showPDF()}
      <Image
        source={require('../images/Hotel360-assets/background-layout-1.png')}
        style={styles.background_image}
      />
      <View style={styles.logo_row}>
        <View style={styles.logo_row_col_1}>
          <Image
            source={
              props.logo
                ? {uri: props.logo}
                : require('../images/Hotel360-assets/hotel-logo.png')
            }
            style={styles.logo_css}
          />
        </View>
        <View style={styles.logo_row_col_2}>
          <View style={styles.logo_row_col_2_view_1}>
            <Text
              style={{
                fontWeight: '700',
                color: '#5a5a5a',
                textAlignVertical: 'center',
                textTransform: 'uppercase',
                textAlign: 'right',
                paddingBottom: 5,
              }}>
              {props.hotelName ? props.hotelName : 'SELECT HOTEL NAME'}
            </Text>

            <TouchableOpacity onPress={showModalSuburb}>
              {props.suburb ? (
                <>
                  <Text
                    style={{
                      fontWeight: '700',
                      color: '#5a5a5a',
                      textAlignVertical: 'center',
                      textTransform: 'uppercase',
                      textAlign: 'right',
                    }}>
                    {`AREA: ${props.cityName}`}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                    }}>
                    <Icon name="eye" size={14} color="#5a5a5a" />
                    <Text
                      style={{
                        fontWeight: '700',
                        color: '#5a5a5a',
                        textAlignVertical: 'center',
                        textTransform: 'uppercase',
                        textAlign: 'right',
                      }}>
                      {` ${props.suburb}`}
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <Text
                    style={{
                      fontWeight: '700',
                      color: '#5a5a5a',
                      textAlignVertical: 'center',
                      textTransform: 'uppercase',
                      textAlign: 'right',
                    }}>
                    {`AREA: ${props.cityName}`}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                    }}>
                    <Icon name="eye" size={14} color="#5a5a5a" />
                    <Text
                      style={{
                        fontWeight: '700',
                        color: '#5a5a5a',
                        textAlignVertical: 'center',
                        textTransform: 'uppercase',
                        textAlign: 'right',
                      }}>
                      {` ALL`}
                    </Text>
                  </View>
                </>
              )}
            </TouchableOpacity>
          </View>
          {showSuburbModal()}
          <View style={styles.logo_row_col_2_view_2}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                maxHeight: 30,
              }}>
              <Button
                style={{
                  backgroundColor: '#6697D2',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 14,
                }}
                onPress={() => handleNavigation('help')}
                color="#FFF"
                labelStyle={{fontSize: 9, textAlign: 'center'}}>
                HELP
              </Button>
              <Button
                style={{
                  backgroundColor: '#D3D3D3',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 14,
                  marginLeft: '3%',
                }}
                onPress={() => showlogOut()}
                color="#000"
                labelStyle={{fontSize: 9, textAlign: 'center'}}>
                LOGOUT
              </Button>
            </View>
            <View
              style={{
                borderWidth: 1,
                padding: 6,
                borderRadius: 32,
                overflow: 'hidden',
                marginLeft: 5,
                borderColor: '#cac8c8',
              }}>
              <Icon name="bell" size={18} color="#5a5a5a" />
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          marginTop: 10,
          marginHorizontal: '5.55%',
          height: SView,
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.contentScroll_view_1}>
              <TouchableOpacity
                style={[
                  styles.touchableBox_left,
                  {backgroundColor: '#6697D2', height: 40, marginTop: 0},
                ]}
                onPress={() => {
                  props.navigation.navigate('Weather');
                }}>
                {/* <Image
                  source={require('../images/Hotel360-assets/guest-directory-icon.png')}
                  style={{height: '38.31%', resizeMode: 'contain'}}
                /> */}
                <Title
                  style={{
                    fontSize: 12,
                    lineHeight: 12,
                    textAlign: 'center',
                    marginVertical: '8.42%',
                    color: '#FFF',
                  }}>
                  LOCAL WEATHER
                </Title>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.touchableBox_left, {marginTop: '10%'}]}
                onPress={() => {
                  props.setListingType(10);
                  handleNavigationGD();
                }}>
                <Image
                  source={require('../images/Hotel360-assets/guest-directory-icon.png')}
                  style={{height: '38.31%', resizeMode: 'contain'}}
                />
                <Title
                  style={{
                    fontSize: 14,
                    lineHeight: 14,
                    textAlign: 'center',
                    marginTop: '8.42%',
                  }}>
                  Property{'\n'}Information
                </Title>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.touchableBox_left}
                onPress={() => {
                  props.setListingType(7);
                  handleNavigation('Promotions');
                }}>
                <Image
                  source={require('../images/Hotel360-assets/promotions.png')}
                  style={{height: '38.31%', resizeMode: 'contain'}}
                />
                <Title
                  style={{
                    fontSize: 14,
                    lineHeight: 14,
                    textAlign: 'center',
                    marginTop: '8.42%',
                  }}>
                  Experiences, Offers{'\n'}& Promotions
                </Title>
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={[styles.touchableBox_left, {backgroundColor: '#6697D2', height: 80}]}
                onPress={() => {
                  
                  handleShowPDF(Platform.OS == 'ios' ? require('./../assets/pdfs/Learn_all_about_YourHotel.pdf') : {uri:'bundle-assets://Learn_all_about_YourHotel.pdf', cache: true} , 'Learn About YourHotel')
                }}
                >
              
                <Title
                  style={{
                    fontSize: 14,
                    lineHeight: 14,
                    textAlign: 'center',
                    marginTop: '8.42%',
                    color: '#FFF'
                  }}>
                  LEARN ABOUT{'\n'}YOURHOTEL
                </Title>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={styles.touchableBox_left}
                onPress={() => {
                  props.setListingType(8);
                  handleNavigation('WhatsOn');
                }}>
                <Image
                  source={require('../images/Hotel360-assets/whats-on.png')}
                  style={{height: '38.31%', resizeMode: 'contain'}}
                />
                <Title
                  style={{
                    fontSize: 14,
                    lineHeight: 14,
                    textAlign: 'center',
                    marginTop: '8.42%',
                  }}>
                  What's on
                </Title>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.touchableBox_right}
                onPress={() => {
                  // props.setListingType(9);
                  handleNavigation('Treats');
                  // props.navigation.navigate('Treats')
                  // handleNavigation('Treats');
                }}>
                <Image
                  source={require('../images/Hotel360-assets/promotions.png')}
                  style={{height: '38.31%', resizeMode: 'contain'}}
                />
                <Title
                  style={{
                    fontSize: 14,
                    lineHeight: 14,
                    textAlign: 'center',
                    marginTop: '8.42%',
                    padding: 5,
                  }}>
                  Bag of Treats
                </Title>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.touchableBox_left}
                onPress={() => {
                  props.setListingType(7);
                  handleNavigation('MyCoupons');
                }}>
                <Image
                  source={require('../images/Hotel360-assets/coupons.png')}
                  style={{height: '38.31%', resizeMode: 'contain'}}
                />
                <Title
                  style={{
                    fontSize: 14,
                    lineHeight: 14,
                    textAlign: 'center',
                    marginTop: '8.42%',
                  }}>
                  My vouchers & coupons
                </Title>
              </TouchableOpacity>
            </View>
            <View style={styles.contentScroll_view_2}>
              <Title
                style={{
                  fontSize: 12,
                  lineHeight: 14,
                  textAlign: 'center',
                  marginTop: '5%',
                }}>
                Select a Suburb/Town first
              </Title>
              <TouchableOpacity
                style={styles.touchableBox_right_first}
                onPress={() => {
                  props.setListingType(5);
                  handleNavigation('Restaurants');
                }}>
                <Image
                  source={require('../images/Hotel360-assets/restaurants-eaters.png')}
                  style={{height: '38.31%', resizeMode: 'contain'}}
                />
                <Title
                  style={{
                    fontSize: 14,
                    lineHeight: 14,
                    textAlign: 'center',
                    marginTop: '8.42%',
                  }}>
                  Restaurants, Bars & Eateries
                </Title>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.touchableBox_right}
                onPress={() => {
                  props.setListingType(6);
                  handleNavigation('Experiences');
                }}>
                <Image
                  source={require('../images/Hotel360-assets/experiences.png')}
                  style={{height: '38.31%', resizeMode: 'contain'}}
                />
                <Title
                  style={{
                    fontSize: 14,
                    lineHeight: 14,
                    textAlign: 'center',
                    marginTop: '8.42%',
                  }}>
                  Tours, Activities & Attractions
                </Title>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.touchableBox_right}
                onPress={() => {
                  props.setListingType(9);
                  handleNavigation('Beauty');
                }}>
                <Image
                  source={require('../images/Hotel360-assets/promotions.png')}
                  style={{height: '38.31%', resizeMode: 'contain'}}
                />
                <Title
                  style={{
                    fontSize: 14,
                    lineHeight: 14,
                    textAlign: 'center',
                    marginTop: '8.42%',
                  }}>
                  Beauty & Retail
                </Title>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.touchableBox_right}
                onPress={() => {
                  props.setListingType(11);
                  handleNavigation('Others');
                }}>
                <Image
                  source={require('../images/Hotel360-assets/promotions.png')}
                  style={{height: '38.31%', resizeMode: 'contain'}}
                />
                <Title
                  style={{
                    fontSize: 14,
                    lineHeight: 14,
                    textAlign: 'center',
                    marginTop: '8.42%',
                  }}>
                  Other
                </Title>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      <PoweredBy />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  logo_row: {
    flexDirection: 'row',
    // marginHorizontal: '5.55%',
  },

  arealist: {
    padding: 10,
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#cac8c8',
  },
  logo_row_col_1: {
    width: '35%',
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'flex-end',
    // backgroundColor: '#f00',
  },

  logo_row_col_2: {
    marginTop: 20,
    width: '65%',
    // backgroundColor: '#ff0',
  },

  logo_row_col_2_view_1: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'column',
    marginRight: '5.55%',
  },

  logo_row_col_2_view_2: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
    marginRight: '5.55%',
    marginTop: 12,
    height: 33,
  },

  logo_css: {
    width: screenWidth * 0.33,
    height: screenHeight * 0.12,
    resizeMode: 'contain',
    marginLeft: '5.55%',
  },

  background_image: {
    height: '100%',
    width: screenWidth,
    resizeMode: 'stretch',
    position: 'absolute',
    bottom: 0,
  },

  contentScrollView: {
    flex: 1,
    marginTop: 20,
    width: screenWidth,
    maxHeight: '69.3%',
    paddingLeft: '5.55%',
    paddingRight: '5.55%',
    //   borderWidth: 1,
    //   borderColor: '#f00'
  },

  contentScroll_view_1: {
    flex: 1,
    justifyContent: 'center',
    width: '50%',
    paddingRight: '4.67%',
    alignContent: 'flex-start',
    maxHeight: '100%',
    marginBottom: 15,
  },

  contentScroll_view_1_row: {
    flex: 1,
    flexDirection: 'row',
    maxHeight: 30,
  },

  contentScroll_view_2: {
    justifyContent: 'center',
    width: '50%',
    height: '85%',
    paddingLeft: '2%',
    paddingRight: '2%',
    borderRadius: 10,
    backgroundColor: '#ced5e0',
  },

  touchableBox_left: {
    borderWidth: 1,
    borderColor: '#cac8c8',
    borderRadius: 10,
    height: 110,
    backgroundColor: '#fff',
    marginTop: '7%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },

  touchableBox_right_first: {
    borderWidth: 1,
    borderColor: '#cac8c8',
    borderRadius: 10,
    height: 110,
    backgroundColor: '#fff',
    marginTop: '7%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },

  touchableBox_right: {
    borderWidth: 1,
    borderColor: '#cac8c8',
    borderRadius: 10,
    height: 110,
    backgroundColor: '#fff',
    marginTop: '10%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },

  touchableBox_right_last: {
    borderWidth: 2,
    borderColor: '#cac8c8',
    borderRadius: 10,
    height: 110,
    backgroundColor: '#fff',
    marginTop: '10%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderColor: '#f59936',
    // marginBottom: 5
  },
  pdf: {
    // flex:1,
    alignSelf: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.55,
  },
});

const mapStateToProps = (state) => ({
  hotelName: state.HotelDetails.hotel.name,
  hotelId: state.HotelDetails.hotel.id,
  cityName: state.HotelDetails.hotel.area,
  hotelSubrub: state.HotelDetails.hotel.subrub,
  suburb: state.HotelDetails.suburb,
  isAll: state.HotelDetails.isAll,
  userId: state.LoginDetails.userId,
  token: state.LoginDetails.token,
  logo: state.HotelDetails.hotel.logo,
});

const mapDispatchToProps = (dispatch) => ({
  setListingType: (data) => {
    dispatch(setListingType(data));
  },
  signOut: (data) => {
    dispatch(signOut(data));
  },
  setSuburb: (data) => {
    dispatch(setSuburb(data));
  },
  checkOut: (data) => {
    dispatch(checkOut());
  },
  setIsAll: (data) => {
    dispatch(setIsAll(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Me);
