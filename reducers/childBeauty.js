const initialState = {
    id: 0,
    name: '',
};

const childBeauty = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CHILD_BEAUTY':
            let id = action.payload.id;
            let name = action.payload.name;
            return { ...state, id: id, name: name };

        default:
            return state;
    }
};

export default childBeauty;