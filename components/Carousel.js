import React, {useEffect, useState} from 'react';
import {
  Image,
  Pressable,
  Text,
  Platform,
  Linking,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import {Button, ActivityIndicator} from 'react-native-paper';

import {connect} from 'react-redux';
import Axios from 'axios';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {apiActiveURL, appId, appKey} from '../ApiBaseURL';
import {
  setCarouselCurrentIndexAll,
  setCarouselTotalIndexAll,
  setChildCategory,
  setFeedback,
  signOut,
} from '../actions';
import {useNavigation} from '@react-navigation/native';
import HTML from 'react-native-render-html';
const screenWidth = Dimensions.get('window').width;

const CarouselData = (props) => {
  // const isFocused = useIsFocused();

  const [sliderImages, setSliderImages] = useState([]);
  const [loader2, setLoader2] = React.useState(true);
  const [couponId, setCouponId] = useState(0);
  const [featuredserviceid, setFeaturedServiceId] = useState([]);
  const [featuredservicetitle, setFeaturedServiceTitle] = useState([]);
  const [featuredPromotion, setFeaturedPromotion] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();
  useEffect(() => {
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    fetchFeaturedPromotion();
  }, []);

  const fetchFeaturedPromotion = () => {
    // console.log(props.suburb, 'props.suburb')
    sliderImages.length = 0;
    featuredPromotion.length = 0;
    featuredserviceid.length = 0;
    featuredservicetitle.length = 0;
    const url = `${apiActiveURL}/feature_promotion?area=${props.area}&subrub=${props.suburb}&listing_type=${props.listingType}`;
    // console.log(url, 'url-----');
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
        if (res.data.code === 200) {
          console.log('worked=====-------------', res.data.data);
          var arr = Object.values(res.data.data);
          if (arr?.length > 0) {
            let sortedarr = arr?.sort(
              (a, b) => a.display_order - b.display_order,
            );
            console.log(sortedarr, 'sortedarr-------');
            sortedarr.map((data, index) => {
              setCouponId(data.coupon);
              // console.log('featured_promotion', data);
              if (data.image_url) {
                sliderImages.push({uri: data.image_url});
                featuredPromotion.push({
                  id: data?.service_id,
                  coupon: data?.coupon,
                  name: data?.name,
                  image: {uri: data?.image_url},
                  tagline: data?.tagline,
                  title: data?.service?.title,
                  iframe_url: data?.iframe_url,
                  term_conditions: data?.term_conditions,
                  expiry: data?.expiry_date,
                  coupon_details: data?.coupon_details,
                  status: true,
                });
              } else {
                sliderImages.push(require('../images/Placeholder.png'));
                featuredPromotion.push({
                  id: data?.service_id,
                  coupon: data?.coupon,
                  name: data?.name,
                  image: require('../images/Placeholder.png'),
                  tagline: data?.tagline,
                  title: data?.service?.title,
                  iframe_url: data?.iframe_url,
                  status: true,
                });
              }
            });
            props.setCarouselTotalIndexAll(featuredPromotion.length);
          } else {
            sliderImages.push(require('../images/Placeholder.png'));
            featuredPromotion.push({
              name: '',
              image: require('../images/Placeholder.png'),
              tagline: '',
              status: false,
            });
          }
          setLoader2(false);
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
        props.setFeedback('YourHotel', 'Something Went Wrong...', true, '');
        console.log(error, 'featured_promotion api', url);
        setLoader2(false);
      });
  };
  const handleNavigatePromoDetail = (promotion) => {
    console.log(promotion, 'promotgion =========');
    if (promotion?.status) {
      if (!promotion.id) {
        Linking.canOpenURL(promotion.iframe_url).then((data) => {
          if (data) {
            Linking.openURL(promotion.iframe_url);
          } else {
            props.setFeedback('YourHotel', 'Sorry, Broken Link', true, '');
          }
        });
      } else {
        navigation.navigate('Promotions', {
          screen: 'Promotion Business',
          params: {
            promoid: promotion.id,
            promotitle: promotion.title,
            screen: 'promotion',
            couponStatus: promotion.coupon,
            term_conditions: promotion.term_conditions,
            expiry_date: promotion.expiry,
            coupon_details: promotion.coupon_details,
            tagline: promotion.tagline,
          },
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
  const regex = /(<([^>]+)>)/gi;

  const PaginationComp = () => {
    return (
      <Pagination
        dotsLength={featuredPromotion.length}
        activeDotIndex={currentIndex}
        containerStyle={{paddingVertical: 5}}
        dotStyle={{
          width: 10,
          // height: 10,
          borderRadius: 5,
          margin: 0,
          padding: 0,
          // marginHorizontal: 8,
          backgroundColor: 'rgba(0, 0, 0, 0.92)',
        }}
        inactiveDotStyle={
          {
            // Define styles for inactive dots here
          }
        }
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  };
  const _renderItem = ({item, index}) => {
    const regex = /(<([^>]+)>)/gi;

    return (
      <TouchableOpacity
        onPress={() =>
          handleNavigatePromoDetail(featuredPromotion[currentIndex])
        }
        style={{
          height: 200,
          // padding: 50,
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 25,
          marginRight: 25,
          marginVertical: 10,
          zIndex: 1,
        }}>
        {item?.tagline != '' ? (
          item?.tagline.charAt(0) == '<' ? (
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                fontStyle: 'italic',
                position: 'absolute',
                top: 70,

                zIndex: 2,
                color: '#ffffff',
                paddingHorizontal: 15,
                paddingVertical: 5,
                backgroundColor: 'rgba(000,000,000,0.0)',
              }}>
              {item?.tagline.replace(regex, '')}
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                fontStyle: 'italic',
                position: 'absolute',
                // bottom: 0,
                // top: '50%',
                // left: '50%',
                zIndex: 2,
                color: '#ffffff',
                paddingHorizontal: 15,
                paddingVertical: 5,
                backgroundColor: 'rgba(000,000,000,0.0)',
              }}>
              {item?.tagline}
            </Text>
          )
        ) : (
          <></>
        )}
        <Text
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            fontSize: 15,
            color: 'white',
            backgroundColor: '#8bd12a',
            borderTopLeftRadius: 5,
            padding: 5,
            zIndex: 2,
          }}>
          Learn More
        </Text>
        <Image
          source={item.image}
          style={{
            height: 200,
            width: screenWidth * 0.89,
            resizeMode: 'stretch',
            // paddingHorizontal: 10,
          }}
        />
      </TouchableOpacity>
    );
  };
  return (
    <View>
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
          <Text
            style={[
              styles.featuredPromotion,
              {
                fontSize: 18,

                textTransform: 'capitalize',
                marginTop: 0,
              },
            ]}>
            {featuredPromotion[currentIndex]?.name}
          </Text>
          <Carousel
            layout={'default'}
            // ref={ref => this.carousel = ref}
            data={featuredPromotion}
            sliderWidth={screenWidth}
            itemWidth={screenWidth}
            renderItem={_renderItem}
            // initialScrollIndex={
            // props.carouselCurrentIndex > featuredPromotion.length ? 0 : props.carouselCurrentIndex

            // }
            // initialScrollIndex={props.carouselCurrentIndex}
            firstItem={0}
            onScrollToIndexFailed={() => {}}
            onSnapToItem={(index) => setCurrentIndex(index)}
          />

          <PaginationComp />
        </>
      )}
    </View>
  );
};
const mapDispatchToProps = (dispatch) => ({
  signOut: (data) => {
    dispatch(signOut(data));
  },
  checkOut: (data) => {
    dispatch(checkOut());
  },

  setChildCategory: (id, name) => {
    const data = {
      id: id,
      name: name,
    };
    dispatch(setChildCategory(data));
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
  setCarouselCurrentIndexAll: () => {
    dispatch(setCarouselCurrentIndexAll());
  },
  setCarouselTotalIndexAll: (data) => {
    dispatch(setCarouselTotalIndexAll(data));
  },
});

const mapStateToProps = (state) => ({
  hotelName: state.HotelDetails.hotel.name,
  hotelId: state.HotelDetails.hotel.id,
  listingType: state.ListingType,
  token: state.LoginDetails.token,
  userid: state.LoginDetails.userId,
  suburb: state.HotelDetails.suburb,
  area: state.HotelDetails.hotel.area,
  carouselCurrentIndex: state.CarouselIndexAll.carouselCurrentIndexAll,
});
export default connect(mapStateToProps, mapDispatchToProps)(CarouselData);

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
    color: '#e57c0b',
  },
  featuredPromotion: {
    marginTop: 8,
    fontWeight: '700',
    fontSize: 15,
    marginHorizontal: '5.55%',
  },
});
