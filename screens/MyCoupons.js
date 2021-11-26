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
import Tile from '../components/VoucherTile';
import {setFeedback} from '../actions';
import FeedbackModal from '../components/FeedbackModal';

const MyCoupons = (props) => {
  const [SView, setSView] = useState('50%');
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
  }, [props, isFocused]);

  const _keyboardDidShow = () => {
    setSView('28%');
  };

  const _keyboardDidHide = () => {
    setSView('50%');
  };

  const showCoupons = () => {
    return (
      <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
        <View style={{width: '50%', marginBottom: 8}}>
          <Tile title="MY FAVOURITES" nav="Discount Pass" />
        </View>

        <View style={{width: '50%', marginBottom: 8}}>
          <Tile title="SPECIAL PROMOTIONS" nav="Special Promotions"  />
        </View>

        <View style={{width: '50%', marginBottom: 8}}>
          <Tile title="MY 360 PASS COUPONS" nav="My Pass"  />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FeedbackModal />
      <BackgroundLayout />
      <LogoBar />
      <TitleBar
        title={`MY VOUCHERS &
COUPONS`}
        sub={true}
      />
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

export default connect(mapStateToProps, mapDispatchToProps)(MyCoupons);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
