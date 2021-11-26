const initialState = {
    id: 0 ,
    name: '' ,
    prevroute: '',
    parentID: 0
};

const services = (state = initialState, action) => {
    switch ( action.type ){
        case 'SET_SERVICES':
            let id = action.payload.id;
            let name = action.payload.name;
            return { ...state , id: id, name: name};

        case 'SET_ROUTE':
            let prevroute = action.payload.prevroute;
            let parentID = action.payload.parentID;
            return { ...state , prevroute: prevroute, parentID: parentID};

        default:
            return state;
    }
};

export default services;