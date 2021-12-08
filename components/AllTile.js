import React from 'react';
import { TouchableHighlight, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import {connect} from 'react-redux';
import {setCarouselCurrentIndex} from '../actions';

const Tile = (props) => {
  var [isPress, setIsPress] = React.useState(false);
  const navigation = useNavigation();

  const handleNavigation = () => {
    if(props.nav == 'Restaurants'){
      navigation.navigate( 'Services' , {  isAll: true });
    }else if(props.nav == 'WhatsOn'){
      navigation.navigate( 'WhatsOnServices' , { isAll: true });
    }else if(props.nav == 'Others'){
      navigation.navigate( 'OthersServices' , { isAll: true });
    }else if(props.nav == 'Experiences'){
      navigation.navigate( props.nav , { screen: 'ExServices', params : { isAll: true } });
    }else if(props.nav == 'Promotions'){
      navigation.navigate( props.nav , { screen: 'PromotionServices', params : { isAll: true } });
    }else{
      console.log('null' , props.nav)
    }
    
  }

  return (
    <LinearGradient
    start={{x: 0, y: 0}}
    end={{x: 1, y: 0}}
      colors={['#D3D3D3', '#6697D2']}
      style={{ height: 90, width: 150, borderRadius: 10, marginRight: 10 }}>
      <TouchableHighlight
        style={isPress ? styles.tilePressed : styles.tileNormal}
        activeOpacity={1}
        underlayColor="#fff"
        onPress={() => {
          setIsPress(true);
          console.log('previousIndex', props.previousIndex);
          props.setCarouselCurrentIndex(props.previousIndex);
          setTimeout(() => {
            setIsPress(false);
            props.isAll 
            ? 
            handleNavigation()
              // navigation.dispatch(
              // CommonActions.reset({
              //   routes: [{name: props.nav, params: { screenName: props.screenName }}],
              // }), 
            // )  
            : navigation.navigate(props.nav)
          }, 0);
        }}>
        <Text
          style={isPress ? styles.tileTextPressed : styles.tileTextNormal}>
          {props.title}
        </Text>
      </TouchableHighlight>
    </LinearGradient>
  );
};

const mapStateToProps = (state) => ({
  carouselCurrentIndex: state.CarouselIndex.carouselCurrentIndex,
});

const mapDispatchToProps = (dispatch) => ({
  setCarouselCurrentIndex: (carouselCurrentIndex) => {
    const data = {
      carouselCurrentIndex: carouselCurrentIndex,
    };
    dispatch(setCarouselCurrentIndex(data));
  },
});

// export default Tile;
export default connect(mapStateToProps, mapDispatchToProps)(Tile);

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
    paddingHorizontal: 10,
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
    paddingHorizontal: 10,
  },
  tileTextNormal: {
    textTransform: 'uppercase',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  tileTextPressed: {
    textTransform: 'uppercase',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#D3D3D3',
  },
});