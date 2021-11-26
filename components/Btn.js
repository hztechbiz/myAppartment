import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Button, Title, Text} from 'react-native-paper';

const Btn = (props) => {
  const navigation = useNavigation();
  return(
    <Button
    style={[styles.btn , props.style]}
    color={props.color ? props.color : "#fff"}
    labelStyle={{fontSize: 9, textAlign: 'center'}}
    onPress={props.onPress}>
    {props.label}
  </Button>
  );
};

export default Btn;

const styles = StyleSheet.create({
    btn: {
        justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 14,
    }
});
