

import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Image,
    Dimensions,
    Keyboard,
    Linking,
    TouchableOpacity,
} from 'react-native';
import HTML from 'react-native-render-html';
import { connect } from 'react-redux';
import BackgroundLayout from '../components/BackgroundLayout';
import Btn from '../components/Btn';
import FeedbackModal from '../components/FeedbackModal';
import LogoBar from '../components/LogoBar';
import TitleBar from '../components/TitleBar';

const screenWidth = Dimensions.get('window').width;

const TreatVoucher = (props) => {
    const [SView, setSView] = React.useState('50%');

    const navigation = useNavigation();
    //console.log(navigation.state, 'navigation');
    const handleNavigateHome = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 1,
                key: null,
                routes: [{ name: 'Extra' }],
            }),
        );
    };




    const showServiceDetail = () => {
        return (
            <View
                style={{
                    height: SView,
                    marginTop: 20,
                    //   paddingLeft: '5.55%',
                    //   paddingRight: '5.55%',
                }}>
                <ScrollView showsVerticalScrollIndicator={false}>

                    <Image
                        source={{ uri: props.route?.params?.treat?.file ? props.route?.params?.treat?.file : featuredpromotion }}
                        style={{
                            height: 200,
                            width: screenWidth * 0.89,
                            marginTop: 15,
                            resizeMode: 'cover',
                            borderRadius: 10,
                            marginHorizontal: '5.55%',
                        }}
                    />
                    <Text
                        style={{
                            marginTop: 10,
                            marginHorizontal: '6%',
                            textAlign: 'left',
                            fontWeight: 'bold',
                        }}>
                        Description:
                    </Text>
                    <HTML
                        tagsStyles={{
                            p: {
                                marginVertical: 20,
                                marginHorizontal: '8%',
                            },
                        }}
                        source={{ html: props.route.params.treat.long_description == '' ? '<p></p>' : props.route.params.treat.long_description }}
                    />

                    <Text
                        style={{
                            marginVertical: 20,
                            marginHorizontal: '8%',
                            fontWeight: 'bold'
                        }}
                    >How to claim your Treat
                    </Text>

                    <HTML
                        tagsStyles={{
                            p: {
                                marginVertical: 20,
                                marginHorizontal: '8%',
                                // textAlign: 'center',
                            },
                        }}
                        source={{ html: props.route.params.treat.how_to_redeem == '' ? '<p></p>' : props.route.params.treat.how_to_redeem }}
                    />
                    <Text style={{
                        marginVertical: 20,
                        marginHorizontal: '8%',
                        fontWeight: 'bold'

                    }}>Terms and Condition</Text>
                    <HTML
                        tagsStyles={{
                            p: {
                                marginVertical: 20,
                                marginHorizontal: '8%',
                                // textAlign: 'center',
                            },
                        }}
                        source={{ html: props.route.params.treat.terms == '' ? '<p></p>' : props.route.params.treat.terms }}
                    />

                    <View
                        style={{
                            flexDirection: 'row',
                            paddingHorizontal: '5.55%',
                            marginTop: 20,
                            justifyContent: 'center'
                        }}>
                        <TouchableOpacity onPress={() => handleNavigateHome()}
                            style={{
                                backgroundColor: '#8bd12a',
                                height: 60,
                                width: '40%',
                                borderRadius: 10,
                                marginLeft: 5,
                                paddingHorizontal: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text>
                                Back
                            </Text>
                        </TouchableOpacity>


                        <TouchableOpacity
                            onPress={() => props.navigation.navigate('Treats',
                            )}
                            style={{
                                backgroundColor: '#6697D2',
                                height: 60,
                                width: '40%',
                                borderRadius: 10,
                                marginLeft: 5,
                                paddingHorizontal: 5,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    color: '#fff',
                                    fontSize: 12,
                                    textTransform: 'uppercase',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                }}>
                                Your Bag of Treats</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>

        );
    };

    return (
        <SafeAreaView style={styles.container}>

            <FeedbackModal />
            {/* {request360Modal()} */}
            <BackgroundLayout />
            <LogoBar title='Your Bag of Treats' />
            <TitleBar title={props.route.params.treat.title} />





            {/* <TitleBar sub={true} /> */}

            {/* {loader === true ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator animating={true} color="#e57c0b" />
                </View>
            ) : ( */}

            {showServiceDetail()}
            {/* )} */}

        </SafeAreaView>
    );
}
const mapStateToProps = (state) => ({
    hotelName: state.HotelDetails.hotel.name,
    hotelId: state.HotelDetails.hotel.id,
    // listingType: state.ListingType,
    token: state.LoginDetails.token,
    userid: state.LoginDetails.userId,
    //  CatId: state.Category.id,
    //  CatName: state.Category.name,
    ChildCatId: state.ChildCategory.id,
    ServiceName: state.Services.name,
    servicedetailid: state.Services.id,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(TreatVoucher);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        ...StyleSheet.absoluteFill,
    },
    containerStyle: {
        backgroundColor: 'white',
        paddingHorizontal: '5.55%',
        marginHorizontal: '5.55%',
        height: '60%',
        borderRadius: 10,
    },
    containerStyle2: {
        backgroundColor: 'white',
        paddingHorizontal: '5.55%',
        marginHorizontal: '18%',
        // height: '27%',
        borderRadius: 10,
    },
});