import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import Btn from './Btn';
import {useNavigation, CommonActions} from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const statusBar = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const LogoBar = (props) => {
  var [isPress, setIsPress] = React.useState(false);

  function toggleSearch() {
    setIsPress(!isPress);
  }

  const navigation = useNavigation();
  //console.log(navigation.state, 'navigation');
  const handleNavigateHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        key: null,
        routes: [{name: 'Extra'}],
      }),
    );
  };

  const handleNavigateBack = () => {
    if (navigation.canGoBack()) {
      navigation.dispatch(CommonActions.goBack());
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          key: null,
          routes: [{name: 'Extra'}],
        }),
      );
    }
  };
  return (
    <View style={styles.logo_row}>
      <View style={styles.logo_row_col_1}>
        <Image
          source={require('../images/Hotel360-assets/hotel-logo.png')}
          style={styles.logo_css}
        />
      </View>
      <View style={styles.logo_row_col_2}>
        <View style={styles.logo_row_col_2_view_1}>
          {props.title == '360COUPON' ? (
            <>
              <View
                style={{
                  width: '35%',
                  // marginTop: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                  // height: 40,
                  // backgroundColor: 'red',
                }}>
                <Image
                  source={require('../images/Hotel360-assets/teammarketlogo.png')}
                  style={styles.logo_css}
                />
              </View>
            </>
          ) : (
            <>
              <Text
                style={{
                  fontWeight: '700',
                  color: '#000',
                  fontSize: 17,
                  textAlign: props.borderWidth ? 'center' : 'right',
                  textAlignVertical: 'center',
                  borderWidth: props.borderWidth,
                  borderColor: props.borderColor,
                  color: props.color ? props.color : '#000',
                  borderRadius: 10,
                  textTransform: 'uppercase',
                }}>
                {props.title}
              </Text>
            </>
          )}
          {/* <Text
            style={{
              fontWeight: '700',
              color: '#000',
              fontSize: 17,
              textAlign: props.borderWidth ? 'center' : 'right',
              textAlignVertical: 'center',
              borderWidth: props.borderWidth,
              borderColor: props.borderColor,
              color: props.color ? props.color : '#000',
              borderRadius: 10,
              textTransform: 'uppercase',
            }}>
            {props.title}
          </Text> */}
        </View>
        <View style={styles.logo_row_col_2_view_2}>
          <View
            style={{
              flexDirection: 'row',
              height: 30,
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            <Btn
              label="Home"
              style={{backgroundColor: '#6697D2'}}
              onPress={() => handleNavigateHome()}
            />
            <Btn
              label="Back"
              color={'#000'}
              style={{backgroundColor: '#D3D3D3', marginLeft: 5}}
              onPress={() => handleNavigateBack()}
            />
          </View>
          <View
            style={{
              borderWidth: 1,
              padding: 8,
              borderRadius: 32,
              overflow: 'hidden',
              marginLeft: 5,
              borderColor: '#cac8c8',
              height: 35,
            }}>
            <Icon name="bell" size={18} color="#5a5a5a" />
          </View>
        </View>
      </View>
    </View>
  );
};

export default LogoBar;

const styles = StyleSheet.create({
  logo_row: {
    flexDirection: 'row',
  },

  logo_row_col_1: {
    width: '35%',
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo_row_col_2: {
    marginTop: 20,
    width: '65%',
  },

  logo_row_col_2_view_1: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
    marginRight: '5.55%',
  },

  logo_row_col_2_view_2: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
    marginRight: '5.55%',
    marginTop: 12,
  },

  logo_css: {
    width: screenWidth * 0.2555,
    height: screenHeight * 0.12,
    resizeMode: 'contain',
  },
  searchViewNormal: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 32,
    overflow: 'hidden',
    marginLeft: 5,
    borderColor: '#cac8c8',
  },
  searchViewPressed: {
    height: 33,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 6,
    flexDirection: 'row',
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    borderColor: '#cac8c8',
  },
  searchTextNormal: {
    textDecorationLine: 'none',
    fontWeight: 'bold',
    fontSize: 11,
    overflow: 'hidden',
    height: 33,
    justifyContent: 'center',
    width: '90%',
    letterSpacing: 0.5,
    display: 'none',
  },
  searchTextPressed: {
    textDecorationLine: 'none',
    fontWeight: 'bold',
    fontSize: 11,
    overflow: 'hidden',
    height: 33,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '90%',
    letterSpacing: 0.5,
    display: 'flex',
    paddingLeft: 3,
  },
  searchIconPressed: {
    marginTop: 8,
    marginRight: 5,
  },
  touch: {
    height: 38,
    alignSelf: 'flex-end',
  },
  touched: {
    height: 38,
    alignSelf: 'flex-end',
    maxWidth: '92%',
  },
});
