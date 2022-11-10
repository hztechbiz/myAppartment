import React, { useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    Keyboard,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper'
import BackgroundLayout from '../components/BackgroundLayout';
import LogoBar from '../components/LogoBar';
import TitleBar from '../components/TitleBar';
import BigTile from '../components/OthersBigTile';
import { connect } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { apiActiveURL, appKey, appId } from '../ApiBaseURL';
import Axios from 'axios';
import Tile from '../components/childCategoryTile';
import { setChildCategory, setChildExperience, setChilDBeauty, setChildWhatsOn, setFeedback, setServices, signOut, checkOut } from '../actions';
import FeedbackModal from '../components/FeedbackModal';
// import { handleSessionId } from '../components/Logout';
import BeautyBigTile from '../components/BeautyBigTile';

const BeautyServices = (props) => {
    const [SView, setSView] = React.useState('50%');

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

    const [categories, setCategories] = React.useState([]);
    const [services, setServices] = React.useState([]);
    const [loader, setLoader] = React.useState(false);
    const [loader2, setLoader2] = React.useState(false);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (!isFocused) {
            return;
        }
        fetchServices();
    }, [props, isFocused]);

    // const fetchChildCategories = () => {
    //   const url = `${apiActiveURL}/categories/${props.CatId}`;
    //   const options = {
    //     method: 'GET',
    //     headers: {
    //       AppKey: appKey,
    //       Token: props.token,
    //       AppId: appId
    //     },
    //     url,
    //   };
    //   Axios(options)
    //     .then((res) => {
    //       if (Object.values(res.data.data).length > 0) {
    //         //console.log('render', props.catID, res.data.data);
    //         setCategories(res.data.data);
    //         //props.setChildCategory(res.data.data[0].id, res.data.data[0].title);
    //         if (props.ChildCatId == 0){
    //           let sliceData = Object.values(res.data.data);
    //         props.setChildCategory(sliceData[0].id, sliceData[0].title);
    //         }
    //         fetchServices();
    //         setLoader(true);
    //       } else {
    //         //console.log(Object.values(res.data.data).length, 'categories');
    //         setLoader(false);
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(url, 'rest api');
    //     });
    // };

    // const getChildCategories = (data) => {
    //   let sliceData = Object.values(data);
    //   //props.setChildCategory(sliceData[0].id, sliceData[0].title);
    //   return sliceData;
    // };

    // const showChildCategories = () => {
    //   return (
    //     <>
    //       <View style={{height: 90, marginBottom: 10}}>
    //         <ScrollView
    //           horizontal={true}
    //           showsHorizontalScrollIndicator={false}
    //           scrollEventThrottle={16}>
    //           {getChildCategories(categories).map((category, index) => (
    //             <View key={index}>
    //               <Tile title={category.name} id={category.id} />
    //             </View>
    //           ))}
    //         </ScrollView>
    //       </View>

    //     </>
    //   );
    // };

    const fetchServices = () => {
        let url = '';
        if (props.ChildCatId == 0) {
            url = `${apiActiveURL}/services/${props.CatId}?subrub=${props.suburb}`;
        } else {
            url = `${apiActiveURL}/services/${props.ChildCatId}?subrub=${props.suburb}`;
        }

        const options = {
            method: 'GET',
            headers: {
                AppKey: appKey,
                Token: props.token,
                AppId: appId
            },
            url,
        };
        Axios(options)
            .then((res) => {
                if (res.data.code === 200) {
                    if (Object.values(res.data.data).length > 0) {
                        console.log('render', res.data.data);
                        let sortServices = res.data.data.sort((a, b) => a.display_order - b.display_order);
                        setServices(sortServices);
                        //props.setChildCategory(res.data.data[0].id, res.data.data[0].title);
                        setLoader2(true);
                        console.log(url, 'rest api 2');
                    } else {
                        props.setFeedback('IconResort', 'No Data Found', true, 'Others');
                        console.log(url, 'categories');
                        setLoader2(false);
                    }
                }
                else if (res.data.code === 403) {
                    props.setFeedback('IconResort', 'Session Expired. Logging Out', true, '');
                    setTimeout(() => {

                        props.setFeedback('', '', false, '');
                    }, 2000);
                    // handleSessionId(props.userId, props.token, props)

                }
            })
            .catch((error) => {
                props.setFeedback('IconResort', 'Something Went Wrong...', true, 'Others');

                console.log(url, 'rest api');
            });
    };

    const getServices = (data) => {
        let sliceData = Object.values(data);
        return sliceData;
    };

    const showServices = () => {
        return (
            <>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                        {getServices(services).map((services, index) => (
                            <View
                                key={index}
                                style={{ flexBasis: '50%', paddingHorizontal: 0 }}>
                                <BeautyBigTile services={services} />
                            </View>
                        ))}
                    </View>
                </ScrollView>


            </>
        );
    };
    return (
        <SafeAreaView style={styles.container}>
            <FeedbackModal />
            <BackgroundLayout />
            <LogoBar title={props.hotelName} />
            <TitleBar title={props.ChildCatName} sub={true} />
            <View
                style={{
                    height: SView,
                    marginTop: 20,
                    paddingLeft: '5.55%',
                    paddingRight: '5.55%',
                }}>
                {/* {loader === false ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: 90, marginBottom: 10}}>
          <ActivityIndicator animating={true} color="#02aef6" />
        </View>
      ) : (
        showChildCategories()
      )} */}
                {loader2 === false ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 90, marginBottom: 10 }}>
                        <ActivityIndicator animating={true} color="#02aef6" />
                    </View>
                ) : (
                    showServices()
                )}
            </View>
        </SafeAreaView>
    );
};

const mapStateToProps = (state) => ({
    hotelName: state.HotelDetails.hotel.name,
    // hotelId: state.HotelDetails.hotel.id,
    // listingType: state.ListingType,
    userId: state.LoginDetails.userId,
    token: state.LoginDetails.token,
    CatId: state.Beauty.id,
    CatName: state.Beauty.name,
    ChildCatId: state.ChildBeauty.id,
    ChildCatName: state.ChildBeauty.name,
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

    setChilDBeauty: (id, name) => {
        const data = {
            id: id,
            name: name,
        };
        dispatch(setChilDBeauty(data));
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

export default connect(mapStateToProps, mapDispatchToProps)(BeautyServices);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
