import React from 'react';
import {View, StyleSheet, Image, Text, SafeAreaView, TouchableOpacity} from 'react-native';

const Account = ({navigation}) => {
  return (
    <SafeAreaView style={styles.maincontainer}>

      <View style={styles.imgview}>
        <Image
          source={require('../images/Hotel360-assets/hotel-logo.png')}
          style={{resizeMode: 'contain', width: '40%'}}
        />
      </View>

      <View style={styles.textview}>
        <Text style={{textAlign: 'center', color: '#606060'}}>
        {"In addition to finding out all you need to know about your appartment, you can explore a comprehensive selection of restaurants, experiences, retail and things to do, all local to where you are staying. Look out for special offers and promotions, and businesses that accept our 360 Pass for a discount.\n The App is free to you to use. Just tap 'Create Account' and follow the prompts to enjoy what MyAppartment has to offer, straight away."}
        </Text>
      </View>

      <View style={styles.btnview}>
        <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')} style={styles.signinbtn}>
          <Text style={{color: '#000'}}>SIGN IN</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.btnview}>
        <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')} style={styles.signupbtn}>
          <Text style={{color: '#FFF'}}>CREATE ACCOUNT</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.regview}>
        <Image
          source={require('../images/Hotel360-assets/reg.png')}
          style={{ height: 200, width: 195}}
        />
      </View>

    </SafeAreaView>
  );
};

export default Account;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 30,
  },
  imgview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textview: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  btnview: {
    flexDirection: 'row',
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signinbtn: {
    // backgroundColor: '#8cd129',
    backgroundColor: '#D3D3D3',
    borderRadius: 10,
    paddingHorizontal: 50,
    paddingVertical: 20,
  },
  signupbtn: {
    backgroundColor: '#6697D2',
    borderRadius: 10,
    paddingHorizontal: 50,
    paddingVertical: 20,
  },
  regview: {
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});