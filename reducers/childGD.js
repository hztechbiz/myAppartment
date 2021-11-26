const initialState = {
    id: 0 ,
    name: '' ,
};

const childGD = (state = initialState, action) => {
    switch ( action.type ){
        case 'SET_CHILD_GD':
            let id = action.payload.id;
            let name = action.payload.name;
            return { ...state , id: id, name: name };

        default:
            return state;
    }
};

export default childGD;