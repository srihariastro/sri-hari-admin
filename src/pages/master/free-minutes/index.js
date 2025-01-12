import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Grid, TextField } from "@mui/material";
import { Color } from "../../../assets/colors";
import * as MasterActions from '../../../redux/actions/masterAction';

const FreeMinutes = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { freeMinutesData } = useSelector(state => state?.masterReducer);

    const [inputFieldDetail, setInputFieldDetail] = useState({ free_chat_minutes: freeMinutesData ? Number(freeMinutesData?.free_chat_minutes) : '', free_call_minutes: freeMinutesData ? freeMinutesData?.free_call_minutes : '' });
    const [inputFieldError, setInputFieldError] = useState({ free_chat_minutes: '', free_call_minutes: '' });

    //* Handle Input Field : Error
    const handleInputFieldError = (input, value) => {
        setInputFieldError((prev) => ({ ...prev, [input]: value }))
    }

    //* Handle Input Field : Data
    const handleInputField = (e) => {
        const { name, value } = e.target;
        setInputFieldDetail({ ...inputFieldDetail, [name]: Number(value) });
    };

    //* Handle Validation
    const handleValidation = () => {
        let isValid = true;
        const { free_chat_minutes } = inputFieldDetail;

        if (!free_chat_minutes) {
            handleInputFieldError("free_chat_minutes", "Please Enter Free Chat Minutes")
            isValid = false;
        }

        return isValid;
    };

    //! Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (handleValidation()) {
            console.log("Free minutes :: ", { ...inputFieldDetail });
            const { free_chat_minutes, free_call_minutes } = inputFieldDetail;


            const payload = {
                data: { free_chat_minutes, free_call_minutes },
            }

            //! Dispatching API for Creating Free Minutes
            dispatch(MasterActions.createFreeMinutes(payload));
        }
    };

    useEffect(() => {
        //! Dispatching API For Getting Free Minutes 
        dispatch(MasterActions?.getFreeMinutes());
    }, []);

    useEffect(() => {
        freeMinutesData && setInputFieldDetail({ free_chat_minutes: freeMinutesData?.free_chat_minutes, free_call_minutes: freeMinutesData?.free_call_minutes });
    }, [freeMinutesData]);

    return (
        <>
            <div style={{ padding: "20px", backgroundColor: "#fff", marginBottom: "20px", boxShadow: '0px 0px 5px lightgrey', borderRadius: "10px" }}>
                <div style={{ fontSize: "22px", fontWeight: "500", color: Color.black, marginBottom: "30px", }}>Free Minutes</div>

                <Grid container sx={{ alignItems: "center" }} spacing={3}>
                    <Grid item lg={12} md={12} sm={12} xs={12} >
                        <TextField
                            label={<>Free Chat Minutes <span style={{ color: "red" }}>*</span></>} variant='outlined' fullWidth
                            name='free_chat_minutes' type="number"
                            value={inputFieldDetail?.free_chat_minutes}
                            onChange={handleInputField}
                            error={inputFieldError.free_chat_minutes ? true : false}
                            helperText={inputFieldError.free_chat_minutes}
                            onFocus={() => handleInputFieldError("free_chat_minutes", null)}
                        />
                    </Grid>

                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Grid container sx={{ justifyContent: "space-between" }}>
                            <div onClick={handleSubmit} style={{ fontWeight: "500", backgroundColor: Color.primary, color: Color.white, padding: "10px 20px", borderRadius: "5px", cursor: "pointer", fontSize: "15px" }}>Submit</div>
                        </Grid>
                    </Grid>
                </Grid>
            </div >
        </>
    );
};

export default FreeMinutes;