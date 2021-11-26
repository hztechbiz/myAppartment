const initialState = 0;

const listingType = (state = initialState, action) => {
    switch ( action.type ){
        case 'LISTING_TYPE':
            return action.payload;

        default:
            return state;
    }
};

export default listingType;