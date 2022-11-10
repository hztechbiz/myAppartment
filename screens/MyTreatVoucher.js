import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView, Image } from 'react-native';
import {
    ActivityIndicator,
    Modal,
    Portal,
    withTheme,
    Title,
    Text,
    Button,
} from 'react-native-paper';
import BackgroundLayout from '../components/BackgroundLayout';
import { connect } from 'react-redux';
import axios from 'axios';
import {
    setCarouselCurrentIndex,
    setCarouselTotalIndex,
    signOut,
    setFeedback
} from '../actions';
// import { handleSessionId } from '../components/Logout';
import { useIsFocused } from '@react-navigation/native';
import { apiActiveURL, appKey, appId } from '../ApiBaseURL';
import LogoBar from '../components/LogoBar';
import TitleBar from '../components/TitleBar';
// import Tile from '../components/DiscountTile';

import Tile from '../components/MyTreatsTile';
import FeedbackModal from '../components/FeedbackModal';

const MyVoucher = (props) => {
    const [msgTitle, setMsgTitle] = useState('');
    const [msgBody, setMsgBody] = useState('');
    const [couponservices, setCouponServices] = useState([]);
    const [loader, setLoader] = useState(true);
    const [visible, setVisible] = useState(false);
    const hideModal = () => setVisible(false);
    const [SView, setSView] = React.useState('50%');

    const isFocused = useIsFocused();
    const containerStyle = {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 30,
        marginHorizontal: 20,
    };
    useEffect(() => {
        if (!isFocused) {
            return;
        }
        fetchCouponServices();
    }, [props, isFocused]);

    const fetchCouponServices = () => {
        setLoader(true);
        const url = `${apiActiveURL}/get_user_treat_favorites/${props.userid}`;
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
                console.log(
                    'coupons_services',
                    props.userid,
                    res.data,
                    // res.data.data,
                );
                if (res.data.code === 200) {
                    setCouponServices(
                        res.data.data.sort((a, b) =>
                            a.title > b.title ? 1 : b.title > a.title ? -1 : 0,
                        ),
                    );
                    setLoader(false);
                } else {
                    if (res.data.data == true) {
                        // console.log('helloxxxxxxxxxxxxxxxxxxx', res.data.data);
                        props.setFeedback('YourHotel', 'Session Expired. Logging Out', true, '');
                        // handleSessionId(props.userid, props.token, props);
                    } else {
                        setCouponServices([]);
                        props.setFeedback('YourHotel', 'No Favorites Available', true, '');
                        setLoader(false);
                    }
                }
            })
            .catch((error) => {
                props.setFeedback('YourHotel', 'No Data Found...', true, '');

                setLoader(false);
                console.log(error, 'coupons_services api');
            });
    };

    const showCouponServices = () => {
        return (
            <View
                style={{
                    height: SView,
                    marginTop: 20,
                    paddingLeft: '5.55%',
                    paddingRight: '5.55%',
                }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* <Text
            style={{
              lineHeight: 20,
              letterSpacing: 0.5,
              marginBottom: 10,
              textAlign: 'center',
            }}>
            Where the 360 Pass logo appears for a particular restaurant, that
            means the 360 Pass is available for use at that restaurant.{' '}
            <Image
              style={{width: 20, height: 20, marginHorizontal: 5}}
              source={require('../images/wi.png')}
            />{' '}
            means that the 360 Pass is available on weekends as well as
            mid-week. If{' '}
            <Image
              style={{width: 20, height: 20, marginHorizontal: 5}}
              source={require('../images/wid.png')}
            />{' '}
            appears the 360 Pass is not available on weekends - only mid-week.
          </Text> */}

                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                        {couponservices.map((couponservice, index) => (
                            <View key={index} style={{ flexBasis: '50%', marginBottom: 8 }}>
                                <Tile
                                    id={couponservice.id}
                                    title={couponservice.title}
                                    treat={couponservice}
                                    couponid={couponservice.coupon_id}
                                    weekendindicator={couponservice.weekend_indicator}
                                    passindicator={couponservice.passAvailablity_indicator}
                                    fetchCouponServices={fetchCouponServices}
                                    userID={props.userid}
                                />
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        );
    };

    const showfeedbackModal = () => {
        return (
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={hideModal}
                    contentContainerStyle={containerStyle}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Title
                            style={{
                                fontSize: 18,
                                textAlign: 'center',
                                color: '#6697D2',
                                paddingBottom: 15,
                            }}>
                            {msgTitle}
                        </Title>
                        <Text style={{ textAlign: 'center' }}>{msgBody}</Text>
                    </ScrollView>
                </Modal>
            </Portal>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <FeedbackModal />
            <BackgroundLayout />
            <LogoBar
            //         title={`360
            // PASS`}
            // color="#650d88"
            // borderWidth={5}
            // borderColor="#e78200"
            />
            <TitleBar title={`MY VOUCHER & COUPONS`} />
            {showfeedbackModal()}

            {loader === true ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator animating={true} color="#6697D2" />
                </View>
            ) : (
                showCouponServices()
            )}
        </SafeAreaView>
    );
};

const mapStateToProps = (state) => ({
    token: state.LoginDetails.token,
    userid: state.LoginDetails.userId,
});

const mapDispatchToProps = (dispatch) => ({
    signOut: (data) => {
        dispatch(signOut(data));
    },

    setFeedback: (msgTitle, msgBody, visible, mynav) => {
        const data = {
            msgTitle: msgTitle,
            msgBody: msgBody,
            visible: visible,
            mynav: mynav
        };
        dispatch(setFeedback(data));
    },
});

export default withTheme(
    connect(mapStateToProps, mapDispatchToProps)(MyVoucher),
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    btnscontainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});
