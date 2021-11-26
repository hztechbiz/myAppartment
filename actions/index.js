export const signIn = (data) => {
    return {
        type: 'SIGN_IN',
        payload: data
    };
};
export const signOut = (data) => {
    return {
        type: 'SIGN_OUT',
        payload: data
    };
};
export const checkIn = (data) => {
    return {
        type: 'CHECK_IN',
        payload: data
    };
};
export const checkOut = () => {
    return {
        type: 'CHECK_OUT',
        //payload: data
    };
};
export const setListingType = (data) => {
    return {
        type: 'LISTING_TYPE',
        payload: data
    };
};
export const setCategory = (data) => {
    return {
        type: 'SET_CAT',
        payload: data
    };
};
export const setChildCategory = (data) => {
    return {
        type: 'SET_CHILD_CAT',
        payload: data
    };
};
export const setServices = (data) => {
    return {
        type: 'SET_SERVICES',
        payload: data
    };
};
export const setPromotion = (data) => {
    return {
        type: 'SET_PRO',
        payload: data
    };
};
export const setChildPromotion = (data) => {
    return {
        type: 'SET_CHILD_PRO',
        payload: data
    };
};
export const setPromotionServices = (data) => {
    return {
        type: 'SET_PRO_SERVICES',
        payload: data
    };
};
export const setWhatsOn = (data) => {
    return {
        type: 'SET_WO',
        payload: data
    };
};
export const setChildWhatsOn = (data) => {
    return {
        type: 'SET_CHILD_WO',
        payload: data
    };
};
export const setWhatsOnServices = (data) => {
    return {
        type: 'SET_WO_SERVICES',
        payload: data
    };
};
export const setExperience = (data) => {
    return {
        type: 'SET_EX',
        payload: data
    };
};
export const setChildExperience = (data) => {
    return {
        type: 'SET_CHILD_EX',
        payload: data
    };
};
export const setExperienceServices = (data) => {
    return {
        type: 'SET_EX_SERVICES',
        payload: data
    };
};
export const setGuestD = (data) => {
    return {
        type: 'SET_GD',
        payload: data
    };
};
export const setChildGD = (data) => {
    return {
        type: 'SET_CHILD_GD',
        payload: data
    };
};
export const setGDServices = (data) => {
    return {
        type: 'SET_GD_SERVICES',
        payload: data
    };
};
export const setFeedback = (data) => {
    return {
        type: 'SET_FEEDBACK',
        payload: data
    };
};
export const setSuburb = (data) => {
    return {
        type: 'SET_SUBURB',
        payload: data
    };
};
export const setIsAll = (data) => {
    return {
        type: 'SET_ISALL',
        payload: data
    };
};
export const setRoute = (data) => {
    return {
        type: 'SET_ROUTE',
        payload: data
    };
};
export const setOthers = (data) => {
    return {
        type: 'SET_OTHERS',
        payload: data
    };
};
export const setChildOthers = (data) => {
    return {
        type: 'SET_CHILD_OTHERS',
        payload: data
    };
};
export const setOthersServices = (data) => {
    return {
        type: 'SET_OTHERS_SERVICES',
        payload: data
    };
};