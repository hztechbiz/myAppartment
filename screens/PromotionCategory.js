import React, {useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Keyboard,
} from 'react-native';
import BackgroundLayout from '../components/BackgroundLayout';
import LogoBar from '../components/LogoBar';
import TitleBar from '../components/TitleBar';
import Tile from '../components/childPromotionTile';
import BigTile from '../components/ProBigTile';
import { connect } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { apiActiveURL, appKey, appId } from '../ApiBaseURL';
import Axios from 'axios';
import { setChildPromotion, setFeedback } from '../actions';
import { ActivityIndicator } from 'react-native-paper';
import FeedbackModal from '../components/FeedbackModal';

const Category = (props) => {
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
    fetchChildCategories();
  }, [props, isFocused]);

  const fetchChildCategories = () => {
    const url = `${apiActiveURL}/categories/${props.ProId}?subrub=${props.suburb}&area=${props.area}&listing_type=7`;
    const options = {
      method: 'GET',
      headers: {
        AppKey: appKey,
        Token: props.token,
        AppId: appId
      },
      url,
    };
    Axios(options)
      .then((res) => {
        if (Object.values(res.data.data).length > 0) {
          //console.log('render', props.ProId, res.data.data);
          setCategories(res.data.data);
          //props.setChildCategory(res.data.data[0].id, res.data.data[0].title);
          if (props.ChildProId == 0){
            let sliceData = Object.values(res.data.data);
          props.setChildPromotion(sliceData[0].id, sliceData[0].title);
          }
          fetchServices();
          setLoader(true);
        } else {
          props.setFeedback('YourHotel', 'No Data Found', true , '');
          //console.log(Object.values(res.data.data).length, 'categories');
          setLoader(false);
        }
      })
      .catch((error) => {
        console.log(url, 'rest api');
        props.setFeedback('YourHotel', 'Something Went Wrong...', true , '');
      });
  };

  const getChildCategories = (data) => {
    let sliceData = Object.values(data);
    //props.setChildCategory(sliceData[0].id, sliceData[0].title);
    return sliceData;
  };

  const showChildCategories = () => {
    return (
      <>
        <View style={{height: 90, marginBottom: 10}}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}>
            {getChildCategories(categories).map((category, index) => (
              <View key={index}>
                <Tile title={category.name} id={category.id} />
              </View>
            ))}
          </ScrollView>
        </View>
        
      </>
    );
  };

  const fetchServices = () => {
    const url = `${apiActiveURL}/services/${props.ChildProId}`;
    const options = {
      method: 'GET',
      headers: {
        AppKey: appKey,
        Token: props.token,
        AppId: appId
      },
      url,
    };
    Axios(options)
      .then((res) => {
        if (Object.values(res.data.data).length > 0) {
          //console.log('render', props.ProId, res.data.data);
          setServices(res.data.data);
          //props.setChildCategory(res.data.data[0].id, res.data.data[0].title);
          setLoader2(true);
          console.log(url, 'rest api');
        } else {
          //console.log(Object.values(res.data.data).length, 'categories');
          props.setFeedback('YourHotel', 'No Data Found', true , '');
          setLoader2(false);
        }
      })
      .catch((error) => {
        console.log(url, 'rest api');
        props.setFeedback('YourHotel', 'Something Went Wrong...', true , '');
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
      <FeedbackModal/>
      <BackgroundLayout />
      <LogoBar title={props.hotelName} />
      <TitleBar title={`PROMOTION CATEGORY TITLE`} sub={true} />
      <View
        style={{
          height: SView,
          marginTop: 20,
          paddingLeft: '5.55%',
          paddingRight: '5.55%',
        }}>
        {loader === false ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: 90, marginBottom: 10}}>
          <ActivityIndicator animating={true} color="#D3D3D3" />
        </View>
      ) : (
        showChildCategories()
      )}
      {loader2 === false ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: 90, marginBottom: 10}}>
          <ActivityIndicator animating={true} color="#D3D3D3" />
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
 ProId: state.Promotion.id,
 ProName: state.Promotion.name,
 ChildProId: state.ChildPromotion.id,
 suburb: state.HotelDetails.suburb,
 area: state.HotelDetails.hotel.area,
});

const mapDispatchToProps = (dispatch) => ({
  setChildPromotion: (id , name) => {
   const data = {
     id: id,
     name: name,
   };
   dispatch(setChildPromotion(data));
 },
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

export default connect(mapStateToProps, mapDispatchToProps)(Category);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
