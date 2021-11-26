const initialState = {
    id: 0 ,
    name: '' ,
};

const promotion = (state = initialState, action) => {
    switch ( action.type ){
        case 'SET_PRO':
            let id = action.payload.id;
            let name = action.payload.name;
            return { ...state , id: id, name: name };

        default:
            return state;
    }
};

export default promotion;