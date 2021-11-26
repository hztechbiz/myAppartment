import React from 'react';
import {TouchableHighlight, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { connect } from 'react-redux';
import { setCategory, setChildCategory, setRoute, setServices } from '../actions';

const Tile = (props) => {
  var [isPress, setIsPress] = React.useState(false);
  const navigation = useNavigation();

  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      colors={['#D3D3D3', '#e57b0d']}
      style={{height: 90, width: 150, borderRadius: 10, marginRight: 10}}>
      <TouchableHighlight
        style={isPress ? styles.tilePressed : styles.tileNormal}
        activeOpacity={1}
        underlayColor="#fff"
        //onHideUnderlay={() => setIsPress(false)}
        //onShowUnderlay={() => setIsPress(true)}
        onPress={() => {
          setIsPress(true);
          setTimeout(() => {
            setIsPress(false);
            props.setChildCategory(props.id, props.title); 
            props.haschild === true
              ? "" : navigation.navigate('Services');
            
               
              //navigation.navigate('ChildCategories');
          }, 0);
        }}>
        <Text style={isPress ? styles.tileTextPressed : styles.tileTextNormal}>
          {props.title}
        </Text>
      </TouchableHighlight>
    </LinearGradient>
  );
};

const mapStateToProps = (state) => ({
  CatId: state.Category.id,
  ChildCatId: state.ChildCategory.id,
});

const mapDispatchToProps = (dispatch) => ({
  setChildCategory: (id , name) => {
    const data = {
      id: id,
      name: name,
    };
    dispatch(setChildCategory(data));
  },
  setRoute: (prevroute , parentID) => {
    const data = {
      prevroute: prevroute,
      parentID: parentID,
    };
    dispatch(setRoute(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Tile);


const styles = StyleSheet.create({
  tileNormal: {
    height: 90,
    width: 150,
    borderWidth: 2,
    borderColor: '#cac8c8',
    borderRadius: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#fff',
  },
  tilePressed: {
    height: 90,
    width: 150,
    borderWidth: 3,
    borderColor: 'transparent',
    borderRadius: 10,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#fff',
  },
  tileTextNormal: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  tileTextPressed: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#D3D3D3',
  },
});
