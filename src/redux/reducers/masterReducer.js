import * as actionTypes from "../action-types";

const initialState = {
    freeMinutesData: null,
    platformChargesData: [],
};

const masterReducer = (state = initialState, actions) => {
    const { payload, type } = actions;

    switch (type) {
        case actionTypes.SET_FREE_MINUTES:
            return { ...state, freeMinutesData: payload };

        case actionTypes.SET_PLATFORM_CHARGES:
            return { ...state, platformChargesData: payload };

        default: {
            return state;
        }
    }
};

export default masterReducer;