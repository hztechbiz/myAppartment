import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  StatusBar,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import {Button, ActivityIndicator} from 'react-native-paper';
import BackgroundLayout from '../components/BackgroundLayout';
import LogoBar from '../components/LogoBar';
import TitleBar from '../components/TitleBar';
import Tile from '../components/childGDTile';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
//import {useIsFocused} from '@react-navigation/native';
import {apiActiveURL, appKey, appId} from '../ApiBaseURL';
import Axios from 'axios';
import {
  setChildCategory,
  setChildGD,
  setChildPromotion,
  setFeedback,
} from '../actions';
import FeedbackModal from '../components/FeedbackModal';
import {SliderBox} from 'react-native-image-slider-box';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import _ from 'lodash';

const screenWidth = Dimensions.get('window').width;

const childCategoriesGD = (props) => {
  const [categories, setCategories] = React.useState([]);
  const [description, setDescription] = React.useState('');
  const [loader, setLoader] = React.useState(false);
  const [loader2, setLoader2] = React.useState(true);
  //const isFocused = useIsFocused();
  const [featuredpromotion, setFeaturedPromotion] = useState(
    require('../images/Placeholder.png'),
  );
  const [featuredserviceid, setFeaturedServiceId] = useState([]);
  const [featuredservicetitle, setFeaturedServiceTitle] = useState([]);
  const [sliderImages, setSliderImages] = useState([]);

  useEffect(() => {
    // if (!isFocused) {
    //   setSliderImages([]);
    //   setFeaturedServiceId([]);
    //   setFeaturedServiceTitle([]);
    //   return;
    // }
    fetchChildCategories();
    fetchFeaturedPromotion();
  }, [props]);

  const fetchChildCategories = () => {
    //console.log(props.ChildCatId);
    let url = '';
    url = `${apiActiveURL}/categories/${props.CatId}?subrub=${props.suburb}&area=${props.area}&listing_type=1`;
    // if (props.ChildCatId !== 0) {
    //   url = `${apiActiveURL}/categories/${props.ChildCatId}?subrub=${props.suburb}&hotel_id=${props.hotelId}&listing_type=1`;
    // } else {
    //   url = `${apiActiveURL}/categories/${props.CatId}?subrub=${props.suburb}&hotel_id=${props.hotelId}&listing_type=1`;
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
          //console.log('render', props.catID, res.data.data);
          setCategories(res.data.data);
          //setDescription(res.data.data[0].description);
          //props.setChildCategory(res.data.data[0].id, res.data.data[0].title);
          // if (props.ChildCatId == 0){
          //   let sliceData = Object.values(res.data.data);
          // props.setChildCategory(sliceData[0].id, sliceData[0].title);
          // }
          //fetchServices();
          setLoader(true);
        } else {
          props.navigation.navigate('GDServices');
          //console.log(Object.values(res.data.data).length, 'categories');
          setLoader(false);
        }
      })
      .catch((error) => {
        props.setFeedback('MyApartment', 'Something Went Wrong...', true, '');
        console.log(url, 'rest api');
      });
  };

  const getChildCategories = (data) => {
    let sliceData = Object.values(data);
    //props.setChildCategory(sliceData[0].id, sliceData[0].title);
    return sliceData;
  };

  const fetchFeaturedPromotion = () => {
    let url = '';
    url = `${apiActiveURL}/featured_promotion/${1}/${props.CatId}`;
    // if(props.ChildCatId !== 0){
    //   url = `${apiActiveURL}/featured_promotion/${1}/${props.ChildCatId}`;
    // }else{
    //   url = `${apiActiveURL}/featured_promotion/${1}/${props.CatId}`;
    // }
    //const url = `${apiActiveURL}/featured_promotion/${5}`;
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

            let uniqueimages = _.uniqBy(sliderImages, 'uri');
            let uniqueids = _.uniq(featuredserviceid);
            let uniquetitles = _.uniq(featuredservicetitle);

            setFeaturedServiceId(uniqueids);
            setFeaturedServiceTitle(uniquetitles);
            setSliderImages(uniqueimages);
          }
        } else {
          console.log('featured_promotion', props.listingType, res);
          sliderImages.push(require('../images/Placeholder.png'));
          props.setFeedback(
            'MyApartment',
            'Feature Promotion Image Not Found...',
            true,
            '',
          );
          setLoader2(false);
        }
      })
      .catch((error) => {
        //setMsgTitle('ClubLocal');
        props.setFeedback('MyApartment', 'Something Went Wrong...', true, '');
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
        'MyApartment',
        'Sorry, No Feature Promotions Available',
        true,
        '',
      );
    }
  };

  const showCategories = () => {
    return (
      <>
        <View
          style={{
            height: '55%',
            //marginTop: 20,
            //   paddingLeft: '5.55%',
            //   paddingRight: '5.55%',
          }}>
          <ScrollView>
            <View style={{height: 90, marginTop: 20, paddingLeft: '5.55%'}}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}>
                {getChildCategories(categories).map((category, index) => (
                  <View key={index}>
                    <Tile
                      title={category.name}
                      id={category.id}
                      haschild={category.hasChild}
                    />
                  </View>
                ))}
              </ScrollView>
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
                <ActivityIndicator animating={true} color="#6697D2" />
              </View>
            ) : (
              <>
                <Text style={styles.featuredPromotion}>
                  Featured Promotions
                </Text>
                <Text
                  style={[
                    styles.featuredPromotion,
                    {
                      fontSize: 18,
                      // alignSelf: 'center',
                      textTransform: 'capitalize',
                      marginTop: 0,
                    },
                  ]}>
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
                  imageLoadingColor="#6697D2"
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
                paddingHorizontal: '5.55%',
                marginTop: 10,
              }}>
              <Button
                style={{
                  backgroundColor: '#D3D3D3',
                  height: 60,
                  width: '48.5%',
                  borderRadius: 10,
                  marginRight: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                labelStyle={{color: '#fff', textAlign: 'center', fontSize: 12}}
                onPress={() =>
                  props.navigation.navigate('MyCoupons', {
                    screen: 'MyCoupons',
                    params: {},
                  })
                }>
                MY VOUCHERS & COUPONS
              </Button>
              <Button
                style={{
                  backgroundColor: '#6697D2',
                  height: 60,
                  width: '48.5%',
                  borderRadius: 10,
                  marginLeft: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                labelStyle={{color: '#fff', textAlign: 'center', fontSize: 12}}
                onPress={() => {
                  props.navigation.navigate('popularServiceRest', {
                    listingType: 1,
                  });
                }}>
                MOST POPULAR
              </Button>
            </View>
          </ScrollView>
        </View>
      </>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <FeedbackModal />
      <BackgroundLayout />
      <LogoBar title={props.hotelName} />
      <TitleBar title={`GUEST DIRECTORY CATEGORY`} />

      {loader === false ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator animating={true} color="#6697D2" />
        </View>
      ) : (
        showCategories()
      )}
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  hotelName: state.HotelDetails.hotel.name,
  hotelId: state.HotelDetails.hotel.id,
  listingType: state.ListingType,
  token: state.LoginDetails.token,
  CatId: state.GuestDirectory.id,
  CatName: state.GuestDirectory.name,
  //ChildCatId: state.ChildGuestD.id,
  ChildProName: state.ChildGuestD.name,
  suburb: state.HotelDetails.suburb,
  area: state.HotelDetails.hotel.area,
  carouselCurrentIndex: state.CarouselIndexAll.carouselCurrentIndexAll,
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
      mynav: mynav,
    };
    dispatch(setFeedback(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(childCategoriesGD);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tileNormal: {
    height: 90,
    width: 150,
    borderWidth: 2,
    borderColor: '#cac8c8',
    borderRadius: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#fff',
  },
  tilePressed: {
    height: 90,
    width: 150,
    borderWidth: 3,
    borderColor: 'transparent',
    borderRadius: 10,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#fff',
  },
  tileTextNormal: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  tileTextPressed: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#6697D2',
  },
  featuredPromotion: {
    marginTop: 8,
    fontWeight: '700',
    fontSize: 15,
    marginHorizontal: '5.55%',
  },
});
