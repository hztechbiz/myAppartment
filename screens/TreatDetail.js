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
import BackgroundLayout from '../components/BackgroundLayout';
import LogoBar from '../components/LogoBar';
import TitleBar from '../components/TitleBar';
import BigTile from '../components/BigTile';
import { ActivityIndicator, Button, Modal, Portal, Provider } from 'react-native-paper';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { connect } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { apiActiveURL, appId, appKey } from '../ApiBaseURL';
import Axios from 'axios';
import HTML from 'react-native-render-html';
import { setFeedback, signOut, checkOut } from '../actions';
// import { handleSessionId } from '../components/Logout';

import FeedbackModal from '../components/FeedbackModal';
// import { handleAnalytics } from '../components/Analytics';

const screenWidth = Dimensions.get('window').width;

const TreatDetail = (props) => {
    console.log(props.route.params.treat.phone, 'params')
    const [SView, setSView] = React.useState('57%');

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
        Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

        // cleanup function
        return () => {
            Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
            Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
        };
    }, []);

    const _keyboardDidShow = () => {
        setSView('28%');
    };

    const _keyboardDidHide = () => {
        setSView('50%');
    };

    const [visible, setVisible] = React.useState(false);
    //   const [servicedetail, setServiceDetail] = useState([]);
    const [loader, setLoader] = useState(true);
    const [coupondetails, setCouponDetails] = useState({});
    const [websiteUrl, setWebsiteUrl] = useState("");

    const [servicelatitude, setServiceLatitude] = useState('');
    const [servicelongitude, setServiceLongitude] = useState('');
    const [servicephone, setServicePhone] = useState('');
    const [servicebookingurl, setServiceBookingURl] = useState('');
    const [promodetails, setPromoDetails] = useState();
    const [confirmationcode, setConfirmationCode] = useState('');
    const [address, setAddress] = useState('');
    const [featuredpromotion, setFeaturedPromotion] = useState(
        require('../images/Hotel360-assets/promotion-placeholder-2.png'),
    );

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const isFocused = useIsFocused();

    useEffect(() => {
        // console.log(props.ServiceName, 'ServiceName')
        if (!isFocused) {
            return;
        }
        // setServiceDetail([]);
        // setLoader(true);


        // if (props.userid != 0) {

        //   handleAnalytics("Business_Feature_Page", {
        //     hotelName: props?.hotelName, serviceId: props.route.params.promoid, serviceName: props?.route?.params?.promotitle, listingType: "Experiences, Offers & Promotions"
        //   })
        //   addToLog('Business Feature Page');
        // }
    }, [props, isFocused]);





    const addToFavorite = (isShow) => {
        console.log(props.route.params.treat.id, '----------addto favdata------');
        // return;
        const url = `${apiActiveURL}/add_treat_favourite?user_id=${props.userid}&treat_id=${props.route.params.treat.id}`;
        const options = {
            method: 'POST',
            headers: {
                AppKey: appKey,
                Token: props.token,
                AppId: appId,
            },
            url,
        };
        Axios(options)
            .then(function (response) {
                // if (response.data.code === 200) {
                console.log(response.data, 'response.data')
                if (response.data.status) {

                    if (isShow) {
                        props.setFeedback(
                            'YourHotel',
                            `${props.route.params.treat.title} has been Added to Treat Voucher Favorites`,
                            true,
                            '',
                        );
                        // setVisibleFeedback(true);
                    } else {
                        console.log(
                            `${props.route.params.treat.title} has been Added to Treat Voucher Favorites`,
                        );
                    }
                } else {
                    if (isShow) {
                        props.setFeedback(
                            'YourHotel',
                            `${props.route.params.treat.title} has already been Added to Treat Voucher Favorites`,
                            true,
                            '',
                        );
                        // setVisibleFeedback(true);
                    } else {
                        console.log(
                            `${props.route.params.treat.title} has already been Added to Treat Voucher Favorites`,
                        );
                    }
                }
                //    else if (response.data.code === 403) {
                //         props.setFeedback(
                //             'YourHotel',
                //             `${props.ServiceName} has already been Added to Treat Voucher Favorites`,
                //             true,
                //             '',
                //         );

                //     }
                // console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const handleShowPhoneDial = () => {
        let phoneNumber = '';
        if (Platform.OS === 'android') {
            phoneNumber = `tel:${props?.route?.params?.treat?.phone}`;
        } else {
            phoneNumber = `telprompt:${props?.route?.params?.treat?.phone}`;
        }
        if (props?.route?.params?.treat?.phone) {
            Linking.openURL(phoneNumber);
        } else {
            props.setFeedback('YourHotel', 'Something went Wrong ..', true, '');
        }
    };

    const handleShowBookOnline = () => {
        if (props?.route?.params?.treat?.url) {
            Linking.openURL(props?.route?.params?.treat?.url);
        } else {
            hideModal();
            props.setFeedback('YourHotel', 'Not Available', true, '');
        }

    };


    const showPromoDetail = () => {
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

                    <View
                        style={{
                            flexDirection: 'row',
                            paddingHorizontal: '5.55%',
                            marginTop: 20,
                        }}>
                        {props.route.params.treat.phone != "" || props.route.params.treat.url != "" ?
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#D3D3D3',
                                    height: 60,
                                    width: '30%',
                                    borderRadius: 10,
                                    marginRight: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}

                                onPress={() => {
                                    showModal()

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
                                    CALL OR BOOK NOW
                                </Text>
                            </TouchableOpacity>
                            : <></>}




                        <TouchableOpacity
                            onPress={() => props.navigation.navigate('TreatVoucher',
                                {
                                    treat: props.route.params.treat,
                                })}
                            style={{
                                backgroundColor: '#6697D2',
                                height: 60,
                                width: '30%',
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
                                Treat Voucher</Text>
                        </TouchableOpacity>



                        <TouchableOpacity
                            // onPress={handleRequestPass}
                            style={{
                                backgroundColor: '#8bd12a',
                                height: 60,
                                width: '30%',
                                borderRadius: 10,
                                marginLeft: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={() => addToFavorite(true)}
                        >
                            <Text
                                style={{
                                    color: '#fff',
                                    fontSize: 12,
                                    textTransform: 'uppercase',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                }}>
                                Add Voucher to My Favourites
                            </Text>
                        </TouchableOpacity>

                    </View>
                    <Text
                        style={{
                            marginTop: 10,
                            marginHorizontal: '6%',
                            textAlign: 'left',
                            fontWeight: 'bold',
                        }}>
                        Title:
                    </Text>
                    <Text style={{
                        marginVertical: 20,
                        marginHorizontal: '8%',
                    }}>{props.route.params.treat.title}</Text>
                    <Text
                        style={{
                            marginTop: 10,
                            marginHorizontal: '6%',
                            textAlign: 'left',
                            fontWeight: 'bold',
                        }}>
                        Description:
                    </Text>
                    <Text style={{
                        marginVertical: 20,
                        marginHorizontal: '8%',
                    }}>{props.route.params.treat.short_description}</Text>


                    <HTML
                        tagsStyles={{
                            p: {
                                marginVertical: 20,
                                marginHorizontal: '8%',
                            },
                        }}
                        source={{ html: props.route.params.treat.long_description == '' ? '<p></p>' : props.route.params.treat.long_description }}
                    />

                    {/* <Text>{props.route.params.long}</Text> */}
                    <Portal>
                        <Modal
                            visible={visible}
                            onDismiss={hideModal}
                            contentContainerStyle={styles.containerStyle}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                style={{ marginVertical: 20 }}>
                                {props?.route?.params?.treat?.phone != "" ?
                                    <Button
                                        onPress={handleShowPhoneDial}
                                        style={{
                                            backgroundColor: '#8bd12a',
                                            height: 58,
                                            //width: '48.5%',
                                            borderRadius: 10,
                                            marginBottom: 5,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        labelStyle={{
                                            color: '#fff',
                                            textAlign: 'center',
                                            fontSize: 10,
                                        }}>
                                        CALL NOW
                                    </Button>
                                    : <></>}
                                {props?.route?.params?.treat?.url != "" ?
                                    <Button
                                        onPress={handleShowBookOnline}
                                        style={{
                                            backgroundColor: '#6697D2',
                                            height: 58,
                                            //width: '48.5%',
                                            borderRadius: 10,
                                            marginTop: 5,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        labelStyle={{
                                            color: '#fff',
                                            textAlign: 'center',
                                            fontSize: 10,
                                        }}>
                                        BOOK ONLINE
                                    </Button>
                                    : <></>}
                            </ScrollView>
                        </Modal>
                    </Portal>
                </ScrollView>
            </View>
        );
    }

    return (

        <SafeAreaView style={styles.container}>
            <FeedbackModal />
            <BackgroundLayout />
            <LogoBar title={props.hotelName} />
            <TitleBar title={props.route.params.treat.title} sub={true} />
            {!loader === true ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator animating={true} color='#6697D2' />
                </View>
            ) : (
                showPromoDetail()
            )}
        </SafeAreaView>

    );
};

const mapStateToProps = (state) => ({
    hotelName: state.HotelDetails.hotel.name,
    hotelId: state.HotelDetails.hotel.id,
    // listingType: state.ListingType,
    token: state.LoginDetails.token,
    userid: state.LoginDetails.userId,
    //  CatId: state.Category.id,
    //  CatName: state.Category.name,
    ChildCatId: state.ChildCategory.id,
    ServiceName: state.PromotionServices.name,
    ServiceId: state.PromotionServices.id
});

const mapDispatchToProps = (dispatch) => ({
    //  setChildCategory: (id , name) => {
    //    const data = {
    //      id: id,
    //      name: name,
    //    };
    //    dispatch(setChildCategory(data));
    //  },
    signOut: (data) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(TreatDetail);

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
        marginHorizontal: '18%',
        // height: '27%',
        borderRadius: 10,
    },
});
