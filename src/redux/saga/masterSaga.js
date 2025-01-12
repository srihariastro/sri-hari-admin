import Swal from "sweetalert2";
import { call, put, takeLeading } from "redux-saga/effects";
import * as actionTypes from "../action-types";
import { deleteAPI, getAPI, postAPI } from "../../utils/api-function";
import { create_free_minutes, create_platform_charges, delete_platform_charges, get_free_minutes, get_platform_charges } from "../../utils/api-routes";
import { Color } from "../../assets/colors";

function* getFreeMinutes() {
    try {
        yield put({ type: actionTypes.SET_IS_LOADING, payload: true });
        const { data } = yield getAPI(get_free_minutes);
        console.log("Get Free Minutes Saga Response ::: ", data);

        if (data) {
            yield put({ type: actionTypes.SET_FREE_MINUTES, payload: data });
            yield put({ type: actionTypes.SET_IS_LOADING, payload: false });
        }

    } catch (error) {
        yield put({ type: actionTypes.SET_IS_LOADING, payload: false });
        console.log("Get Free Minutes Saga Error ::: ", error);
    }
};

function* createFreeMinutes(action) {
    try {
        const { payload } = action;
        console.log("Payload ::: ", payload);

        const { data } = yield postAPI(create_free_minutes, payload?.data);
        console.log("Create Free Minutes Saga Response ::: ", data);

        if (data) {
            Swal.fire({ icon: "success", title: 'Success', text: "Free Minutes Updated Successfully", showConfirmButton: false, timer: 2000 });
            yield put({ type: actionTypes.GET_FREE_MINUTES, payload: null });
        }

    } catch (error) {
        Swal.fire({ icon: "error", title: 'Failed', text: error?.response?.data?.message + ' ' + error?.response?.data?.error, showConfirmButton: false, timer: 2000 });
        console.log("Create Free Minutes Saga Error ::: ", error);
    }
};

function* getPlatformCharges() {
    try {
        yield put({ type: actionTypes.SET_IS_LOADING, payload: true });
        const { data } = yield getAPI(get_platform_charges);
        console.log("Get Platform Charges Saga Response ::: ", data);

        if (data) {
            yield put({ type: actionTypes.SET_PLATFORM_CHARGES, payload: data });
            yield put({ type: actionTypes.SET_IS_LOADING, payload: false });
        }

    } catch (error) {
        yield put({ type: actionTypes.SET_IS_LOADING, payload: false });
        console.log("Get Platform Charges Saga Error ::: ", error);
    }
};

function* createPlatformCharges(action) {
    try {
        const { payload } = action;
        console.log("Payload ::: ", payload);

        const { data } = yield postAPI(create_platform_charges, payload?.data);
        console.log("Create Platform Charges Saga Response ::: ", data);

        if (data) {
            Swal.fire({ icon: "success", title: 'Success', text: "Platform Charges Created Successfully", showConfirmButton: false, timer: 2000 });
            yield put({ type: actionTypes.GET_PLATFORM_CHARGES, payload: null });
            yield call(payload?.onComplete);
        }

    } catch (error) {
        Swal.fire({ icon: "error", title: 'Failed', text: error?.response?.data?.message + ' ' + error?.response?.data?.error, showConfirmButton: false, timer: 2000 });
        console.log("Create Platform Charges Saga Error ::: ", error);
    }
};

function* deletePlatformCharges(action) {
    try {
        const { payload } = action;

        const result = yield Swal.fire({ icon: "warning", title: `Are you sure ?`, text: "You want to delete!!!", showCancelButton: true, confirmButtonColor: Color.primary, cancelButtonColor: 'grey', confirmButtonText: "Yes", cancelButtonText: "No" });

        if (result.isConfirmed) {
            const { data } = yield deleteAPI(delete_platform_charges(payload));
            console.log("Delete Platform Charges Saga Response ::: ", data);

            if (data?.message) {
                Swal.fire({ icon: "success", title: 'Success', text: data?.message, showConfirmButton: false, timer: 2000 });
                yield put({ type: actionTypes?.GET_PLATFORM_CHARGES, payload: null });
            }
        }

    } catch (error) {
        Swal.fire({ icon: "error", title: 'Failed', text: "Failed To Delete", showConfirmButton: false, timer: 2000 });
        console.log("Delete Platform Charges Saga Error ::: ", error);
    }
};

export default function* masterSaga() {
    yield takeLeading(actionTypes.GET_FREE_MINUTES, getFreeMinutes);
    yield takeLeading(actionTypes.CREATE_FREE_MINUTES, createFreeMinutes);
    yield takeLeading(actionTypes.GET_PLATFORM_CHARGES, getPlatformCharges);
    yield takeLeading(actionTypes.CREATE_PLATFORM_CHARGES, createPlatformCharges);
    yield takeLeading(actionTypes.DELETE_PLATFORM_CHARGES, deletePlatformCharges);
};