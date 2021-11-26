import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableOpacity,
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
import Accordion from 'react-native-collapsible/Accordion';
import Icon from 'react-native-vector-icons/AntDesign'; 

const TermsConditions = (props) => {
  const [loader, setLoader] = useState(true);
  const [transactions, setTransactions] = useState('');
  const [activeSections, setActiveSections] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    fetchTransactions();
  }, [props, isFocused]);

  const fetchTransactions = () => {
    const url = `${apiActiveURL}/get_transaction?user_id=${props.userid}`;
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
        console.log('get_transaction', res);
        if (res.data.code === 200) {
          setTransactions(res.data.data);
          setLoader(false);
        } else {
          console.log('get_transaction', res);
          props.setFeedback('YourHotel', 'No Data Found', true , '');
          setLoader(false);
        }
      })
      .catch((error) => {
        props.setFeedback('YourHotel', 'No Data Found', true , '');
        setLoader(false);
        console.log('get_transaction', error);
      });
  };

  const handledate = (date) => {
    let splitdate = date.split(' ');
    return splitdate[0];
  };

  const handletime = (time) => {
    let splittime = time.split(' ');
    return splittime[1];
  };

  const renderheader = (transaction) => {
    return (
      <View style={styles.headercontainer}>
        <View style={styles.item}>
          <Text style={styles.headerText}>
            {transaction.coupon.service_name}
          </Text>
        </View>
        <View style={styles.item2}>
          <Icon name="down" size={16} color="#5a5a5a" style={{textAlign: 'right'}}/>
        </View>
      </View>
    );
  };

  const rendercontent = (transaction) => {
    return (
      <View style={styles.textcontainer}>
        <View style={styles.item}>
          <Text>Date of transaction:</Text>
          <Text>Time of transaction:</Text>
          <Text>Gross Value of transaction:</Text>
          <Text>Net Amount of transaction:</Text>
          <Text>Verification Code:</Text>
          <Text>You saved $:</Text>
        </View>

        <View style={styles.item2}>
          <Text>{handledate(transaction.created_at)}</Text>
          <Text>{handletime(transaction.created_at)}</Text>
          <Text>{transaction.discounted_amount}</Text>
          <Text>{transaction.payable_amount}</Text>
          <Text>{transaction.coupon.confirmation_code}</Text>
          <Text>
            {(
              transaction.payable_amount - transaction.discounted_amount
            ).toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  const updatesections = (activeSections) => {
    setActiveSections(activeSections);
  };

  const showTransactions = () => {
    return (
      <View
        style={{
          marginTop: 20,
          paddingHorizontal: '5.55%',
          height: '55%',
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginBottom: 10}}>
            <Accordion
              sections={transactions}
              activeSections={activeSections}
              renderHeader={renderheader}
              renderContent={rendercontent}
              onChange={updatesections}
            />
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
      <TitleBar title={'MY TRANSACTIONS'} />
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
        showTransactions()
      )}
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  hotelName: state.HotelDetails.hotel.name,
  userid: state.LoginDetails.userId,
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
  headerText: {
    fontSize: 15,
    fontWeight: '700',
  },
  headercontainer: {
    backgroundColor: 'rgb(248, 249, 250)',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    borderBottomColor: '#f0f0f0',
    borderBottomWidth: 1
  },
  textcontainer: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  item: {
    width: '70%',
  },
  item2: {
    width: '30%',
  },
});
