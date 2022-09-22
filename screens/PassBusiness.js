import {useIsFocused} from '@react-navigation/native';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
  ScrollView,
  Keyboard,
  TextInput,
} from 'react-native';
import {
  Title,
  ActivityIndicator,
  Modal,
  Portal,
  withTheme,
  Dialog,
  Button,
} from 'react-native-paper';
import {connect} from 'react-redux';
import {setFeedback} from '../actions';
import {apiActiveURL, appId, appKey} from '../ApiBaseURL';
import BackgroundLayout from '../components/BackgroundLayout';
import LogoBar from '../components/LogoBar';
import TitleBar from '../components/TitleBar';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const statusBar = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const PassBusiness = (props) => {
  const [SView, setSView] = React.useState('50%');
  const [bill, setBill] = useState('');
  const [netamount, setNetAmount] = useState(0.0);
  const [msgTitle, setMsgTitle] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [loader, setLoader] = useState(false);
  const [visible, setVisible] = useState(false);
  const [confirmationcode, setConfirmationCode] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      return;
    }
  }, [props, isFocused]);

  const containerStyle = {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginHorizontal: 20,
  };

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

  const handleChangeBill = (text) => {
    setBill(text);
    if (text > 50) {
      let discounted_price;
      let original_price = text;
      let discount = props.route.params.discount;
      discounted_price = original_price - (original_price * discount) / 100;
      setNetAmount(discounted_price);
    } else {
      setNetAmount(text);
    }
  };

  const handleVerifyCoupon = () => {
    if (bill === '') {
      setMsgTitle('MyApartment');
      setMsgBody('Please enter bill value.');
      setVisible(true);
      return;
    } else if (confirmationcode == '') {
      setMsgTitle('MyApartment');
      setMsgBody("Please tap 'Verify' again to confirm your purchase");
      setVisible(true);
      return;
    }
    setLoader(true);
    const url = `${apiActiveURL}/add_transaction`;
    let ApiParamForTransaction = {
      coupon_id: props.route.params.id,
      payable_amount: bill,
      discounted_amount: netamount,
      confirmation_code: confirmationcode,
    };
    const options = {
      method: 'POST',
      headers: {
        AppKey: appKey,
        Token: props.token,
        AppId: appId,
      },
      data: ApiParamForTransaction,
      url,
    };
    axios(options)
      .then((res) => {
        console.log(res, 'add_transaction');
        if (res.data.code === 200) {
          setLoader(false);
          props.setFeedback(
            'MyApartment',
            'Coupon Verified Successfully!',
            true,
            'My Coupons',
          );
        } else {
          setLoader(false);
          props.setFeedback('MyApartment', 'No Data Found ...', true, '');
        }
      })
      .catch((error) => {
        setLoader(false);
        props.setFeedback('MyApartment', 'No Data Found ...', true, '');
        console.log('how', error);
      });
  };

  const showModal = () => {
    return (
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Title
              style={{
                fontSize: 18,
                textAlign: 'center',
                color: '#6697D2',
                paddingBottom: 15,
              }}>
              {msgTitle}
            </Title>
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
              <Text style={{textAlign: 'center'}}>{msgBody}</Text>
            )}
            <Dialog.Actions>
              <Button
                onPress={() => {
                  msgBody ==
                  "Please tap 'Verify' again to confirm your purchase"
                    ? handleVerify()
                    : hideModal();
                }}>
                {msgBody == "Please tap 'Verify' again to confirm your purchase"
                  ? 'Verify'
                  : 'OK'}
              </Button>
            </Dialog.Actions>
          </ScrollView>
        </Modal>
      </Portal>
    );
  };
  const hideModal = () => {
    setVisible(false);
  };
  const handleVerify = () => {
    setConfirmationCode(generateConfirmationCode(6));
    hideModal();
  };

  return (
    <SafeAreaView style={styles.container}>
      {showModal()}
      <BackgroundLayout />
      <LogoBar
        title={`360
PASS`}
        color="#650d88"
        borderWidth={5}
        borderColor="#D3D3D3"
      />
      <TitleBar title={props.route.params.title} />
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
              textAlign: 'center',
              paddingHorizontal: 15,
              color: '#6b6b6b',
            }}>
            {props.route.params.details}
          </Text>
          <View
            style={{
              borderTopColor: '#edf0f5',
              borderTopWidth: 1,
              marginVertical: 15,
            }}></View>
          <View style={{justifyContent: 'center', alignContent: 'center'}}>
            <Text style={{textAlign: 'center', fontWeight: '700'}}>
              NET AMOUNT PAYABLE
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: '700',
                color: '#D3D3D3',
                fontSize: 55,
                marginVertical: 5,
              }}>
              ${netamount}
            </Text>
            <Text style={{textAlign: 'center', fontWeight: '700'}}>
              Show your 360 Pass to your Server
            </Text>
          </View>
          <View
            style={{
              borderTopColor: '#edf0f5',
              borderTopWidth: 1,
              marginVertical: 15,
            }}></View>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                width: '50%',
                borderRightColor: '#edf0f5',
                borderRightWidth: 1,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '700',
                  marginRight: 20,
                }}>
                INSERT THE FULL{'\n'}VALUE OF YOUR BILL
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: '#D3D3D3',
                    fontSize: 20,
                  }}>
                  ${' '}
                </Text>
                <TextInput
                  style={{
                    color: '#D3D3D3',
                    backgroundColor: '#f0f3f7',
                    marginRight: 20,
                    marginTop: 6,
                    borderRadius: 5,
                    textAlign: 'center',
                    height: 45,
                    width: '75%',
                  }}
                  keyboardType="numeric"
                  maxLength={5}
                  onChangeText={(text) => handleChangeBill(text)}
                  value={bill}
                  placeholder="Enter Value"
                  placeholderTextColor="#D3D3D3"
                />
              </View>
            </View>
            <View style={{width: '50%'}}>
              <Text style={{textAlign: 'center', marginTop: 5}}>
                AVAILABLE{'\n'}DISCOUNT
              </Text>
              <Text
                style={{textAlign: 'center', fontWeight: '700', fontSize: 30}}>
                {props.route.params.discount}%
              </Text>
            </View>
          </View>
          <View
            style={{
              borderTopColor: '#edf0f5',
              borderTopWidth: 1,
              marginVertical: 15,
            }}></View>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '50%', paddingRight: 20}}>
              <Button
                onPress={() => handleVerifyCoupon()}
                style={{
                  backgroundColor: '#D3D3D3',
                  height: 50,
                  justifyContent: 'center',
                  alignContent: 'center',
                  borderRadius: 8,
                }}
                labelStyle={{color: '#fff'}}>
                VERIFY
              </Button>
            </View>
            <View style={{width: '50%'}}>
              <Text style={{textAlign: 'center'}}>CONFIRMATION CODE</Text>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#838e9d',
                  fontSize: 33,
                  fontWeight: '700',
                  lineHeight: 38,
                }}>
                {confirmationcode}
              </Text>
            </View>
          </View>
          <View style={{justifyContent: 'center', alignContent: 'center'}}>
            <Button
              style={{
                backgroundColor: '#D3D3D3',
                height: 50,
                justifyContent: 'center',
                alignContent: 'center',
                borderRadius: 8,
                width: '50%',
                alignSelf: 'center',
                marginVertical: 20,
              }}
              labelStyle={{color: '#fff'}}>
              CLOSE
            </Button>
          </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(PassBusiness);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
