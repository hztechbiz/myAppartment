import React, {useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import {ActivityIndicator, Button} from 'react-native-paper';
import BackgroundLayout from '../components/BackgroundLayout';
import LogoBar from '../components/LogoBar';
import TitleBar from '../components/TitleBar';
import BigTile from '../components/GDBigTile';
import {connect} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {apiActiveURL, appKey, appId} from '../ApiBaseURL';
import Axios from 'axios';
import Tile from '../components/childCategoryTile';
import {
  setChildCategory,
  setChildExperience,
  setChildGD,
  setChildWhatsOn,
  setFeedback,
  setServices,
} from '../actions';
import FeedbackModal from '../components/FeedbackModal';

const GDServices = (props) => {
  const [SView, setSView] = React.useState('50%');

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

  const [categories, setCategories] = React.useState([]);
  const [services, setServices] = React.useState([]);
  const [loader, setLoader] = React.useState(false);
  const [loader2, setLoader2] = React.useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    fetchServices();
  }, [props, isFocused]);

  // const fetchChildCategories = () => {
  //   const url = `${apiActiveURL}/categories/${props.CatId}`;
  //   const options = {
  //     method: 'GET',
  //     headers: {
  //       AppKey: appKey,
  //       Token: props.token,
  //       AppId: appId
  //     },
  //     url,
  //   };
  //   Axios(options)
  //     .then((res) => {
  //       if (Object.values(res.data.data).length > 0) {
  //         //console.log('render', props.catID, res.data.data);
  //         setCategories(res.data.data);
  //         //props.setChildCategory(res.data.data[0].id, res.data.data[0].title);
  //         if (props.ChildCatId == 0){
  //           let sliceData = Object.values(res.data.data);
  //         props.setChildCategory(sliceData[0].id, sliceData[0].title);
  //         }
  //         fetchServices();
  //         setLoader(true);
  //       } else {
  //         //console.log(Object.values(res.data.data).length, 'categories');
  //         setLoader(false);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(url, 'rest api');
  //     });
  // };

  // const getChildCategories = (data) => {
  //   let sliceData = Object.values(data);
  //   //props.setChildCategory(sliceData[0].id, sliceData[0].title);
  //   return sliceData;
  // };

  // const showChildCategories = () => {
  //   return (
  //     <>
  //       <View style={{height: 90, marginBottom: 10}}>
  //         <ScrollView
  //           horizontal={true}
  //           showsHorizontalScrollIndicator={false}
  //           scrollEventThrottle={16}>
  //           {getChildCategories(categories).map((category, index) => (
  //             <View key={index}>
  //               <Tile title={category.name} id={category.id} />
  //             </View>
  //           ))}
  //         </ScrollView>
  //       </View>

  //     </>
  //   );
  // };

  const fetchServices = () => {
    let url = `${apiActiveURL}/services?listing_type=10&hotel_id=${props.hotelId}`;
    // if(props.ChildCatId == 0){
    //   url = `${apiActiveURL}/services/${props.CatId}`;
    // }else{
    //   url = `${apiActiveURL}/services/${props.ChildCatId}`;
    // }

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
        if (Object.values(res.data.data).length > 0) {
          console.log('render', res.data.data);
          let sortServices = res.data.data.sort((a, b) => a.display_order - b.display_order);
          setServices(sortServices);
          //props.setChildCategory(res.data.data[0].id, res.data.data[0].title);
          setLoader2(true);
          console.log(url, 'rest api 2');
        } else {
          props.setFeedback(
            'YourHotel',
            'No Data Found...',
            true,
            'Me',
          );
          console.log(url, 'categories');
          setLoader2(false);
        }
      })
      .catch((error) => {
        props.setFeedback(
          'YourHotel',
          'Something Went Wrong.',
          true,
          'Me',
        );

        console.log(url, 'rest api');
      });
  };

  const getServices = (data) => {
    let sliceData = Object.values(data);
    return sliceData;
  };

  const messageBtn = () => {
    return (
      <>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            //flexWrap: 'wrap',
            marginBottom: 10,
            //marginHorizontal: '5.55%'
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#6697D2',
              height: 60,
              width: '31.5%',
              borderRadius: 10,
              //marginLeft: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              props.navigation.navigate('GDmessages');
            }}
          >
            <Text
              style={{
                paddingHorizontal: 5,
                color: '#fff',
                textAlign: 'center',
                fontSize: 12,
              }}>
              Messages from Hotel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#6697D2',
              height: 60,
              width: '31.5%',
              borderRadius: 10,
              marginLeft: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              props.navigation.navigate('GDmessages');
            }}
          >
            <Text
              style={{
                paddingHorizontal: 5,
                color: '#fff',
                textAlign: 'center',
                fontSize: 12,
              }}>
              Messages to Hotel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#6697D2',
              height: 60,
              width: '31.5%',
              borderRadius: 10,
              marginLeft: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              props.navigation.navigate('GDmessages');
            }}
          >
            <Text
              style={{
                paddingHorizontal: 5,
                color: '#fff',
                textAlign: 'center',
                fontSize: 12,
              }}>
              Hotel Deals
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const showServices = () => {
    return (
      <>
        <ScrollView showsVerticalScrollIndicator={false}>
          {messageBtn()}
          <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
            {getServices(services).map((services, index) => (
              <View
                key={index}
                style={{flexBasis: '50%', paddingHorizontal: 0}}>
                <BigTile services={services} />
              </View>
            ))}
          </View>
        </ScrollView>
      </>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <BackgroundLayout />
      <FeedbackModal />
      <LogoBar title={props.hotelName} />
      <TitleBar title={`Property Information`} isGD={true} />
      <View
        style={{
          height: SView,
          marginTop: 20,
          paddingLeft: '5.55%',
          paddingRight: '5.55%',
        }}>
        {/* {loader === false ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: 90, marginBottom: 10}}>
          <ActivityIndicator animating={true} color="#6697D2" />
        </View>
      ) : (
        showChildCategories()
      )} */}
        {loader2 === false ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              height: 90,
              marginBottom: 10,
            }}>
            <ActivityIndicator animating={true} color="#6697D2" />
          </View>
        ) : (
          showServices()
        )}
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  hotelName: state.HotelDetails.hotel.name,
  // hotelId: state.HotelDetails.hotel.id,
  // listingType: state.ListingType,
  token: state.LoginDetails.token,
  CatId: state.GuestDirectory.id,
  CatName: state.GuestDirectory.name,
  ChildCatId: state.ChildGuestD.id,
  hotelId: state.HotelDetails.hotel.id,
  suburb: state.HotelDetails.suburb,
  area: state.HotelDetails.hotel.area,
  carouselCurrentIndex: state.CarouselIndexAll.carouselCurrentIndexAll,
});

const mapDispatchToProps = (dispatch) => ({
  setChildGD: (id, name) => {
    const data = {
      id: id,
      name: name,
    };
    dispatch(setChildGD(data));
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

export default connect(mapStateToProps, mapDispatchToProps)(GDServices);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
