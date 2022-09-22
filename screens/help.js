import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Dialog,
  Modal,
  Portal,
  Title,
} from 'react-native-paper';
import BackgroundLayout from '../components/BackgroundLayout';
import LogoBar from '../components/LogoBar';
import TitleBar from '../components/TitleBar';
import {connect} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {apiActiveURL, appKey, appId} from '../ApiBaseURL';
import Axios from 'axios';
import Icon_FA_5 from 'react-native-vector-icons/FontAwesome5';
import {setFeedback} from '../actions';
import FeedbackModal from '../components/FeedbackModal';
import Pdf from 'react-native-pdf';

const Help = (props) => {
  const [SView, setSView] = React.useState('50%');
  const [loader, setLoader] = React.useState(true);
  const [pdfloader, setPdfLoader] = useState(false);
  const [msgTitle, setMsgTitle] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [visible, setVisible] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [howtobtns, setHowToBtns] = useState([]);
  const [pdfuri, setPdfUri] = useState({uri: ''});
  const [pdfmodal, setPdfModal] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    fetchFaqs();
    fetchHowto();
  }, [props, isFocused]);

  const containerStyle = {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
    margin: 20,
  };

  const fetchFaqs = () => {
    const url = `${apiActiveURL}/faq`;
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
        console.log('faq', res);
        if (res.data.code === 200) {
          setFaqs(res.data.data);
          setLoader(false);
        } else {
          console.log('faq', res);
          props.setFeedback('MyApartment', 'No Data Found...', true, '');
          setLoader(false);
        }
      })
      .catch((error) => {
        props.setFeedback('MyApartment', 'No Data Found...', true, '');
        setLoader(false);
        console.log('faq', error);
      });
  };

  const fetchHowto = () => {
    const url = `${apiActiveURL}/how`;
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
        console.log('how', res);
        if (res.data.code === 200) {
          setHowToBtns(res.data.data);
        } else {
          console.log('how', res);
          props.setFeedback('MyApartment', 'No Data Found...', true, '');
        }
      })
      .catch((error) => {
        props.setFeedback('MyApartment', 'No Data Found...', true, '');
        console.log('how', error);
      });
  };

  const howToBtn = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginVertical: 10,
          flexWrap: 'wrap',
        }}>
        {howtobtns.map((howtobtn, index) => (
          <TouchableOpacity
            key={index}
            style={styles.howtobtn}
            onPress={() => handleShowPDF(howtobtn.pdf_url, howtobtn.title)}>
            <Text style={styles.howtotext}>{howtobtn.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const handleAnswer = (question, answer) => {
    setMsgTitle(question);
    setMsgBody(answer);
    setVisible(true);
  };

  const showFAQs = () => {
    return (
      <>
        {howToBtn()}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {faqs.map((faq, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleAnswer(faq.question, faq.answer)}
                style={{
                  flexDirection: 'row',
                  paddingVertical: 15,
                }}>
                <Text
                  style={{
                    fontSize: 17,
                  }}>
                  {faq.question}
                </Text>
                <Icon_FA_5
                  name={'angle-right'}
                  size={15}
                  color="#000"
                  style={{alignSelf: 'center', right: 0, position: 'absolute'}}
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </>
    );
  };

  const hideModal = () => {
    setVisible(false);
  };

  const showAnswer = () => {
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
            <Text style={{textAlign: 'center'}}>{msgBody}</Text>
            {/* <Dialog.Actions>
            <Button onPress={() => handleNavigate()}>Ok</Button>
          </Dialog.Actions> */}
          </ScrollView>
        </Modal>
      </Portal>
    );
  };

  const handleShowPDF = (url, title) => {
    setMsgTitle(title);
    setPdfLoader(true);
    setPdfUri({uri: url, cache: true});
    setPdfModal(true);
    setPdfLoader(false);
  };

  const hideModalPDF = () => {
    setPdfModal(false);
  };

  const showPDF = () => {
    return (
      <Portal>
        <Modal
          visible={pdfmodal}
          onDismiss={hideModalPDF}
          contentContainerStyle={containerStyle}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Title
              style={{
                fontSize: 18,
                textAlign: 'center',
                color: '#6697D2',
              }}>
              {msgTitle}
            </Title>

            {pdfloader === true ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator animating={true} color="#D3D3D3" />
              </View>
            ) : (
              <Pdf
                source={pdfuri}
                onLoadComplete={(numberOfPages, filePath) => {
                  console.log(`number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                  console.log(`current page: ${page}`);
                }}
                onError={(error) => {
                  console.log(error);
                }}
                onPressLink={(uri) => {
                  console.log(`Link presse: ${uri}`);
                }}
                style={styles.pdf}
              />
            )}
          </ScrollView>
          <Dialog.Actions>
            <Button onPress={hideModalPDF}>Close</Button>
          </Dialog.Actions>
        </Modal>
      </Portal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FeedbackModal />
      {showPDF()}
      {showAnswer()}
      <BackgroundLayout />
      <LogoBar title={props.hotelName} />
      <TitleBar title={'HELP'} />
      <View
        style={{
          height: SView,
          marginTop: 20,
          paddingLeft: '5.55%',
          paddingRight: '5.55%',
        }}>
        {loader === true ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              height: 90,
              marginBottom: 10,
            }}>
            <ActivityIndicator animating={true} color="#D3D3D3" />
          </View>
        ) : (
          showFAQs()
        )}
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  hotelName: state.HotelDetails.hotel.name,
  // hotelId: state.HotelDetails.hotel.id,
  // listingType: state.ListingType,
  token: state.LoginDetails.token,
  CatId: state.WhatsOn.id,
  CatName: state.WhatsOn.name,
  ChildCatId: state.ChildWhatsOn.id,
});

const mapDispatchToProps = (dispatch) => ({
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

export default connect(mapStateToProps, mapDispatchToProps)(Help);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  howtobtn: {
    backgroundColor: '#D3D3D3',
    paddingVertical: 10,
    width: '48%',
    marginHorizontal: 3,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  howtotext: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  pdf: {
    // flex:1,
    alignSelf: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.6,
  },
});
