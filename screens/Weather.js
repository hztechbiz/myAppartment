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
import {setFeedback} from '../actions';
import FeedbackModal from '../components/FeedbackModal';
import Pdf from 'react-native-pdf';

const Weather = (props) => {
  const [SView, setSView] = React.useState('50%');
  const [loader, setLoader] = React.useState(true);
  const [pdfloader, setPdfLoader] = useState(false);
  const [msgTitle, setMsgTitle] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [visible, setVisible] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [howtobtns, setHowToBtns] = useState([]);
  const [pdfuri, setPdfUri] = useState({uri: ''});
  const [pdfmodal, setPdfModal] = useState(false);
  const [weather, setWeather] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    fetchWeather();
    // fetchHowto();
  }, [props, isFocused]);

  const containerStyle = {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
    margin: 20,
  };

  const regions = {
    Sydney: 'CITY_SYDNEY',
    Melbourne: 'CITY_MELBOURNE',
    Brisbane: 'CITY_BRISBANE',
    Canberra: 'CITY_CANBERRA',
    Darwin: 'CITY_DARWIN',
    Hobart: 'CITY_HOBART',
    'Gold Coast': 'CITY_GOLD_COAST',
    Perth: 'CITY_PERTH',
    Adelaide: 'CITY_ADELAIDE',
    Perth: 'CITY_BYRON_BAY',
    'Hunter Region': 'CITY_HUNTER_REGION',
    'Southern Highlands': 'CITY_SOUTHERN_HIGHLANDS',
    'Central Coast': 'CITY_CENTRAL_COAST',
    'Maclaren Vale': 'CITY_MACLAREN_VALE',
    'Tweed Heads': 'CITY_TWEED_HEADS',
    'Sunshine Coast': 'CITY_SUNSHINE_COAST',
  };

  const fetchWeather = () => {
    let region = '';
    if (props.cityName) {
      // region = props.cityName.split('/');
      console.log(props.cityName, 'props.cityName');
      region = props.cityName;
      if (!region) {
        props.setFeedback('MyApartment', 'No Data Found...', true, '');
        return null;
      }
    } else {
      props.setFeedback('MyApartment', 'No Data Found...', true, '');
      return null;
    }
    region = regions[region];
    if (!region) {
      props.setFeedback('MyApartment', 'No Data Found...', true, '');
      return null;
    } else {
      const url = `https://mb.ask-me-2.com.au/api/v3/get_weather/${region}`;
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
          console.log('weather', res);
          if (res.data.code === 200) {
            setWeather(res.data.data.channel.item);
            console.log('weather', res.data.data.channel.item);
            setLoader(false);
          } else {
            console.log('weather', res);
            props.setFeedback('MyApartment', 'No Data Found...', true, '');
            // setLoader(false);
          }
        })
        .catch((error) => {
          props.setFeedback('MyApartment', 'No Data Found...', true, '');
          setLoader(false);
          console.log('weather', error);
        });
    }
    console.log(region, 'area');
  };

  return (
    <SafeAreaView style={styles.container}>
      <FeedbackModal />
      <BackgroundLayout />
      <LogoBar title={props.hotelName} />
      <TitleBar title={'LOCAL WEATHER'} />
      <View
        style={{
          height: SView,
          marginTop: 20,
          paddingLeft: '5.55%',
          paddingRight: '5.55%',
        }}>
        {loader === true ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              height: 90,
              marginBottom: 10,
            }}>
            <ActivityIndicator animating={true} color="#D3D3D3" />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                // flex: 1,
                alignContent: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  backgroundColor: 'rgba(229,124,11,0.5)',
                  width: 300,
                  height: 300,
                  alignSelf: 'center',
                  alignContent: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 20,
                  borderRadius: 150,
                }}>
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 14,
                  }}>
                  Current Conditions:
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    paddingBottom: 10,
                    fontSize: 55,
                    fontWeight: 'bold',
                    color: 'black',
                  }}>
                  {weather[0]['w:current']['@temperature']}°C
                </Text>
                <View
                  style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 2,
                    width: '30%',
                    alignSelf: 'center',
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    paddingVertical: 10,
                  }}>
                  <Text style={[styles.boldText, styles.centerText]}>
                    Dew Point:
                  </Text>
                  <Text style={styles.centerText}>
                    {' '}
                    {weather[0]['w:current']['@dewPoint']},{' '}
                  </Text>
                  <Text style={[styles.boldText, styles.centerText]}>
                    Relative Humidity:
                  </Text>
                  <Text style={styles.centerText}>
                    {' '}
                    {weather[0]['w:current']['@humidity']}%,{' '}
                  </Text>
                  <Text style={[styles.boldText, styles.centerText]}>
                    Wind Speed:
                  </Text>
                  <Text style={styles.centerText}>
                    {' '}
                    {weather[0]['w:current']['@windSpeed']} km/h,{' '}
                  </Text>
                  <Text style={[styles.boldText, styles.centerText]}>
                    Wind Gust:
                  </Text>
                  <Text style={styles.centerText}>
                    {' '}
                    {weather[0]['w:current']['@windGusts']} km/h,{' '}
                  </Text>
                  <Text style={[styles.boldText, styles.centerText]}>
                    Wind Direction:
                  </Text>
                  <Text style={styles.centerText}>
                    {' '}
                    {weather[0]['w:current']['@windDirection']},{' '}
                  </Text>
                  <Text style={[styles.boldText, styles.centerText]}>
                    Pressure:
                  </Text>
                  <Text style={styles.centerText}>
                    {' '}
                    {weather[0]['w:current']['@pressure']} hPa,{' '}
                  </Text>
                  <Text style={[styles.boldText, styles.centerText]}>
                    Rain Since 9AM:
                  </Text>
                  <Text style={styles.centerText}>
                    {' '}
                    {weather[0]['w:current']['@rain']}mm{' '}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 20,
                  flexWrap: 'wrap',
                }}>
                <View
                  style={{
                    backgroundColor: 'rgba(139,209,42,0.7)',
                    flexBasis: '48%',
                    height: 120,
                    alignContent: 'center',
                    justifyContent: 'center',
                    marginRight: 5,
                  }}>
                  <Text style={[styles.centerText, {fontSize: 22}]}>
                    {weather[1]['w:forecast'][0]['@day']}
                  </Text>
                  <Text style={[styles.centerText]}>
                    {weather[1]['w:forecast'][0]['@description']}
                  </Text>
                  <Text
                    style={[
                      styles.centerText,
                    ]}>{`${weather[1]['w:forecast'][0]['@min']} - ${weather[1]['w:forecast'][0]['@max']}`}</Text>
                </View>
                <View
                  style={{
                    backgroundColor: 'rgba(139,209,42,0.7)',
                    flexBasis: '48%',
                    height: 120,
                    alignContent: 'center',
                    justifyContent: 'center',
                    marginLeft: 5,
                  }}>
                  <Text style={[styles.centerText, {fontSize: 22}]}>
                    {weather[1]['w:forecast'][1]['@day']}
                  </Text>
                  <Text style={[styles.centerText]}>
                    {weather[1]['w:forecast'][1]['@description']}
                  </Text>
                  <Text
                    style={[
                      styles.centerText,
                    ]}>{`${weather[1]['w:forecast'][1]['@min']} - ${weather[1]['w:forecast'][1]['@max']}`}</Text>
                </View>
                <View
                  style={{
                    backgroundColor: 'rgba(139,209,42,0.7)',
                    flexBasis: '48%',
                    height: 120,
                    alignContent: 'center',
                    justifyContent: 'center',
                    marginRight: 5,
                    marginTop: 10,
                  }}>
                  <Text style={[styles.centerText, {fontSize: 22}]}>
                    {weather[1]['w:forecast'][2]['@day']}
                  </Text>
                  <Text style={[styles.centerText]}>
                    {weather[1]['w:forecast'][2]['@description']}
                  </Text>
                  <Text
                    style={[
                      styles.centerText,
                    ]}>{`${weather[1]['w:forecast'][2]['@min']} - ${weather[1]['w:forecast'][2]['@max']}`}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  hotelName: state.HotelDetails.hotel.name,
  cityName: state.HotelDetails.hotel.area,
  // hotelId: state.HotelDetails.hotel.id,
  // listingType: state.ListingType,
  token: state.LoginDetails.token,
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

export default connect(mapStateToProps, mapDispatchToProps)(Weather);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  howtobtn: {
    backgroundColor: '#D3D3D3',
    paddingVertical: 10,
    width: '48%',
    marginHorizontal: 3,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  howtotext: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  centerText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
  },
});
