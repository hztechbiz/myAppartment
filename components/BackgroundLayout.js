import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const statusBar = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const BackgroundLayout = () => {
  return (
    <Image
      source={require('../images/Hotel360-assets/background-layout-2.png')}
      style={styles.background_image}
    />
  );
};

export default BackgroundLayout;

const styles = StyleSheet.create({
  background_image: {
    height: '100%',
    width: screenWidth,
    resizeMode: 'stretch',
    position: 'absolute',
    bottom: 0,
  },
});
