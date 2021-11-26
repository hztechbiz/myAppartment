import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View, Dimensions, Image } from 'react-native';
import { Button, Title, Text } from 'react-native-paper';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const PoweredBy = (props) => {
  const navigation = useNavigation();
  return (
    <View style={[styles.btn, props?.style]}>
      <Text style={{
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        letterSpacing: 2,
      }}>Powered By </Text>
      <Image
        source={require('../images/Hotel360-assets/hotel-logo.png')}
        style={styles.logo_css}
      />
    </View>
  );
};

export default PoweredBy;

const styles = StyleSheet.create({

  btn: {
    ...Platform.select({
      ios: {
        //
        bottom: 120,
      },
      android: {
        //
        bottom: 75,
      },
    }),
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#f00',
    height: screenHeight * 0.03,
    // width: screenWidth,
    flex: 1,
    position: 'absolute',


    flexDirection: 'row',
    marginHorizontal: '5.55%',
    alignSelf: 'center',
    // borderTopWidth: 1,
    // borderTopColor: '#CDCDCD',
    paddingHorizontal: 20,
    paddingTop: 5,
    borderTopStartRadius: 10,
    // elevation: 5
  },
  logo_css: {
    height: '150%',
    width: 50,
    resizeMode: 'contain',
    // backgroundColor: '#f00',
  }
});
