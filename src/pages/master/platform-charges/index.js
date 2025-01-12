import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Grid, TextField } from "@mui/material";
import { Color } from "../../../assets/colors";
import { DeepSearchSpace } from "../../../utils/common-function";
import MainDatatable from "../../../components/datatable/MainDatatable";
import DatatableHeading from "../../../components/datatable/DatatableHeading";
import * as MasterActions from '../../../redux/actions/masterAction';
import { DeleteSvg } from "../../../assets/svg";

const PlatformCharges = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { platformChargesData } = useSelector(state => state?.masterReducer);
    const [searchText, setSearchText] = useState('');
    const filteredData = DeepSearchSpace(platformChargesData, searchText);

    const [inputFieldDetail, setInputFieldDetail] = useState({ platform_charges: '' });
    const [inputFieldError, setInputFieldError] = useState({ platform_charges: '' });

    //* Handle Input Field : Error
    const handleInputFieldError = (input, value) => {
        setInputFieldError((prev) => ({ ...prev, [input]: value }))
    };

    //* Handle Input Field : Data
    const handleInputField = (e) => {
        const { name, value } = e.target;
        setInputFieldDetail({ ...inputFieldDetail, [name]: Number(value) });
    };

    //* Handle Validation
    const handleValidation = () => {
        let isValid = true;
        const { platform_charges } = inputFieldDetail;

        if (!platform_charges) {
            handleInputFieldError("platform_charges", "Please Enter Platform Charges")
            isValid = false;
        }

        return isValid;
    };

    //! Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (handleValidation()) {
            console.log("Platform Charges ::: ", { ...inputFieldDetail });
            const { platform_charges } = inputFieldDetail;


            const payload = {
                data: { platformChargeAmount: platform_charges },
                onComplete: () => setInputFieldDetail({ platform_charges: '' })
            }

            //! Dispatching API for Creating Platform Charges
            dispatch(MasterActions.createPlatformCharges(payload));
        }
    };

    //* Datatable Column
    const columns = [
        { name: "S.No.", selector: row => filteredData?.indexOf(row) + 1 },
        { name: "Platform Charges", selector: (row) => row?.platformChargeAmount },
        {
            name: "Action",
            cell: (row) => (
                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                    <div onClick={() => dispatch(MasterActions.deletePlatformCharges(row?._id))} style={{ cursor: "pointer" }}><DeleteSvg /></div>
                </div>
            )
        },
    ];

    useEffect(() => {
        //! Dispatching API For Getting Platform Charges 
        dispatch(MasterActions?.getPlatformCharges());
    }, []);

    return (
        <>
            <div style={{ padding: "20px", backgroundColor: "#fff", marginBottom: "20px", boxShadow: '0px 0px 5px lightgrey', borderRadius: "10px" }}>
                <div style={{ fontSize: "22px", fontWeight: "500", color: Color.black, marginBottom: "30px", }}>Platform Charges</div>

                <Grid container sx={{ alignItems: "center" }} spacing={3}>
                    <Grid item lg={12} md={12} sm={12} xs={12} >
                        <TextField
                            label={<>Platform Charges <span style={{ color: "red" }}>*</span></>} variant='outlined' fullWidth
                            name='platform_charges' type="number"
                            value={inputFieldDetail?.platform_charges}
                            onChange={handleInputField}
                            error={inputFieldError.platform_charges ? true : false}
                            helperText={inputFieldError.platform_charges}
                            onFocus={() => handleInputFieldError("platform_charges", null)}
                        />
                    </Grid>

                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Grid container sx={{ justifyContent: "space-between" }}>
                            <div onClick={handleSubmit} style={{ fontWeight: "500", backgroundColor: Color.primary, color: Color.white, padding: "10px 20px", borderRadius: "5px", cursor: "pointer", fontSize: "15px" }}>Submit</div>
                        </Grid>
                    </Grid>
                </Grid>
            </div >

            <div style={{ padding: "20px", backgroundColor: "#fff", marginBottom: "20px", boxShadow: '0px 0px 5px lightgrey', borderRadius: "10px" }}>
                <DatatableHeading title={'Platform Charges'} data={platformChargesData} />

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "20px", alignItems: 'center', marginBottom: "20px", backgroundColor: "#fff" }}>
                    <input type='search' value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder='Search your data...' style={{ padding: '5px 10px', borderRadius: '5px', border: '1px solid #ccc', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '250px', fontSize: '15px', outline: 'none', }} />
                </div>

                <MainDatatable columns={columns} data={filteredData} />
            </div>
        </>
    );
};

export default PlatformCharges;