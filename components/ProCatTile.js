import React from 'react';
import {TouchableHighlight, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Tile = (props) => {
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
        onPress={() => {
          setIsPress(true);
          setTimeout(() => {
            setIsPress(false);
            navigation.navigate('Promotions', {
              screen: 'Promotions',
              params: {screename: props.title, listingtype: props.listingtype},
            });
          }, 0);
        }}>
        <Text style={isPress ? styles.tileTextPressed : styles.tileTextNormal}>
          {props.title}
        </Text>
      </TouchableHighlight>
    </LinearGradient>
  );
};

export default Tile;

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
