import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import Username from './Username';
import Confirmation from './Confirmation';
import Account from './Account';
import {connect} from 'react-redux';
import ConfirmEmail from './ConfirmEmail';
import ConfirmCode from './ConfirmCode';
import RenewPassword from './RenewPassword';
import verifyAccount from './verifyAccount';
import ForgotUsername from './ForgotUsername';

const RootStack = createStackNavigator();

const RootStackScreen = (props) => {
  return (
    <RootStack.Navigator headerMode="none">
      {!props.isLogged ? (
        <>
          <RootStack.Screen name="Account" component={Account} />
          <RootStack.Screen name="SignInScreen" component={SignInScreen} />
          <RootStack.Screen name="ConfirmEmail" component={ConfirmEmail} />
          <RootStack.Screen name="ForgotUsername" component={ForgotUsername} />
          <RootStack.Screen name="ConfirmCode" component={ConfirmCode} />
          <RootStack.Screen name="RenewPassword" component={RenewPassword} />
          <RootStack.Screen name="SignUpScreen" component={SignUpScreen} />
          <RootStack.Screen name="verifyAccount" component={verifyAccount} />
        </>
      ) : (
          <RootStack.Screen name="Confirmation" component={Confirmation} />
      )}
    </RootStack.Navigator>
  );
};

const mapStateToProps = (state) => ({
  isLogged: state.LoginDetails.isLogged,
  token: state.LoginDetails.token,
});

const mapDispatchToProps = (dispatch) => ({
  // checkIn: (data) => {
  //   dispatch(checkIn(data));
  // },
});

export default connect(mapStateToProps, mapDispatchToProps)(RootStackScreen);
