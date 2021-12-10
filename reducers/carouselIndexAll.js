const initialState = {
    carouselTotalIndexAll: 0,
    carouselCurrentIndexAll: 0,
};

const carouselIndexAll = (state = initialState, action) => {
    switch ( action.type ){
        case 'SET_CAROUSEL_TOTAL_INDEX_ALL':
            console.log('carouselTotalIndexAll', action.payload);
            return { ...state , carouselTotalIndexAll: action.payload };

        case 'SET_CAROUSEL_CURRENT_INDEX_ALL':
            // let carouselCurrentIndex = action.payload.carouselCurrentIndex+1;
            if(state.carouselTotalIndexAll <= state.carouselCurrentIndexAll + 1){
                return { ...state , carouselCurrentIndexAll: 0 };
            }else{
                console.log('carouselCurrentIndexAll', state.carouselCurrentIndexAll + 1 );
                return { ...state , carouselCurrentIndexAll: state.carouselCurrentIndexAll + 1 };
            }
            

        default:
            return state;
    }
};

export default carouselIndexAll;