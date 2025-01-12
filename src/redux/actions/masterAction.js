import * as actionTypes from '../action-types';

//! Free Minutes 
export const getFreeMinutes = payload => ({
    type: actionTypes?.GET_FREE_MINUTES, payload
});

export const setFreeMinutes = payload => ({
    type: actionTypes?.SET_FREE_MINUTES, payload
});

export const createFreeMinutes = payload => ({
    type: actionTypes?.CREATE_FREE_MINUTES, payload
});

//! Platform Charges 
export const getPlatformCharges = payload => ({
    type: actionTypes?.GET_PLATFORM_CHARGES, payload
});

export const setPlatformCharges = payload => ({
    type: actionTypes?.SET_PLATFORM_CHARGES, payload
});

export const createPlatformCharges = payload => ({
    type: actionTypes?.CREATE_PLATFORM_CHARGES, payload
});

export const deletePlatformCharges = payload => ({
    type: actionTypes?.DELETE_PLATFORM_CHARGES, payload
});