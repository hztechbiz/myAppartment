import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {Button, Title, Text} from 'react-native-paper';

export default SignInScreen = () => {
  const [value, onChangeText] = React.useState('');
  const [value2, onChangeText2] = React.useState('');

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}>
      <ImageBackground
        source={require('../images/background.png')}
        style={{
          flex: 1,
          resizeMode: 'cover',
          justifyContent: 'center',
        }}>
        <ScrollView style={{flex: 1}}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 500,
              zIndex: 2,

              width: '100%',
              marginTop: 50,
              //marginTop: -80,
            }}>
            <Image
              source={require('../images/logo.png')}
              style={{resizeMode: 'contain', width: '30%'}}
            />
            <Title style={styles.heading}>Welcome Back! Sign In</Title>
            <TextInput
              style={styles.input}
              onChangeText={(text) => onChangeText(text)}
              value={value}
              placeholder="EMAIL ADDRESS"
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) => onChangeText2(text)}
              value={value2}
              placeholder="PASSWORD"
            />
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 10,
                marginBottom: 15,
              }}>
              <Text style={{fontSize: 12}}>Forgetten your </Text>
              <TouchableOpacity>
                <Text
                  style={{
                    color: '#9e1b95',
                    textDecorationLine: 'underline',
                    fontSize: 12,
                  }}>
                  Username or Password
                </Text>
              </TouchableOpacity>
            </View>
            <Button style={styles.btn} color="#fff" contentStyle={{}}>
              SIGN IN
            </Button>

            <Text style={{marginTop: 8, marginBottom: 3, fontSize: 12}}>
              Don’t Have an Account?
            </Text>
            <TouchableOpacity>
              <Text
                style={{
                  color: '#9e1b95',
                  textDecorationLine: 'underline',
                  fontSize: 12,
                }}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#D3D3D3',
    color: '#fff',
    borderRadius: 10,
    width: '42%',
    height: '13%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  heading: {
    color: '#333333',
    fontSize: 24,
  },
  input: {
    width: '90%',
    height: '13%',
    borderColor: '#f0f3f7',
    borderWidth: 1,
    textAlign: 'center',
    marginBottom: 6,
    marginTop: 6,
    backgroundColor: '#f0f3f7',
    fontWeight: 'bold',
    borderRadius: 8,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
    justifyContent: 'center',
    borderColor: 'red',
  },
});
