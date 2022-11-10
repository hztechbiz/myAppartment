const initialState = {
    id: 0,
    name: '',
};

const beauty = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_BEAUTY':
            let id = action.payload.id;
            let name = action.payload.name;
            return { ...state, id: id, name: name };

        default:
            return state;
    }
};

export default beauty;