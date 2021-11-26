const initialState = {
    id: 0 ,
    name: '' ,
};

const childPromotion = (state = initialState, action) => {
    switch ( action.type ){
        case 'SET_CHILD_PRO':
            let id = action.payload.id;
            let name = action.payload.name;
            return { ...state , id: id, name: name };

        default:
            return state;
    }
};

export default childPromotion;