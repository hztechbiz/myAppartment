const initialState = {
    msgTitle: '' ,
    msgBody: '' ,
    visible: false,
    mynav: ''
};

const feedbackmsg = (state = initialState, action) => {
    switch ( action.type ){
        case 'SET_FEEDBACK':
            let msgTitle = action.payload.msgTitle;
            let msgBody = action.payload.msgBody;
            let visible = action.payload.visible;
            let mynav = action.payload.mynav;
            return { ...state , msgTitle: msgTitle, msgBody: msgBody, visible: visible, mynav: mynav};

        default:
            return state;
    }
};

export default feedbackmsg;