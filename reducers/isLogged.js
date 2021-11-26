let initialState = {
    isLogged: false,
    token: '',
    userId: 0
};

const loggedReducer = (state = initialState, action) => {
    switch ( action.type ){
        case 'SIGN_IN':
            let response = action.payload.data.status;
            let gtoken = action.payload.data.data.token;
            let u_id = action.payload.data.data.user_id;
            console.log(gtoken, 'reducer');
            if (response){
                console.log('Logged In');
                return { ...state, isLogged: true, token: gtoken, userId: u_id};
            }else{
                console.log('Log In Failed');
                return state;
            }

        case 'SIGN_OUT':
            console.log('Logged Out');
            return { ...state, isLogged: false, token: '', userId: 0};
        default:
            return state;
    }
};

export default loggedReducer;