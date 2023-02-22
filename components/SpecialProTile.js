import React from 'react';
import {TouchableHighlight, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import HTML from 'react-native-render-html';

const Tile = (props) => {
  var [isPress, setIsPress] = React.useState(false);
  const navigation = useNavigation();

  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      colors={['#D3D3D3', '#6697D2']}
      style={{height: 150, width: 150, borderRadius: 10, marginRight: 10}}>
      <TouchableOpacity
        style={isPress ? styles.tilePressed : styles.tileNormal}
        activeOpacity={1}
        underlayColor="#fff"
        onPress={() => {
          setIsPress(true);
          setTimeout(() => {
            setIsPress(false);
            navigation.navigate(props.route, {
              id: props.id,
              title: props.title,
              discount: props.discount,
              minamount: props.minamount,
              description: props.description,
              details: props.details,
              terms: props.terms,
              expiry: props.expiry,
              route: props.route,
            });
          }, 0);
        }}>
        <Text
          style={[
            isPress ? styles.tileTextPressed : styles.tileTextNormal,
            styles.textColor,
          ]}>
          {props?.title}
        </Text>
        {props?.description?.includes('<p>') ? (
          <>
            <HTML
              tagsStyles={{
                p: {
                  // marginVertical: 20,
                  // marginHorizontal: '8%',
                  textAlign: 'center',
                  // alignSelf: 'center',
                  // backgroundColor: 'red',
                  // alignContent: 'center',
                },
              }}
              source={{
                html: props?.description == '' ? '<p></p>' : props?.description,
              }}
            />
          </>
        ) : (
          <Text
            style={{
              textAlign: 'center',
              paddingHorizontal: '5.55%',
              fontSize: 14,
              // fontWeight: '700',
              paddingVertical: 5,
              // color: '#6b6b6b',
            }}>
            {props?.description}
          </Text>
        )}

        <Text
          style={[
            isPress ? styles.tileTextPressed : styles.tileTextNormal,
            styles.textStyle,
          ]}>
          Coupon
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default Tile;

const styles = StyleSheet.create({
  tileNormal: {
    height: 150,
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
    height: 150,
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
  textColor: {
    color: '#e57c0b',
  },

  textStyle: {
    fontStyle: 'italic',
  },
});
