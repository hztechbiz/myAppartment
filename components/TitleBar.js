import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import Btn from '../components/Btn';

const TitleBar = (props) => {
  // console.log(props.logo, 'logo');
  return (
    <View
      style={{ flexDirection: 'row', paddingHorizontal: '5.55%',  justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: '700', width: '50%' ,marginTop: 18}}>{props.title}</Text>
      {props.isGD && props.logo ? (
        <>
          <Image
          source={{ uri: props.logo}}
          // width={30}
          // height={30}
          // resizeMode={'contain'}
          style={{
            // backgroundColor: '#f00',
            width: '48%',
            height: 80,
            resizeMode: 'contain'
          }}
          />
        </>
      ) : (<></>)}

      {props.sub ? (<Text style={{
        fontWeight: '700',
        color: '#5a5a5a',
        textAlignVertical: 'center',
        textTransform: 'uppercase',
        textAlign: 'right',
        fontSize: 12,
        marginTop: 18
      }}>{props.suburb ? `AREA: ${props.cityName}
                ${props.suburb}` : `AREA: ${props.cityName}
                ALL`}</Text>) : (<></>)}

      {props.promo ? (<Text style={{
        fontWeight: '700',
        color: '#5a5a5a',
        textAlignVertical: 'center',
        textTransform: 'uppercase',
        textAlign: 'right',
        fontSize: 10,
        marginTop: 18
      }}>{`AREA: ${props.cityName}`}</Text>) : (<></>)}

    </View>
  );
};

const mapStateToProps = (state) => ({
  cityName: state.HotelDetails.hotel.area,
  logo: state.HotelDetails.hotel.logo,
  suburb: state.HotelDetails.suburb,
});

export default connect(mapStateToProps, null)(TitleBar);

const styles = StyleSheet.create({});
