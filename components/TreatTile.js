import React from 'react';
import { TouchableHighlight, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import { setServices, signOut, checkOut, setFeedback } from '../actions';
import HTML from 'react-native-render-html';
import { apiActiveURL, appId, appKey } from '../ApiBaseURL';
import Axios from 'axios';
// import { handleSessionId } from './Logout';


const TreatTile = (props) => {
    var [isPress, setIsPress] = React.useState(false);
    const navigation = useNavigation();


    return (
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#D3D3D3', '#6697D2']}
            style={{ borderRadius: 10, marginBottom: 15, marginRight: 10 }}>
            <TouchableHighlight
                style={isPress ? styles.tilePressed : styles.tileNormal}
                activeOpacity={1}
                underlayColor="#fff"

                onPress={() => {
                    setIsPress(true);
                    setTimeout(() => {
                        setIsPress(false);
                        navigation.navigate('TreatDetail', { treat: props.services });
                    }, 0)
                }}
            >
                <View style={{ paddingHorizontal: 5 }}>
                    <Text
                        style={isPress ? styles.tileTextPressed : styles.tileTextNormal}>
                        {props.services.title}
                    </Text>
                    {/* {props.suburb === '' ? <Text style={styles.suburbtext}>({props.services.subrub})</Text> : <></>} */}

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


                </View>
            </TouchableHighlight>
        </LinearGradient>
    );
};

const mapStateToProps = (state) => ({
    ChildCatId: state.ChildCategory.id,
    ChildCatName: state.ChildCategory.name,
    token: state.LoginDetails.token,
    userId: state.LoginDetails.userId,

    suburb: state.HotelDetails.suburb,
});

const mapDispatchToProps = (dispatch) => ({
    signOut: (data) => {
        console.log(data, 'whatson data')
        dispatch(signOut(data));

    },
    checkOut: (data) => {
        dispatch(checkOut());
    },

    setFeedback: (msgTitle, msgBody, visible, mynav) => {
        const data = {
            msgTitle: msgTitle,
            msgBody: msgBody,
            visible: visible,
            mynav: mynav,
        };
        dispatch(setFeedback(data));
    },

    setServices: (id, name) => {
        const data = {
            id: id,
            name: name,
        };
        dispatch(setServices(data));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(TreatTile);


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
        color: '#6697D2',
    },
    tileTextPressed: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '700',
        color: '#6697D2',
    },
    desc: {
        color: 'black',
        textAlign: 'center',
        fontSize: 12,
        paddingTop: 3,
    },
    suburbtext: {
        textAlign: 'center',
        fontSize: 12,
        // fontWeight: '100',
        color: '#000'
    },
});

