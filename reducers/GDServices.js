const initialState = {
    id: 0 ,
    name: '' ,
};

const GDServices = (state = initialState, action) => {
    switch ( action.type ){
        case 'SET_GD_SERVICES':
            let id = action.payload.id;
            let name = action.payload.name;
            return { ...state , id: id, name: name };

        default:
            return state;
    }
};

export default GDServices;