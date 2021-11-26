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
import Tile from '../components/ProCatTile';

const PromoCategories = (props) => {

  const [SView, setSView] = useState('50%');
  const showCoupons = () => {
    return (
      <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
        <View style={{ width: '50%', marginBottom: 8 ,alignItems: 'center'}}>
          <Tile title="EXPERIENCES" listingtype="6" />
        </View>

        <View style={{ width: '50%', marginBottom: 8 ,alignItems: 'center'}}>
          <Tile title="OTHER" listingtype="9" />
        </View>

        <View style={{ width: '50%', marginBottom: 8 ,alignItems: 'center'}}>
          <Tile title="RESTAURANTS & EATERIES" listingtype="5" />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FeedbackModal />
      <BackgroundLayout />
      <LogoBar title={props.hotelName} />
      <TitleBar title={`SPECIAL PROMOTIONS${'\n'}& OFFERS`} />
      <View
        style={{
          height: SView,
          marginTop: 20,
          paddingLeft: '5.55%',
          paddingRight: '5.55%',
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {showCoupons()}
        </ScrollView>
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(PromoCategories);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
