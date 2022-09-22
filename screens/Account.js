// import React from 'react';
// import {
//   View,
//   StyleSheet,
//   Image,
//   Text,
//   SafeAreaView,
//   TouchableOpacity,
// } from 'react-native';

// const Account = ({navigation}) => {
//   return (
//     <SafeAreaView style={styles.maincontainer}>
//       <View style={styles.imgview}>
//         <Image
//           source={require('../images/Hotel360-assets/hotel-logo.png')}
//           style={{resizeMode: 'contain', width: '40%'}}
//         />
//       </View>

//       <View style={styles.textview}>
//         <Text style={{textAlign: 'center', color: '#606060'}}>
//           {
//             "In addition to finding out all you need to know about your appartment, you can explore a comprehensive selection of restaurants, experiences, retail and things to do, all local to where you are staying. Look out for special offers and promotions, and businesses that accept our 360 Pass for a discount.\n The App is free to you to use. Just tap 'Create Account' and follow the prompts to enjoy what MyAppartment has to offer, straight away."
//           }
//         </Text>
//       </View>

//       <View style={styles.btnview}>
//         <TouchableOpacity
//           onPress={() => navigation.navigate('SignInScreen')}
//           style={styles.signinbtn}>
//           <Text style={{color: '#000'}}>SIGN IN</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.btnview}>
//         <TouchableOpacity
//           onPress={() => navigation.navigate('SignUpScreen')}
//           style={styles.signupbtn}>
//           <Text style={{color: '#FFF'}}>CREATE ACCOUNT</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.regview}>
//         <Image
//           source={require('../images/Hotel360-assets/reg.png')}
//           style={{height: 200, width: 195}}
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// export default Account;

// const styles = StyleSheet.create({
//   maincontainer: {
//     flex: 1,
//     flexDirection: 'column',
//     backgroundColor: '#fff',
//     padding: 30,
//   },
//   imgview: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   textview: {
//     flexDirection: 'row',
//     paddingBottom: 10,
//   },
//   btnview: {
//     flexDirection: 'row',
//     paddingTop: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   signinbtn: {
//     // backgroundColor: '#8cd129',
//     backgroundColor: '#D3D3D3',
//     borderRadius: 10,
//     paddingHorizontal: 50,
//     paddingVertical: 20,
//   },
//   signupbtn: {
//     backgroundColor: '#6697D2',
//     borderRadius: 10,
//     paddingHorizontal: 50,
//     paddingVertical: 20,
//   },
//   regview: {
//     paddingTop: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import {setFeedback} from '../actions';
const {height, width} = Dimensions.get('window');
const Account = (props) => {
  // useEffect(()=>{
  //   props.setFeedback('', '', false, '');
  // },[])
  return (
    <SafeAreaView style={styles.maincontainer}>
      <Image
        source={require('../images/Hotel360-assets/background-layout-3.png')}
        style={styles.background_image}
      />

      <View style={styles.imgview}>
        <Image
          source={require('../images/Hotel360-assets/hotel-logo.png')}
          style={{
            resizeMode: 'contain',
            width: '40%',
            alignItems: 'flex-start',
          }}
        />

        <Image
          source={require('../images/Hotel360-assets/your_gateway.png')}
          style={{resizeMode: 'contain', width: width / 3, flexBasis: '32%'}}
        />
      </View>

      <View style={styles.textview}>
        {/* <Text style={{textAlign: 'center', color: '#606060'}}>
        {"In addition to finding out all you need to know about your hotel, resort or motel, you can explore a comprehensive selection of restaurants, experiences, retail and things to do, all local to where you are staying. Look out for special offers and promotions, and businesses that accept our 360 Pass for a discount.\n The App is free to you to use. Just tap 'Create Account' and follow the prompts to enjoy what YourHotel has to offer, straight away."}
        </Text> */}
        <Image
          source={require('../images/Hotel360-assets/categories.png')}
          style={{
            resizeMode: 'contain',
            alignSelf: 'center',
            width: '100%',
            height: '100%',
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: 10,
        }}>
        {/* <View style={styles.btnview}> */}
        <TouchableOpacity
          onPress={() => props.navigation.navigate('SignUpScreen')}
          style={styles.signupbtn}>
          <Text style={{color: '#fff'}}>REGISTER NOW</Text>
        </TouchableOpacity>
        {/* </View> */}
        {/* <View style={styles.btnview}> */}
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('SignInScreen', {handleRoute: 'false'})
          }
          style={styles.signinbtn}>
          <Text style={{color: 'black'}}>SIGN IN</Text>
        </TouchableOpacity>
        {/* </View> */}
      </View>
      {/* <View style={styles.regview}>
        <Image
          source={require('../images/Hotel360-assets/reg.png')}
          style={{ height: 200, width: 195}}
        />
      </View> */}
    </SafeAreaView>
  );
};
const mapDispatchToProps = (dispatch) => ({
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
export default connect(null, mapDispatchToProps)(Account);

const styles = StyleSheet.create({
  background_image: {
    height: '100%',
    width: width,
    resizeMode: 'stretch',
    position: 'absolute',
    bottom: 0,
  },
  maincontainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',

    paddingHorizontal: 15,
  },
  imgview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 10,
  },
  textview: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '84%',
    marginLeft: '8%',
    height: '70%',
    marginBottom: '5%',

    // backgroundColor: 'red',
  },
  btnview: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  signinbtn: {
    backgroundColor: '#d3d3d3',
    borderRadius: 10,
    paddingHorizontal: 32,
    paddingVertical: 20,
    marginLeft: 8,
  },
  signupbtn: {
    backgroundColor: '#6697d2',
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 20,
    marginRight: 8,
  },
  regview: {
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
