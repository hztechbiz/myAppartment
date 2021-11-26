import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import BackgroundLayout from '../components/BackgroundLayout';
import LogoBar from '../components/LogoBar';
import TitleBar from '../components/TitleBar';
import {connect} from 'react-redux';
import {apiActiveURL, appKey, appId} from '../ApiBaseURL';
import Axios from 'axios';
import {useIsFocused} from '@react-navigation/native';
import {ActivityIndicator, Button} from 'react-native-paper';
import GDTile from '../components/GDTile';
import {setChildExperience, setChildGD, setFeedback} from '../actions';
import FeedbackModal from '../components/FeedbackModal';
import {SliderBox} from 'react-native-image-slider-box';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const statusBar = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const GuestDirectory = (props) => {
  const [categories, setCategories] = React.useState([]);
  const [loader, setLoader] = React.useState(false);
  const [loader2, setLoader2] = React.useState(true);
  const isFocused = useIsFocused();
  const [featuredpromotion, setFeaturedPromotion] = useState(
    require('../images/Placeholder.png'),
  );
  const [featuredserviceid, setFeaturedServiceId] = useState([]);
  const [featuredservicetitle, setFeaturedServiceTitle] = useState([]);
  const [sliderImages, setSliderImages] = useState([]);

  useEffect(() => {
    if (!isFocused) {
      setSliderImages([]);
      setFeaturedServiceId([]);
      setFeaturedServiceTitle([]);
      return;
    }
    fetchCategories();
    fetchFeaturedPromotion();
  }, [props]);
  

  const fetchCategories = () => {
    const url = `${apiActiveURL}/categories?subrub=${props.suburb}&hotel_id=${props.hotelId}&listing_type=1`;
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
          //console.log('render', props.catID, res.data.data);
          let sortCategories = res.data.data.sort((a, b) => a.display_order - b.display_order);
          setCategories(sortCategories);
          props.setChildGD(0, '');
          setLoader(true);
        } else {
          console.log(Object.values(res.data.data).length, 'categories');
          props.setFeedback('YourHotel', 'Something Went Wrong...', true , '');
          setLoader(false);
          
        }
      })
      .catch((error) => {
        console.log(url, 'rest api');
        props.setFeedback('YourHotel', 'Something Went Wrong...', true , '');
      });
  };

  const getCategories = (data) => {
    let sliceData = Object.values(data);
    return sliceData;
  };

  const fetchFeaturedPromotion = () => {
    const url = `${apiActiveURL}/featured_promotion/${1}`;
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
        console.log('featured_promotion', props.listingType, res);
        if (res.data.code === 200) {
          if (res.data.hasOwnProperty('data')) {
            //featured_promotion work
            if (Object.values(res.data.data).length > 0) {
              Object.values(res.data.data).map((data, index) => {
                if (data.hasOwnProperty('meta')) {
                  let featuredImage = data.meta.find(
                    (o) => o.meta_key === 'background_image',
                  );
                  console.log(featuredImage, 'test');
                  if (featuredImage !== undefined) {
                    sliderImages.push({uri: featuredImage.meta_value});
                    console.log({uri: featuredImage.meta_value});
                    featuredserviceid.push(featuredImage.service_id);
                    featuredservicetitle.push(data.title);
                  } else {
                    sliderImages.push(require('../images/Placeholder.png'));
                  }
                }
              });
            } else {
              sliderImages.push(require('../images/Placeholder.png'));
            }
            setLoader2(false);
          }
        } else {
          console.log('featured_promotion', props.listingType, res);
          sliderImages.push(require('../images/Placeholder.png'));
          props.setFeedback('YourHotel', 'Feature Promotion Image Not Found...', true , '');
          setLoader2(false);
        }
      })
      .catch((error) => {
        //setMsgTitle('ClubLocal');
        props.setFeedback('YourHotel', 'Something Went Wrong...', true , '');
        //setVisible(true);
        console.log(error, 'featured_promotion api');
        setLoader2(false);
      });
  };
  const handleNavigatePromoDetail = (Id, Title) => {
    if (featuredserviceid.length > 0) {
      props.navigation.navigate('Promotions', {
        screen: 'Promotion Business',
        params: {promoid: Id, promotitle: Title, screen: 'promotion'},
      });
    } else {
      props.setFeedback(
        'YourHotel',
        'Sorry, No Feature Promotions Available',
        true,
        '',
      );
    }
  };


  const showPromotions = () => {
    return (
      <>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}>
          {getCategories(categories).map((category, index) => (
            <View key={index}>
              {/* <Tile title={category.name} id={category.id} /> */}
              <GDTile title={category.name} id={category.id} />
            </View>
          ))}
        </ScrollView>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FeedbackModal />
      <BackgroundLayout />
      <LogoBar title={props.hotelName} />
      <TitleBar title={`GUEST DIRECTORY`} sub={true} />
      <View
        style={{
          height: '55%',
          //marginTop: 20,
          //   paddingLeft: '5.55%',
          //   paddingRight: '5.55%',
        }}>
        <ScrollView>
          <View style={{height: 90, marginTop: 20, paddingLeft: '5.55%'}}>
            {loader === false ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator animating={true} color="#D3D3D3" />
              </View>
            ) : (
              showPromotions()
            )}
          </View>
          {/* <TouchableOpacity onPress={() => handleNavigatePromoDetail()}>
          <Image
            source={featuredpromotion}
            style={{
              height: 200,
              width: screenWidth * 0.89,
              marginTop: 15,
              resizeMode: 'cover',
              marginHorizontal: '5.55%',
            }}
          />
          </TouchableOpacity> */}
          {loader2 === true ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 200,
                }}>
                <ActivityIndicator animating={true} color="#D3D3D3" />
              </View>
            ) : (
              <>
                  <Text style={styles.featuredPromotion}>Featured Promotions</Text>
                  <Text style={[styles.featuredPromotion, {
                    fontSize: 22,
                    // alignSelf: 'center',
                    textTransform: 'capitalize',
                    marginTop: 0,
                  }]}>
                    {featuredPromotion[currentIndex]?.name} 
                  </Text>
                  <SliderBox
                    underlayColor="transparent"
                    ImageComponentStyle={{
                      height: 155,
                      marginTop: 12,
                      resizeMode: 'cover',
                      marginHorizontal: '5.55%',
                      width: screenWidth * 0.89,
                    }}
                    imageLoadingColor="#D3D3D3"
                    sliderBoxHeight={155}
                    images={sliderImages}
                    onCurrentImagePressed={(index) =>
                      handleNavigatePromoDetail(
                        featuredserviceid[index],
                        featuredservicetitle[index],
                      )
                    }
                  />
                </>
            )}
          <View
              style={{
                flexDirection: 'row',
                marginHorizontal: '5.55%',
                marginTop: 10,
                flex: 1,
              }}>
              <View
                style={{
                  backgroundColor: '#D3D3D3',
                  height: 60,
                  width: '48.5%',
                  borderRadius: 10,
                  marginRight: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('MyCoupons', {
                      screen: 'MyCoupons',
                      params: {},
                    })
                  }>
                  <Text
                    style={{
                      color: '#fff',
                      textAlign: 'center',
                      fontSize: 12,
                      paddingHorizontal: 5,
                      fontWeight: 'bold'
                    }}>
                    MY VOUCHERS &{'\n'} COUPONS
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  backgroundColor: '#D3D3D3',
                  height: 60,
                  width: '48.5%',
                  borderRadius: 10,
                  marginLeft: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('popularServiceRest', {
                      listingType: 1,
                    })
                  }>
                  <Text
                    style={{
                      color: '#fff',
                      textAlign: 'center',
                      fontSize: 12,
                      paddingHorizontal: 5,
                      fontWeight: 'bold'
                    }}>
                    MOST POPULAR
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  hotelName: state.HotelDetails.hotel.name,
  hotelId: state.HotelDetails.hotel.id,
  listingType: state.ListingType,
  token: state.LoginDetails.token,
  suburb: state.HotelDetails.suburb,
  area: state.HotelDetails.hotel.area,
});

const mapDispatchToProps = (dispatch) => ({
  // setListingType: (data) => {
  //   dispatch(setListingType(data));
  // },
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
      mynav: mynav
    };
    dispatch(setFeedback(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(GuestDirectory);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  featuredPromotion: {
    marginTop: 8, fontWeight: '700', fontSize: 15, marginHorizontal: '5.55%'
  },
});
