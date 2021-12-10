const initialState = {
    carouselTotalIndex: 0,
    carouselCurrentIndex: 0,
};

const carouselIndex = (state = initialState, action) => {
    switch ( action.type ){
        case 'SET_CAROUSEL_TOTAL_INDEX':
            console.log('carouselTotalIndex', action.payload);
            return { ...state , carouselTotalIndex: action.payload };

        case 'SET_CAROUSEL_CURRENT_INDEX':
            // let carouselCurrentIndex = action.payload.carouselCurrentIndex+1;
            if(state.carouselTotalIndex <= state.carouselCurrentIndex + 1){
                return { ...state , carouselCurrentIndex: 0 };
            }else{
                console.log('carouselCurrentIndex', state.carouselCurrentIndex + 1 );
                return { ...state , carouselCurrentIndex: state.carouselCurrentIndex + 1 };
            }
            

        default:
            return state;
    }
};

export default carouselIndex;