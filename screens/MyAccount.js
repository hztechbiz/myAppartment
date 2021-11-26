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
import {setFeedback,} from '../actions';
import FeedbackModal from '../components/FeedbackModal';
import Pdf from 'react-native-pdf';

const MyAccount = (props) => {

  const [accounts, setAccounts] = useState([
    {
    'id': 1,
    'title': 'My Details',
    'route': 'MyDetails',
    },
    {
    'id': 2,
    'title': 'My Transactions',
    'route': 'MyTransactions',
    },
    {
    'id': 3,
    'title': 'Terms & Conditions',
    'route': 'TermsConditions',
    },
    {
    'id': 4,
    'title': 'Privacy Policy',
    'route': 'PrivacyPolicy',
    },
    {
    'id': 5,
    'title': 'Contact ClubLocal',
    'route': 'ContactClubLocal',
    },
  ]);

  const [SView, setSView] = React.useState('50%');
  const [loader, setLoader] = React.useState(true);
  const [msgTitle, setMsgTitle] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [visible, setVisible] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [pdfuri, setPdfUri] = useState({uri: ''});
  const [pdfmodal, setPdfModal] = useState(false);
  const [pdfloader, setPdfLoader] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      return;
    }
  }, [props, isFocused]);

  const handleNavigate = (route) => {
    if(route == 'TermsConditions'){
      handleShowPDF(Platform.OS == 'ios' ? require('./../assets/pdfs/YourHotel_Membership_Terms_and_Conditions.pdf') : {uri:'bundle-assets://YourHotel_Membership_Terms_and_Conditions.pdf', cache: true} , 'Terms & Conditions')
    }else if(route == 'PrivacyPolicy'){
      handleShowPDF(Platform.OS == 'ios' ? require('./../assets/pdfs/YourHotel_Privacy_Policy.pdf') : {uri:'bundle-assets://YourHotel_Privacy_Policy.pdf', cache: true} , 'Privacy Policy')
    }else{
      props.navigation.navigate(route);
    }
  }

  const containerStyle = {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
    margin: 20,
  };

  const handleShowPDF = (url, title) => {
    setMsgTitle(title);
    setPdfLoader(true);
    setPdfUri(url);
    setPdfModal(true);
    setPdfLoader(false)
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
        {/* <Title
            style={{
              fontSize: 18,
              textAlign: 'center',
              color: '#e57b0d',
            }}>
            {msgTitle}
          </Title> */}

      {pdfloader === true ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator animating={true} color="#D3D3D3" />
        </View>
      ) : (
        
          <Pdf
        source={pdfuri}
        onLoadComplete={(numberOfPages,filePath)=>{
          console.log(`number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page,numberOfPages)=>{
            console.log(`current page: ${page}`);
        }}
        onError={(error)=>{
            console.log(error);
        }}
        onPressLink={(uri)=>{
            console.log(`Link presse: ${uri}`)
        }}
        // singlePage={false}
        // page={4}
        style={styles.pdf}/>
      )}
        </ScrollView>
        <Dialog.Actions>  
          <Button onPress={hideModalPDF}>Close</Button>
        </Dialog.Actions>
      </Modal>
    </Portal>
    );
  };


  const showAccountBtns = () => {
    return (
      <View
        style={{
          marginTop: 20,
          paddingLeft: '5.55%',
          paddingRight: '5.55%',
        }}>
        <View style={styles.btnCenter}>
          <TouchableOpacity style={styles.btn} onPress={() => props.navigation.navigate('MyCoupons')}>
            <Text style={{color: '#fff'}}>My Vouchers & Coupons</Text>
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {accounts.map((account, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleNavigate(account.route)}
                style={{
                  flexDirection: 'row',
                  paddingTop: 20,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                  }}>
                  {account.title}
                </Text>
                <Icon_FA_5
                  name={'angle-right'}
                  size={15}
                  color="#000"
                  style={{alignSelf: 'center', right: 0, position: 'absolute'}}
                />
              </TouchableOpacity>
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
      <LogoBar title={props.hotelName} />
      <TitleBar title={'MY ACCOUNT'} />
      {showPDF()}
      {showAccountBtns()}
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

export default connect(mapStateToProps, mapDispatchToProps)(MyAccount);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  btn: {
    marginVertical: 5,
    backgroundColor: '#32CD32',
    color: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  btnCenter:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdf: {
    // flex:1,
    alignSelf: 'center',
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height * 0.7,
  }
});
