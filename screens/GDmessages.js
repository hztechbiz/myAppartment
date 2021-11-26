import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Keyboard,
  Image,
  Dimensions
} from 'react-native';
import BackgroundLayout from '../components/BackgroundLayout';
import LogoBar from '../components/LogoBar';
import TitleBar from '../components/TitleBar';
import { connect } from 'react-redux';
import {
  ActivityIndicator,
  Modal,
  Portal,
  withTheme,
  Title,
  Text,
} from 'react-native-paper';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { apiActiveURL, appKey, appId } from '../ApiBaseURL';
import BigTile from '../components/BigTile';
import { setFeedback } from '../actions';
import FeedbackModal from '../components/FeedbackModal';

const screenWidth = Dimensions.get('window').width;

const PopularServices = (props) => {
  const [SView, setSView] = useState('50%');
  const [popularservices, setPopularServices] = useState([]);
  const [loader, setLoader] = useState(true);
  const [visible, setVisible] = useState(false);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginHorizontal: 20,
  };
  const isFocused = useIsFocused();

  useEffect(() => {
    //fetchPopularServices();
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
    setPopularServices([]);
    setLoader(true);
    //fetchPopularServices();
  }, [props, isFocused]);

  const _keyboardDidShow = () => {
    setSView('28%');
  };

  const _keyboardDidHide = () => {
    setSView('50%');
  };

  const fetchPopularServices = () => {
    const url = `${apiActiveURL}/service/popular/${props.route.params.listingType}`;
    const options = {
      method: 'GET',
      headers: {
        AppKey: appKey,
        Token: props.token,
        AppId: appId
      },
      url,
    };
    axios(options)
      .then((res) => {
        console.log('popularservices', props.route.params.listingType, res);
        if (Object.values(res.data.data).length > 0) {
          setPopularServices(res.data.data);
          setLoader(false);
        } else {
          console.log('popularservices', props.route.params.listingType, res);
        //   setMsgTitle('ClubLocal');
        props.setFeedback('YourHotel', 'No Data Found', true , '');
          //props.navigation.goBack();
        //   setVisible(true);
          setLoader(false);
        }
      })
      .catch((error) => {
        // setMsgTitle('ClubLocal');
        props.setFeedback('YourHotel', 'Something Went Wrong...', true , '');
        //props.navigation.goBack();
        // setVisible(true);
        setLoader(false);
        console.log(error, 'popularservices api');
      });
  };

//   const showMessageModal = () => {
//     return (
//       <Portal>
//         <Modal
//           visible={visible}
//           onDismiss={hideModal}
//           contentContainerStyle={containerStyle}>
//           <Title
//             style={{
//               fontSize: 18,
//               textAlign: 'center',
//               color: props.theme.colors.accent,
//               paddingBottom: 15,
//             }}>
//             {msgTitle}
//           </Title>
//           <Text style={{ textAlign: 'center' }}>{msgBody}</Text>
//         </Modal>
//       </Portal>
//     );
//   };

  const showPopularServices = () => {
    return (
      <View
        style={{
          height: SView,
          marginTop: 20,
          paddingLeft: '5.55%',
          paddingRight: '5.55%',
        }}>
        {/* <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
            {getPopularServices(popularservices).map((popularservice, index) => (
              <View
                key={index}
                style={{ flexBasis: '50%', paddingHorizontal: 5 }}>
                <BigTile services={popularservice} />
              </View>
            ))}
          </View>
        </ScrollView> */}
        <Image
          source={require('../images/Hotel360-assets/comingsoon.png')}
          style={{
            height: 200,
            width: screenWidth * 0.89,
            marginTop: 15,
            resizeMode: 'cover',
            //marginHorizontal: '5.55%',
          }}
        />
      </View>
    );
  };

  const getPopularServices = (data) => {
    let sliceData = Object.values(data);
    return sliceData;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FeedbackModal/>
      <BackgroundLayout />
      <LogoBar
        title={`360 PASS
PARTNERS`}
      />
      <TitleBar title={'Guest Directory'}/>

      {loader === false ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator animating={true} color="#6697D2" />
        </View>
      ) : (
        showPopularServices()
        )}
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  //listingType: state.ListingArea.listingType,
  token: state.LoginDetails.token,
  //area: state.ListingArea.area,
});

const mapDispatchToProps = (dispatch) => ({
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

export default withTheme(
  connect(mapStateToProps, mapDispatchToProps)(PopularServices),
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  touchableBox_right: {
    borderWidth: 1,
    borderColor: '#cac8c8',
    borderRadius: 10,
    paddingVertical: 20,
    flexBasis: '46.75%',
    backgroundColor: '#fff',
    marginTop: '5%',
    marginHorizontal: 5,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
});