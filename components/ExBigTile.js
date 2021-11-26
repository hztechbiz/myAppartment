import React from 'react';
import {TouchableHighlight, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { connect } from 'react-redux';
import { setExperienceServices, setPromotionServices, setServices } from '../actions';
import HTML from 'react-native-render-html';
import { apiActiveURL, appId, appKey } from '../ApiBaseURL';
import Axios from 'axios';

const Tile = (props) => {
  var [isPress, setIsPress] = React.useState(false);
  const navigation = useNavigation();

  const fetchServiceAddView = (serviceid) => {
    const url = `${apiActiveURL}/service/add_view/${serviceid}`;
    const options = {
      method: 'GET',
      headers: {
        AppKey: appKey,
        Token: props.token,
        AppId: appId,
      },
      url,
    };
    Axios(options)
      .then((res) => {
        console.log('servicesadd_view', serviceid, res);
      })
      .catch((error) => {
        console.log(error, 'servicesadd_view');
      });
  };

  return (
    <LinearGradient
    start={{x: 0, y: 0}}
    end={{x: 1, y: 0}}
    colors={['#D3D3D3', '#e57b0d']}
      style={{ borderRadius: 10, marginBottom: 15, marginRight: 10}}>
      <TouchableHighlight
        style={isPress ? styles.tilePressed : styles.tileNormal}
        activeOpacity={1}
        underlayColor="#fff"
        //onHideUnderlay={() => setIsPress(false)}
        //onShowUnderlay={() => setIsPress(true)}
        onPress={() =>
          {
            fetchServiceAddView(props.services.id);
            setIsPress(true);
            setTimeout(() => {
            setIsPress(false);
            props.setExperienceServices(props.services.id , props.services.title);
            navigation.navigate('ExBusiness');
          }, 0)}}
          >
        <View style={{paddingHorizontal: 5}}>
          <Text
            style={isPress ? styles.tileTextPressed : styles.tileTextNormal}>
            {props.services.title}
          </Text>

          <HTML
            tagsStyles={{
              p: {
                color: 'black',
                textAlign: 'center',
                fontSize: 11,
                paddingTop: 3,
                paddingLeft: 4,
                paddingRight: 4,
              },
            }}
            source={{
              html:
                props.services.short_description == ''
                  ? '<p></p>'
                  : props.services.short_description,
            }}
          />
          {/* {props.services.short_description !== '' ? (
            <Text style={styles.desc}>{props.services.short_description}</Text>
          ) : (
            <></>
          )} */}
        </View>
      </TouchableHighlight>
    </LinearGradient>
  );
};

const mapStateToProps = (state) => ({
  ChildCatId: state.ChildExperience.id,
  ChildCatName: state.ChildExperience.name,
  token: state.LoginDetails.token,
});

const mapDispatchToProps = (dispatch) => ({
  setExperienceServices: (id, name) => {
    const data = {
      id: id,
      name: name,
    };
    dispatch(setExperienceServices(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Tile);


const styles = StyleSheet.create({
  tileNormal: {
    height: 140,
    //flexBasis: '46.75%',
    borderWidth: 2,
    borderColor: '#cac8c8',
    borderRadius: 10,
    //marginRight: 10,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#fff',
    //marginHorizontal: 5
  },
  tilePressed: {
    height: 140,
    //flexBasis: '46.75%',
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
  desc: {
    color: 'black',
    textAlign: 'center',
    fontSize: 12,
    paddingTop: 3,
  },
});


// import React from 'react';
// import {TouchableHighlight, Text, View} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import {StyleSheet} from 'react-native';
// import {useNavigation} from '@react-navigation/native';

// const ProBigTile = (props) => {
//   var [isPress, setIsPress] = React.useState(false);
//   const navigation = useNavigation();

//   return (
//     <LinearGradient
//       start={{x: 0, y: 0}}
//       end={{x: 1, y: 0}}
//       colors={['#D3D3D3', '#e57b0d']}
//       style={{height: 140, borderRadius: 10, marginBottom: 15}}>
//       <TouchableHighlight
//         style={isPress ? styles.tilePressed : styles.tileNormal}
//         activeOpacity={1}
//         underlayColor="#fff"
//         //onHideUnderlay={() => setIsPress(false)}
//         //onShowUnderlay={() => setIsPress(true)}

//         onPress={() => {
//           setIsPress(true);
//           setTimeout(() => {
//             setIsPress(false);
//             navigation.navigate('Promotion Business');
//           }, 500);
//         }}>
//         <View style={{}}>
//           <Text
//             style={isPress ? styles.tileTextPressed : styles.tileTextNormal}>
//             {props.title}
//           </Text>
//           <Text
//             style={{
//               textAlign: 'center',
//               fontSize: 11,
//               paddingTop: 3,
//               paddingLeft: 14,
//               paddingRight: 14,
//               color: '#606060',
//             }}>
//             {props.content}
//           </Text>
//         </View>
//       </TouchableHighlight>
//     </LinearGradient>
//   );
// };

// export default ProBigTile;

// const styles = StyleSheet.create({
//   tileNormal: {
//     height: 140,
//     width: '100%',
//     borderWidth: 2,
//     borderColor: '#cac8c8',
//     borderRadius: 10,
//     marginRight: 10,
//     justifyContent: 'center',
//     alignContent: 'center',
//     backgroundColor: '#fff',
//   },
//   tilePressed: {
//     height: 140,
//     width: '100%',
//     borderWidth: 3,
//     borderColor: 'transparent',
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignContent: 'center',
//     backgroundColor: '#fff',
//   },
//   tileTextNormal: {
//     textAlign: 'center',
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#000',
//   },
//   tileTextPressed: {
//     textAlign: 'center',
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#D3D3D3',
//   },
// });
