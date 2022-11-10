import React from 'react';
import { TouchableHighlight, Text, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import { setCarouselCurrentIndexAll, setChildExperience, setChilDBeauty, setChildPromotion, setPromotion } from '../actions';

const childBeautyTile = (props) => {
    var [isPress, setIsPress] = React.useState(false);
    const navigation = useNavigation();

    return (
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#04ac95', '#02aef6']}
            style={{ height: 90, width: 150, borderRadius: 10, marginRight: 10 }}>
            <TouchableHighlight
                style={isPress ? styles.tilePressed : styles.tileNormal}
                activeOpacity={1}
                underlayColor="#fff"
                //onHideUnderlay={() => setIsPress(false)}
                //onShowUnderlay={() => setIsPress(true)}
                onPress={() => {
                    if (props.embed_url == null) {
                        setIsPress(true);
                        setTimeout(() => {
                            setIsPress(false);
                            props.setCarouselCurrentIndexAll();
                            props.setChilDBeauty(props.id, props.title);
                            navigation.navigate('BeautyServices');
                        }, 0);
                    }
                    else {

                        Linking.openURL(props?.embed_url);

                    }
                }}>
                <Text style={isPress ? styles.tileTextPressed : styles.tileTextNormal}>
                    {props.title}
                </Text>
            </TouchableHighlight>
        </LinearGradient>
    );
};

const mapStateToProps = (state) => ({
    // hotelName: state.HotelDetails.hotel.name,
    // hotelId: state.HotelDetails.hotel.id,
    // listingType: state.ListingType,
    // token: state.LoginDetails.token,
});

const mapDispatchToProps = (dispatch) => ({
    setChilDBeauty: (id, name) => {
        const data = {
            id: id,
            name: name,
        };
        dispatch(setChilDBeauty(data));
    },
    setCarouselCurrentIndexAll: () => {
        dispatch(setCarouselCurrentIndexAll());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(childBeautyTile);

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
        color: '#02aef6',
    },
});
