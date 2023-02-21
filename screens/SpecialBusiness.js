import React, {useEffect, useState} from 'react';
import axios from 'axios';
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
import BackgroundLayout from '../components/BackgroundLayout';
import {apiActiveURL, appKey, appId} from '../ApiBaseURL';
import LogoBar from '../components/LogoBar';
import TitleBar from '../components/TitleBar';
import {connect} from 'react-redux';
import {setFeedback} from '../actions';
import HTML from 'react-native-render-html';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const statusBar = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const SpecialBusiness = (props) => {
  const [bill, setBill] = useState('');
  const [netamount, setNetAmount] = useState(0.0);
  const [SView, setSView] = useState('40%');
  const [msgTitle, setMsgTitle] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [loader, setLoader] = useState(false);
  const [visible, setVisible] = useState(false);
  const [confirmationcode, setConfirmationCode] = useState('');

  const containerStyle = {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginHorizontal: 20,
  };

  useEffect(() => {
    setConfirmationCode(generateConfirmationCode(6));
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

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

  const _keyboardDidShow = () => {
    setSView('28%');
  };

  const _keyboardDidHide = () => {
    setSView('50%');
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
      setMsgBody('Please enter net amount value.');
      setVisible(true);
      return;
    } else if (confirmationcode == '') {
      setMsgTitle('MyApartment');
      setMsgBody("Please tap 'Verify' again to confirm your purchase");
      setVisible(true);
      return;
    }
    setLoader(true);
    setMsgTitle('MyApartment');
    setVisible(true);
    const url = `${apiActiveURL}/add_transaction`;
    let ApiParamForTransaction = {
      coupon_id: props.route.params.id,
      payable_amount: bill,
      discounted_amount: 0,
      confirmation_code: confirmationcode,
    };
    console.log(ApiParamForTransaction, props.route.params.route);
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
            'Special Promotions',
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundLayout />
      <LogoBar
        title={`360COUPON`}
        color="#650d88"
        borderWidth={5}
        borderColor="#D3D3D3"
      />
      <TitleBar title={props.route.params.title} />
      {props.route.params.description.includes('<p>') ? (
        <>
          <HTML
            tagsStyles={{
              p: {
                // marginVertical: 20,
                // marginHorizontal: '8%',
                // textAlign: 'center',
                paddingHorizontal: '5.55%',
                fontSize: 14,
                fontWeight: '700',
              },
            }}
            source={{
              html:
                props.route.params.description == ''
                  ? '<p></p>'
                  : props.route.params.description,
            }}
          />
        </>
      ) : (
        <>
          <Text
            style={{
              // textAlign: 'center',
              paddingHorizontal: '5.55%',
              fontSize: 14,
              fontWeight: '700',
              paddingVertical: 5,
              // color: '#6b6b6b',
            }}>
            {props.route.params.description}
          </Text>
        </>
      )}
      {showModal()}
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
              marginVertical: 10,
            }}></View>
          <View style={{justifyContent: 'center', alignContent: 'center'}}>
            <Text style={{textAlign: 'center', fontWeight: '700'}}>
              AMOUNT PAYABLE
            </Text>
            <TextInput
              style={{
                color: '#838e9d',
                backgroundColor: '#f0f3f7',
                marginTop: 6,
                borderRadius: 5,
                textAlign: 'center',
                marginBottom: 5,
                height: 45,
              }}
              keyboardType="numeric"
              // maxLength={5}
              onChangeText={(text) => handleChangeBill(text)}
              value={bill}
              placeholder="Enter Value"
              placeholderTextColor="#838e9d"
            />

            <Text style={{textAlign: 'center', fontWeight: '700'}}>
              Show your TEAM Marketing coupon to your Server and then tap verify
              below
            </Text>
          </View>

          <View
            style={{
              borderTopColor: '#edf0f5',
              borderTopWidth: 1,
              marginVertical: 15,
            }}></View>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '700',
              paddingVertical: 5,
            }}>
            Terms & Conditions
          </Text>
          <Text
            style={{
              // textAlign: 'center',
              paddingHorizontal: 15,
              paddingVertical: 15,

              color: '#6b6b6b',
            }}>
            {props.route.params.terms}
          </Text>
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
                  fontSize: 25,
                  fontWeight: '700',
                  lineHeight: 38,
                }}>
                {confirmationcode}
              </Text>
            </View>
          </View>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <Button
              onPress={() => {
                props.navigation.goBack();
              }}
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
            <View style={{flexDirection: 'column'}}>
              <Text style={{marginTop: 20, textAlign: 'left', width: 150}}>
                Expiry Date
              </Text>
              <Text style={{textAlign: 'left', width: 150, fontWeight: 'bold'}}>
                {props.route.params.expiry}
              </Text>
            </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(SpecialBusiness);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
