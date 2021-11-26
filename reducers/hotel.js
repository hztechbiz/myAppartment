let initialState = {
    hasHotel: false,
    suburb: '',
    isAll: false,
    hotel: {}
};

const hotelReducer = (state = initialState, action) => {
    switch ( action.type ){
        case 'CHECK_IN':
            let response = action.payload;
            //let gtoken = action.payload.data.data.token;
            //console.log(gtoken, 'reducer');
            if (response){
                console.log('Checked In', response);
                return { ...state, hasHotel: true, hotel: response};
            }else{
                console.log('Check In Failed');
                return state;
            }
        
        case 'SET_SUBURB':
            let sub = action.payload;
            return {...state , suburb: sub}

        case 'SET_ISALL':
            let isAll = action.payload;
            return {...state , isAll: isAll}

        case 'CHECK_OUT':
            console.log('Logged Out');
            return { ...state, hasHotel: false, suburb: '', hotel: {}};
        default:
            return state;
    }
};

export default hotelReducer;