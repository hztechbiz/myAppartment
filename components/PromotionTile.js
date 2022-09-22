import React from 'react';
import {TouchableHighlight, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {connect} from 'react-redux';
import {setCarouselCurrentIndexAll, setPromotion} from '../actions';

const PromtionTile = (props) => {
  var [isPress, setIsPress] = React.useState(false);
  const navigation = useNavigation();

  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      colors={['#D3D3D3', '#6697D2']}
      style={{height: 90, width: 150, borderRadius: 10, marginRight: 10}}>
      <TouchableHighlight
        style={isPress ? styles.tilePressed : styles.tileNormal}
        activeOpacity={1}
        underlayColor="#fff"
        //onHideUnderlay={() => setIsPress(false)}
        //onShowUnderlay={() => setIsPress(true)}
        onPress={() => {
          setIsPress(true);
          setTimeout(() => {
            setIsPress(false);
            props.setCarouselCurrentIndexAll();
            props.setPromotion(props.id, props.title);
            navigation.navigate('childCategoriesPromo');
          }, 500);
        }}>
        <Text style={isPress ? styles.tileTextPressed : styles.tileTextNormal}>
          {props.title}
        </Text>
      </TouchableHighlight>
    </LinearGradient>
  );
};

const mapStateToProps = (state) => ({
  // hotelName: state.HotelDetails.hotel.name,
  // hotelId: state.HotelDetails.hotel.id,
  // listingType: state.ListingType,
  // token: state.LoginDetails.token,
});

const mapDispatchToProps = (dispatch) => ({
  setPromotion: (id, name) => {
    const data = {
      id: id,
      name: name,
    };
    dispatch(setPromotion(data));
  },
  setCarouselCurrentIndexAll: () => {
    dispatch(setCarouselCurrentIndexAll());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PromtionTile);

const styles = StyleSheet.create({
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
    color: '#D3D3D3',
  },
});
