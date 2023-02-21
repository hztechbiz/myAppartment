import React, {useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Keyboard,
} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import BackgroundLayout from '../components/BackgroundLayout';
import LogoBar from '../components/LogoBar';
import TitleBar from '../components/TitleBar';
import BigTile from '../components/ExBigTile';
import {connect} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {apiActiveURL, appKey, appId} from '../ApiBaseURL';
import Axios from 'axios';
import Tile from '../components/childCategoryTile';
import {
  setChildCategory,
  setChildExperience,
  setChildWhatsOn,
  setFeedback,
  setServices,
} from '../actions';
import FeedbackModal from '../components/FeedbackModal';

const ExServices = (props) => {
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
    let url = '';
    if (props.route?.params?.isAll) {
      console.log('All');
      url = `${apiActiveURL}/all_services?area=${props.area}&listing_type=6`;
      console.log(url, 'url fetch');
    } else if (props.ChildCatId == 0) {
      url = `${apiActiveURL}/services/${props.CatId}?listing_type=6&area=${props.area}`;
    } else {
      url = `${apiActiveURL}/services/${props.ChildCatId}?listing_type=6&area=${props.area}`;
    }

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
          let sortServices = res.data.data.sort((a, b) =>
            a.title.localeCompare(b.title),
          );
          setServices(sortServices);
          //props.setChildCategory(res.data.data[0].id, res.data.data[0].title);
          setLoader2(true);
          console.log(url, 'rest api 2');
        } else {
          props.setFeedback(
            'MyApartment',
            'No Data Found',
            true,
            'Experiences',
          );
          console.log(url, 'categories');
          setLoader2(false);
        }
      })
      .catch((error) => {
        props.setFeedback(
          'MyApartment',
          'Something Went Wrong...',
          true,
          'Experiences',
        );

        console.log(url, 'rest api');
      });
  };

  const getServices = (data) => {
    let sliceData = Object.values(data);
    return sliceData;
  };

  const showServices = () => {
    return (
      <>
        <ScrollView showsVerticalScrollIndicator={false}>
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
      <FeedbackModal />
      <BackgroundLayout />
      <LogoBar title="ALL" />
      <TitleBar title={props.ChildCatName} />
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
  area: state.HotelDetails.hotel.area,
  listingType: state.ListingType,
  token: state.LoginDetails.token,
  CatId: state.Experience.id,
  CatName: state.Experience.name,
  ChildCatId: state.ChildExperience.id,
  ChildCatName: state.ChildExperience.name,
});

const mapDispatchToProps = (dispatch) => ({
  setChildExperience: (id, name) => {
    const data = {
      id: id,
      name: name,
    };
    dispatch(setChildExperience(data));
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

export default connect(mapStateToProps, mapDispatchToProps)(ExServices);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
