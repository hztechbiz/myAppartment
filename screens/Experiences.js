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
  TouchableOpacity,
  Linking,
} from 'react-native';
import BackgroundLayout from '../components/BackgroundLayout';
import LogoBar from '../components/LogoBar';
import TitleBar from '../components/TitleBar';
import {connect} from 'react-redux';
import {apiActiveURL, appKey, appId} from '../ApiBaseURL';
import Axios from 'axios';
import {useIsFocused} from '@react-navigation/native';
import {ActivityIndicator, Button} from 'react-native-paper';
import ExTile from '../components/ExTile';
import {setChildExperience, setFeedback} from '../actions';
import FeedbackModal from '../components/FeedbackModal';
import {SliderBox} from 'react-native-image-slider-box';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const statusBar = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const Promotions = (props) => {
  const [categories, setCategories] = React.useState([]);
  const [loader, setLoader] = React.useState(false);
  const [loader2, setLoader2] = React.useState(true);
  const isFocused = useIsFocused();
  const [featuredPromotion, setFeaturedPromotion] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredserviceid, setFeaturedServiceId] = useState([]);
  const [featuredservicetitle, setFeaturedServiceTitle] = useState([]);
  const [sliderImages, setSliderImages] = useState([]);

  useEffect(() => {
    if (!isFocused) {
      setSliderImages([]);
      setFeaturedPromotion([]);
      setFeaturedServiceId([]);
      setFeaturedServiceTitle([]);
      return;
    }
    fetchCategories();
    fetchFeaturedPromotion();
  }, [props]);

  const fetchCategories = () => {
    const url = `${apiActiveURL}/categories?area=${props.area}&listing_type=6`;
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
          props.setChildExperience(0, '');
          setLoader(true);
        } else {
          console.log(Object.values(res.data.data).length, 'categories');
          props.setFeedback('YourHotel', 'No Data', true, '');
          setLoader(false);
        }
      })
      .catch((error) => {
        props.setFeedback('YourHotel', 'Something Went Wrong...', true, '');
        console.log(url, 'rest api');
      });
  };

  const getCategories = (data) => {
    let sliceData = Object.values(data);
    return sliceData;
  };

  const fetchFeaturedPromotion = () => {
    const url = `${apiActiveURL}/feature_promotion?area=${props.area}&subrub=${props.suburb}`;
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
        // console.log('featured_promotion', res.data.data);
        if (res.data.code === 200) {
          if(res.data.data.length > 0){
            let sortedarr = res.data.data.sort((a, b) => a.display_order - b.display_order);
            // console.log('sortedarr', sortedarr);
            sortedarr.map((data, index) => {
              // console.log('featured_promotion', data);
              if(data.image_url){
                sliderImages.push({uri: data.image_url});
                featuredPromotion.push({
                  id: data?.service_id,
                  name: data?.name,
                  image: { uri: data?.image_url },
                  tagline: data?.tagline,
                  title: data?.service?.title,
                  iframe_url: data?.iframe_url,
                  status: true
                });
                
              }else{
                sliderImages.push(require('../images/Placeholder.png'));
                featuredPromotion.push({
                  id: data?.service_id,
                  name: data?.name,
                  image: require('../images/Placeholder.png'),
                  tagline: data?.tagline,
                  title: data?.service?.title,
                  iframe_url: data?.iframe_url,
                  status: true
                });
              }
            });
          }else {
            sliderImages.push(require('../images/Placeholder.png'));
          }
          setLoader2(false);
        //   if (res.data.hasOwnProperty('data')) {
        //     //featured_promotion work
        //     if (Object.values(res.data.data).length > 0) {
        //       Object.values(res.data.data).map((data, index) => {
        //         if (data.hasOwnProperty('meta')) {
        //           let featuredImage = data.meta.find(
        //             (o) => o.meta_key === 'background_image',
        //           );
        //           console.log(featuredImage, 'test');
        //           if (featuredImage !== undefined) {
        //             sliderImages.push({uri: featuredImage.meta_value});
        //             console.log({uri: featuredImage.meta_value});
        //             featuredserviceid.push(featuredImage.service_id);
        //             featuredservicetitle.push(data.title);
        //           } else {
        //             sliderImages.push(require('../images/Placeholder.png'));
        //           }
        //         }
        //       });
        //     } else {
        //       sliderImages.push(require('../images/Placeholder.png'));
        //     }
        //     setLoader2(false);
        //   }
        } else {
          console.log('featured_promotion', props.listingType, res);
          sliderImages.push(require('../images/Placeholder.png'));
          props.setFeedback(
            'YourHotel',
            'Feature Promotion Image Not Found...',
            true,
            '',
          );
          setLoader2(false);
        }
      })
      .catch((error) => {
        //setMsgTitle('ClubLocal');
        props.setFeedback('YourHotel', 'Something Went Wrong...', true, '');
        //setVisible(true);
        console.log(error, 'featured_promotion api');
        setLoader2(false);
      });
  };
  const handleNavigatePromoDetail = (promotion) => {
    if (promotion?.status) {
      if(!promotion.id){
        Linking.canOpenURL(promotion.iframe_url).then(data => {
          if(data){
            Linking.openURL(promotion.iframe_url);
          }else{
            props.setFeedback(
              'YourHotel',
              'Sorry, Broken Link',
              true,
              '',
            );
          }
        })
      }else{
        props.navigation.navigate('Promotions', {
          screen: 'Promotion Business',
          params: {promoid: promotion.id , promotitle: promotion.title, screen: 'promotion'},
        });
      }
    } else {
      props.setFeedback(
        'YourHotel',
        'Sorry, No Feature Promotions Available',
        true,
        '',
      );
    }
  };

   const _renderItem = ({item,index}) =>{
    return (
      <TouchableOpacity onPress={() => handleNavigatePromoDetail(featuredPromotion[currentIndex])} style={{
          // backgroundColor:'floralwhite',
          // borderRadius: 5,
          height: 155,
          // padding: 50,
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 25,
          marginRight: 25, 
          marginVertical: 10,
          }}>
            {item?.tagline != "" ? 
            <Text style={{
              fontSize: 30,
              fontWeight: 'bold',
              position: 'absolute',
              // bottom: 0,
              // top: '50%',
              // left: '50%',
              zIndex: 2,
              color: 'white',
              paddingHorizontal: 15,
              paddingVertical: 5,
              backgroundColor: 'rgba(000,000,000,0.6)'
            }}>
            {item?.tagline}
            </Text>
           : <></>}
          <Text style={{
            position: 'absolute',
            bottom: 0,
            right: -4,
            fontSize: 15,
            color: 'white',
            backgroundColor: '#D3D3D3',
            borderTopLeftRadius: 5,
            padding: 5,
            zIndex: 2,
          }}>
            Learn More
          </Text>
        <Image source={item.image} style={{
          height: 155,
          width: screenWidth * 0.89,
          resizeMode: 'stretch',
          // paddingHorizontal: 10,
        }} />
        {/* <Text style={{fontSize: 30}}>{item.title}</Text> */}
      </TouchableOpacity>

    )
}

  const PaginationComp = () => {
    return (
        <Pagination
          dotsLength={featuredPromotion.length}
          activeDotIndex={currentIndex}
          containerStyle={{ paddingVertical: 5 }}
          dotStyle={{
              width: 10,
              // height: 10,
              borderRadius: 5,
              margin: 0,
              padding: 0,
              // marginHorizontal: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.92)'
          }}
          inactiveDotStyle={{
              // Define styles for inactive dots here
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
    );
  }


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
              <ExTile title={category.name} id={category.id} />
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
      <TitleBar title={`EXPERIENCES`}/>
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
                <ActivityIndicator animating={true} color="#6697D2" />
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
                <ActivityIndicator animating={true} color="#6697D2" />
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
                  <Carousel
                    layout={"default"}
                    // ref={ref => this.carousel = ref}
                    data={featuredPromotion}
                    sliderWidth={screenWidth}
                    itemWidth={screenWidth}
                    renderItem={_renderItem}
                    onSnapToItem = { index => setCurrentIndex(index) } />
            <PaginationComp/>
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
                  backgroundColor: '#6697D2',
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
                      listingType: 6,
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

export default connect(mapStateToProps, mapDispatchToProps)(Promotions);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  featuredPromotion: {
    marginTop: 8, fontWeight: '700', fontSize: 15, marginHorizontal: '5.55%'
  },
});
