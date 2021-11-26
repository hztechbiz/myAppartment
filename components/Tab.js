import React from 'react';
import {View, Text, TouchableOpacity, Image, Dimensions} from 'react-native';
import Images from '../images';
import { useNavigation, CommonActions, useRoute } from '@react-navigation/native';

export default Tab = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const focused = props.accessibilityState.selected;
  const icon = !focused ? Images.icons[props.label] : Images.icons[`${props.label}Focused`];
  const screenHeight = Dimensions.get('window').height;
  const Fcolor = !focused ? '#fff' : '#365a04';

  // if(route.state){
  //   if(route.state.routes[1]){
  //     console.log(route.state.routes[1].name , 'route');
  //   }else{
  //     console.log(route.state.routes[0].name , 'route');
  //   }
  // }
  const handleNavigate = () => {
    navigation.dispatch(
      CommonActions.reset({
        routes: [{name: props.label}],
      }),
    );
  };

  if (props.label === 'Extra') {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={() => handleNavigate()} 
      style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
      <View style={{alignItems: 'center'}}>
        <Image
          source={icon}
          style={{height: screenHeight * 0.038, resizeMode: 'contain'}}
        />
        <Text
          style={{
            fontSize: screenHeight * 0.0125,
            color: Fcolor,
            paddingTop: 4,
          }}>
          {props.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

