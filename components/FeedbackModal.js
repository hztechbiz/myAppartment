import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Portal, Modal, Title, Text, Dialog, Button} from 'react-native-paper';
import {connect} from 'react-redux';
import {setFeedback} from '../actions';

const FeedbackModal = (props) => {
  const navigation = useNavigation();

  const containerStyle = {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginHorizontal: 20,
  };
  //const [visible, setVisible] = useState(false);
  const hideModal = () => {
    props.setFeedback('', '', false, '');
    if (props.mynav) {
      navigation.navigate(props.mynav);
    }
  };

  const handleNavigate = () => {
    if (props.mynav) {
      navigation.navigate(props.mynav);
    }
    props.setFeedback('', '', false, '');
  };
  return (
    <Portal>
      <Modal
        visible={props.visible}
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}>
        <Title
          style={{
            fontSize: 18,
            textAlign: 'center',
            color: '#6697D2',
            paddingBottom: 15,
          }}>
          {props.msgTitle}
        </Title>
        <Text style={{textAlign: 'center'}}>{props.msgBody}</Text>
        <Dialog.Actions>
          <Button onPress={() => handleNavigate()}>Ok</Button>
        </Dialog.Actions>
      </Modal>
    </Portal>
  );
};

const mapStateToProps = (state) => ({
  msgTitle: state.Feedbackmsg.msgTitle,
  msgBody: state.Feedbackmsg.msgBody,
  visible: state.Feedbackmsg.visible,
  mynav: state.Feedbackmsg.mynav,
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

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackModal);
