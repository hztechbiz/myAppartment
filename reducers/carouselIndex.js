const initialState = {
    carouselTotalIndex: null,
    carouselCurrentIndex: 0,
};

const carouselIndex = (state = initialState, action) => {
    switch ( action.type ){
        case 'SET_CAROUSEL_TOTAL_INDEX':
            let carouselTotalIndex = action.payload.carouselTotalIndex;
            console.log('carouselTotalIndex', carouselTotalIndex);
            return { ...state , carouselTotalIndex: carouselTotalIndex };

        case 'SET_CAROUSEL_CURRENT_INDEX':
            let carouselCurrentIndex = action.payload.carouselCurrentIndex+1;
            console.log('carouselCurrentIndex', carouselCurrentIndex+1);
            return { ...state , carouselCurrentIndex: carouselCurrentIndex+1 };

        default:
            return state;
    }
};

export default carouselIndex;