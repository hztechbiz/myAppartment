import React from 'react';
import {Image, Dimensions, KeyboardAvoidingView, StatusBar, AppState} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {connect, Provider} from 'react-redux';
import store from '../store';
import {useSelector} from 'react-redux';

import Me from './Me';
import WhatsOn from './WhatsOn';
import MyCoupons from './MyCoupons';
import Promotions from './Promotions';
import Restaurants from './Restaurants';
import Experiences from './Experiences';
import Services from './Services';
import WhatsOnServices from './WhatsOnServices';
import PromotionServices from './PromotionServices';
import childCategories from './childCategories';
import Business from './Business';
import WhatsOnBusiness from './WhatsOnBusiness';
import childCategoriesPromo from './childCategoriesPromo';
import childCategoriesWhatsOn from './childCategoriesWhatsOn';
import PromotionBusiness from './PromotionBusiness';
import DiscountPass from './DiscountPass';
import PassBusiness from './PassBusiness';
import TabComponent from '../components/Tab';
import childCategoriesEx from './childCategoriesEx';
import ExServices from './ExServices';
import ExBusiness from './ExBusiness';
import GuestDirectory from './GuestDirectory';

import RootStackScreen from './RootStackScreen';
import {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {checkOut, signIn, signOut} from '../actions';
import childCategoriesGD from './childCategoriesGD';
import GDServices from './GDServices';
import GDBusiness from './GDBusiness';
import popularServiceRest from './popularServiceRest';
import GDmessages from './GDmessages';
import help from './help';
import MyAccount from './MyAccount';
import PrivacyPolicy from './PrivacyPolicy';
import TermsConditions from './TermsConditions';
import MyDetails from './MyDetails';
import ContactClubLocal from './ContactClubLocal';
import MyTransactions from './MyTransactions';
import SpecialPromotions from './SpecialPromotions';
import MyPass from './MyPass';
import SpecialBusiness from './SpecialBusiness';
import Others from './Others';
import childCategoriesOthers from './childCategoriesOthers';
import OthersServices from './OthersServices';
import OthersBusiness from './OthersBusiness';
import PromoCategories from './PromoCategories';
import GetAll from './GetAll';
import AllServices from './AllServices';
import { apiActiveURL, appId, appKey } from '../ApiBaseURL';
import axios from 'axios';
import { useState } from 'react';
import { useRef } from 'react';
import Weather from './Weather';

const MeStack = createStackNavigator();
const MyCouponsStack = createStackNavigator();
const PromotionsStack = createStackNavigator();
const RestaurantsStack = createStackNavigator();
const ExperiencesStack = createStackNavigator();
const ExtraStack = createStackNavigator();

const Tab = createBottomTabNavigator();

const Index = (props) => {
  const screenHeight = Dimensions.get('window').height;
  const margbot = '1.8%';
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  //const isLogged = useSelector((state) => state.isLogged);
  useEffect(() => {
    readData();
  }, []);

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = async (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log("AppState", appState.current);
    if(appState.current == 'active'){
      const loggedInUser = await AsyncStorage.getItem('user');
      let parsed = JSON.parse(loggedInUser);
      if (parsed !== null) {
        const url = `${apiActiveURL}/token_validity/${parsed.data.data.user_id}`;
        const options = {
          method: 'GET',
          headers: {
            AppKey: appKey,
            Token: parsed.data.data.token,
            AppId: appId,
          },
          url,
        };
        axios(options)
          .then((res) => {
            console.log('token_validity', res);
            if (res.data.data) {
              // props.signIn(parsed);
              console.log(parsed, 'parsed try');
            }else{
              handleLogout(parsed.data.data.user_id)
            }
          })
          .catch((error) => {
            console.log('token_validity', error);
          });
      }
    }
  };

  const readData = async () => {
    try {
      const loggedInUser = await AsyncStorage.getItem('user');
      let parsed = JSON.parse(loggedInUser);
      if (parsed !== null) {
        props.signIn(parsed);
        console.log(parsed, 'parsed try');
      }
    } catch (e) {
      const loggedInUser = await AsyncStorage.getItem('user');
      console.log(loggedInUser, 'loggedInUser catch');
    }
  };

  const handleLogout = (id) => {
    clearStorage();

    const url = `${apiActiveURL}/logout/${id}`;
    const options = {
      method: 'GET',
      headers: {
        AppKey: appKey,
        Token: props.token,
        AppId: appId,
      },
      url,
    };
    axios(options)
      .then((res) => {
        console.log('logout Api Success');
      })
      .catch((error) => {
        console.log(url, 'rest api');
      });

    props.signOut(false);
    props.checkOut();
    //props.navigation.navigate('Me');
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('hotel');
      console.log('Storage successfully cleared!');
    } catch (e) {
      console.log('Failed to clear the async storage.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS == 'ios' ? 20 : 20}
      enabled={Platform.OS === 'ios' ? false : false}
      >
      <NavigationContainer>
        {props.isChecked ? (
          <Tab.Navigator
            tabBarOptions={{
              style: {
                height: '13.5%',
                alignItems: 'flex-end',
                backgroundColor: 'transparent',
                borderTopWidth: 0,
                position: 'absolute',
                left: 20,
                right: 20,
                bottom: margbot,
                elevation: 0,
              },
            }}>
            <Tab.Screen
              name="Extra"
              component={ExtraStackScreen}
              options={{
                tabBarButton: (props) => (
                  <TabComponent label="Extra" {...props} />
                ),
              }}
            />
            <Tab.Screen
              name="Me"
              component={MeStackScreen}
              options={{
                tabBarButton: (props) => <TabComponent label="Me" {...props} />,
              }}
            />
            <Tab.Screen
              name="MyCoupons"
              component={MyCouponsStackScreen}
              options={{
                tabBarButton: (props) => (
                  <TabComponent label="MyCoupons" {...props} />
                ),
              }}
            />
            <Tab.Screen
              name="Promotions"
              component={PromotionsStackScreen}
              options={{
                tabBarButton: (props) => (
                  <TabComponent label="Promotions" {...props} />
                ),
              }}
            />
            <Tab.Screen
              name="Restaurants"
              component={RestaurantsStackScreen}
              options={{
                tabBarButton: (props) => (
                  <TabComponent label="Restaurants" {...props} />
                ),
              }}
            />
            <Tab.Screen
              name="Experiences"
              component={ExperiencesStackScreen}
              options={{
                tabBarButton: (props) => (
                  <TabComponent label="Experiences" {...props} />
                ),
              }}
            />
          </Tab.Navigator>
        ) : (
          <RootStackScreen />
        )}
      </NavigationContainer>
    </KeyboardAvoidingView>
  );
};

const mapStateToProps = (state) => ({
  isLogged: state.LoginDetails.isLogged,
  token: state.LoginDetails.token,
  isChecked: state.HotelDetails.hasHotel,
});

const mapDispatchToProps = (dispatch) => ({
  categories: (data) => {
    dispatch(categories(data));
  },
  loader: (data) => {
    dispatch(loader(data));
  },
  signIn: (data) => {
    dispatch(signIn(data));
  },
  signOut: (data) => {
    dispatch(signOut(data));
  },
  checkOut: (data) => {
    dispatch(checkOut());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);

const ExtraStackScreen = ({navigation}) => {
  return (
    <ExtraStack.Navigator headerMode="none" initialRouteName="Me">
      <ExtraStack.Screen name="Me" component={Me} />
      
      <ExtraStack.Screen name="AllServices" component={AllServices} />
      <ExtraStack.Screen name="help" component={help} />

      <ExtraStack.Screen name="GDServices" component={GDServices} />
      <ExtraStack.Screen name="GDBusiness" component={GDBusiness} />
      <ExtraStack.Screen name="GDmessages" component={GDmessages} />

      <ExtraStack.Screen name="WhatsOn" component={WhatsOn} />
      <ExtraStack.Screen
        name="childCategoriesWhatsOn"
        component={childCategoriesWhatsOn}
      />
      <ExtraStack.Screen name="WhatsOnServices" component={WhatsOnServices} />
      <ExtraStack.Screen name="WhatsOnBusiness" component={WhatsOnBusiness} />

      <ExtraStack.Screen name="Others" component={Others} />
      <ExtraStack.Screen
        name="childCategoriesOthers"
        component={childCategoriesOthers}
      />
      <ExtraStack.Screen name="OthersServices" component={OthersServices} />
      <ExtraStack.Screen name="OthersBusiness" component={OthersBusiness} />

      <ExtraStack.Screen
        name="popularServiceRest"
        component={popularServiceRest}
      />

      <ExtraStack.Screen
        name="Weather"
        component={Weather}
      />
    </ExtraStack.Navigator>
  );
};

const MeStackScreen = ({navigation}) => {
  return (
    <MeStack.Navigator headerMode="none">
      <MeStack.Screen name="MyAccount" component={MyAccount} />
      <MeStack.Screen name="MyDetails" component={MyDetails} />
      <MeStack.Screen name="MyTransactions" component={MyTransactions} />
      <MeStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <MeStack.Screen name="TermsConditions" component={TermsConditions} />
      <MeStack.Screen name="ContactClubLocal" component={ContactClubLocal} />
    </MeStack.Navigator>
  );
};

const MyCouponsStackScreen = ({navigation}) => {
  return (
    <MyCouponsStack.Navigator headerMode="none" initialRouteName="My Coupons">
      <MyCouponsStack.Screen name="My Coupons" component={MyCoupons} />
      <MyCouponsStack.Screen name="Discount Pass" component={DiscountPass} />
      <MyCouponsStack.Screen
        name="Special Promotions"
        component={SpecialPromotions}
      />
      <MyCouponsStack.Screen name="Special Business" component={SpecialBusiness} />
      <MyCouponsStack.Screen name="My Pass" component={MyPass} />
      <MyCouponsStack.Screen name="Pass Business" component={PassBusiness} />
    </MyCouponsStack.Navigator>
  );
};

const PromotionsStackScreen = ({navigation}) => {
  return (
    <PromotionsStack.Navigator headerMode="none" initialRouteName="Promotions">
      
      <PromotionsStack.Screen name="Promotions" component={Promotions} />
      <PromotionsStack.Screen name="PromoCategories" component={PromoCategories} />
      <PromotionsStack.Screen
        name="childCategoriesPromo"
        component={childCategoriesPromo}
      />
      <PromotionsStack.Screen
        name="PromotionServices"
        component={PromotionServices}
      />

      <PromotionsStack.Screen
        name="Promotion Business"
        component={PromotionBusiness}
      />
    </PromotionsStack.Navigator>
  );
};

const RestaurantsStackScreen = ({navigation}) => {
  return (
    <RestaurantsStack.Navigator
      headerMode="none"
      initialRouteName="GetAll">
        <RestaurantsStack.Screen name="GetAll" component={GetAll} />
      <RestaurantsStack.Screen name="Restaurants" component={Restaurants} />
      <RestaurantsStack.Screen
        name="ChildCategories"
        component={childCategories}
      />
      <RestaurantsStack.Screen name="Services" component={Services} />
      <RestaurantsStack.Screen
        name="popularServiceRest"
        component={popularServiceRest}
      />
      <RestaurantsStack.Screen name="Business" component={Business} />
    </RestaurantsStack.Navigator>
  );
};

const ExperiencesStackScreen = ({navigation}) => {
  return (
    <ExperiencesStack.Navigator
      headerMode="none"
      initialRouteName="Experiences">
      <ExperiencesStack.Screen name="Experiences" component={Experiences} />
      <ExperiencesStack.Screen
        name="childCategoriesEx"
        component={childCategoriesEx}
      />
      <ExperiencesStack.Screen
        name="popularServiceRest"
        component={popularServiceRest}
      />
      <ExperiencesStack.Screen name="ExServices" component={ExServices} />
      <ExperiencesStack.Screen name="ExBusiness" component={ExBusiness} />
    </ExperiencesStack.Navigator>
  );
};
