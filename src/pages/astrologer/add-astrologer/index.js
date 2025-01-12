import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import { useLocation, useNavigate } from "react-router-dom";
import { Grid, TextField, Select, Avatar, InputLabel, MenuItem, FormControl, Checkbox, FormGroup, FormControlLabel, FormLabel, Modal, Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, IconButton, InputAdornment, } from "@mui/material";
import { Country, State, City } from 'country-state-city';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { get_date_value } from "../../../utils/common-function";
import { base_url } from "../../../utils/api-routes";
import { Color } from "../../../assets/colors/index.js";
import { Colors, useStyles } from "../../../assets/styles";
import * as ExpertiesActions from "../../../redux/actions/expertiseAction";
import * as SkillActions from "../../../redux/actions/skillAction";
import * as RemedyActions from "../../../redux/actions/remediesAction";
import * as LanguageActions from "../../../redux/actions/languageActions";
import * as AstrologerActions from "../../../redux/actions/astrologerAction";
import * as MasterActions from "../../../redux/actions/masterAction";
import 'react-image-crop/dist/ReactCrop.css'

const AddAstrologer = ({ mode }) => {
    let classes = useStyles();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    let stateData = location.state && location.state.stateData;

    const { skillData } = useSelector(state => state?.skillReducer);
    const { expertiesData, mainExpertiseData } = useSelector(state => state?.expertiseReducer);
    const { remediesData } = useSelector(state => state?.remediesReducer);
    const { languageData } = useSelector(state => state?.language);
    const { platformChargesData } = useSelector(state => state?.masterReducer);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [inputFieldDetail, setInputFieldDetail] = useState({
        name: stateData ? stateData?.astrologerName : "",
        email: stateData ? stateData?.email : "",
        mobile: stateData ? stateData?.phoneNumber : "",
        altMobile: stateData ? stateData?.alternateNumber : "",
        currency: stateData ? stateData?.currency : "",
        gender: stateData ? stateData?.gender : "",
        password: stateData ? stateData?.password : "",
        confirmPassword: stateData ? stateData?.password : "",
        dob: stateData ? moment(stateData?.dateOfBirth).format('YYYY-MM-DD') : "",
        experience: stateData ? stateData?.experience : "",
        countryPhoneCode: "91",
        // countryPhoneCode: stateData ? stateData?.country_phone_code : "91",
        pinCode: stateData ? stateData?.zipCode : "",
        startTime: stateData ? stateData?.startTime : "",
        endTime: stateData ? stateData?.endTime : "",
        rating: stateData ? stateData?.rating : 0,
        followers: stateData ? stateData?.follower_count : 0,
        language: stateData ? stateData?.language?.map(value => value) : [],
        address: stateData ? stateData?.address : "",
        country: stateData ? stateData?.country : "",
        state: stateData ? stateData?.state : "",
        city: stateData ? stateData?.city : "",
        youtubeLink: "https://www.youtube.com/",
        freeMinutes: "5",
        bankName: stateData ? stateData?.account_name : "",
        bankAccountNumber: stateData ? stateData?.account_number : "",
        accountType: stateData ? stateData?.account_type : "",
        ifscCode: stateData ? stateData?.IFSC_code : "",
        accountHolderName: stateData ? stateData?.account_holder_name : "",
        panNumber: stateData ? stateData?.panCard : "",
        aadharNumber: stateData ? stateData?.aadharNumber : "",
        consultationPrice: "4",
        call_price: stateData ? stateData?.call_price : "",
        commission_call_price: stateData ? stateData?.commission_call_price : "",
        chat_price: stateData ? stateData?.chat_price : "",
        commission_chat_price: stateData ? stateData?.commission_chat_price : "",
        commissionRemark: "Hii",
        video_call_price: stateData ? stateData?.video_call_price : 0,
        commission_video_call_price: stateData ? stateData?.commission_video_call_price : 0,
        normal_video_call_price: stateData ? stateData?.normal_video_call_price : 0,
        commission_normal_video_call_price: stateData ? stateData?.commission_normal_video_call_price : 0,
        longBio: stateData ? stateData?.long_bio : "",
        shortBio: stateData ? stateData?.short_bio : "",
        about: "Hii",
        working: "No",
    });
    const { name, email, mobile, altMobile, currency, gender, password, confirmPassword, dob, experience, countryPhoneCode, pinCode, startTime, endTime, rating, followers, video_call_price, commission_video_call_price, language, country, state, city, freeMinutes, bankName, bankAccountNumber, ifscCode, accountHolderName, accountType, aadharNumber, about, youtubeLink, address, working, panNumber, longBio, shortBio, call_price, chat_price, commission_call_price, commission_chat_price, commissionRemark, consultationPrice, normal_video_call_price, commission_normal_video_call_price } = inputFieldDetail;
    const [selectedCountryData, setSelectedCountryData] = useState({});
    const [selectedStateData, setSelectedStateData] = useState({});

    useEffect(() => {
        let data = Country.getAllCountries().find(value => value?.name === stateData?.country)
        // console.log("Data Country :: ", data)
        if (data == undefined) {
            console.log("Else Country")
            setSelectedCountryData({ currency: "INR", flag: "🇮🇳", isoCode: "IN", latitude: "20.00000000", longitude: "77.00000000", name: "India", phonecode: "91" })
            stateData = { ...stateData, country: "India" }
        }
        else {
            setSelectedCountryData(data)
        }
    }, []);

    useEffect(() => {
        if (Object.keys(selectedCountryData).length > 0) {
            let data = State.getStatesOfCountry(selectedCountryData?.isoCode).find(value => value?.name === stateData?.state)

            if (data) {
                setSelectedStateData(data)
            } else {
                setSelectedStateData({ name: 'Delhi', isoCode: 'DL', countryCode: 'IN', latitude: '28.70405920', longitude: '77.10249020' })
            }
        }
    }, [Object.keys(selectedCountryData).length]);
    console.log("StateData ::: ", stateData);

    const [image, setImage] = useState({ file: stateData ? base_url + stateData?.profileImage : '', bytes: '' });
    const [crop, setCrop] = useState({
        unit: '%', // Crop dimensions in percentage
        width: 50, // Starting width of the crop box
        aspect: 1 / 1 // Aspect ratio of 1:1 for square crop
    });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [imageRef, setImageRef] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // Toggle editor visibility

    const [bankProof, setBankProof] = useState({ file: stateData ? base_url + stateData?.bank_proof_image : "", bytes: "" });
    const [idProof, setIdProof] = useState({ file: stateData ? base_url + stateData?.id_proof_image : "", bytes: "" });
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png']; // Allowed image file types

    const [inputFieldError, setInputFieldError] = useState({ image: '' });

    //* Handle Input Field : Error
    const handleInputFieldError = (input, value) => {
        setInputFieldError((prev) => ({ ...prev, [input]: value }))
    };

    //* Handle Input Field : Data
    const handleInputField = (e) => {
        const { name, value } = e.target;
        setInputFieldDetail({ ...inputFieldDetail, [name]: value });
        if (name === 'commission_call_price') {
            handleInputFieldError("commission_call_price", null);
            handleInputFieldError("call_price", null);
        } else if (name === 'call_price') {
            handleInputFieldError("call_price", null);
            handleInputFieldError("commission_call_price", null);
        }
        if (name === 'commission_chat_price') {
            handleInputFieldError("commission_chat_price", null);
            handleInputFieldError("chat_price", null);
        } else if (name === 'chat_price') {
            handleInputFieldError("chat_price", null);
            handleInputFieldError("commission_chat_price", null);
        }
    };

    //! Snack Message 
    const [openSnack, setOpenSnack] = useState(false);
    const [messageSnack, setMessageSnack] = useState("");
    // const handleClickOpenSnack = (msg) => { setOpenSnack(true), setMessageSnack(msg) };
    const handleClickOpenSnack = (msg) => {
        setOpenSnack(true);
        setMessageSnack(msg)
    };

    //! Handle Bank Proof
    const handleBankProof = (e) => {
        const selectedFile = e.target.files[0];
        console.log(e.target.files)
        if (selectedFile) {
            // Check if the selected file type is allowed
            if (!allowedImageTypes.includes(selectedFile.type)) {
                setInputFieldError({ bankProof: "Only JPG, JPEG, and PNG files are allowed" });
                handleClickOpenSnack("Only JPG, JPEG, and PNG files are allowed");
                return;
            }

            // If allowed, set the bankProof state with the selected file
            setBankProof({
                file: URL.createObjectURL(selectedFile),
                bytes: selectedFile,
            });

            // Clear any previous error message
            setInputFieldError({ bankProof: null });
        }
    };

    //! Handle Id Proof
    const handleIdProof = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];

            // Check if the selected file type is allowed
            if (!allowedImageTypes.includes(selectedFile.type)) {
                handleInputFieldError("idProof", "Only JPG, JPEG, and PNG files are allowed");
                handleClickOpenSnack("Only JPG, JPEG, and PNG files are allowed");
                return;
            }

            // If allowed, set the idProof state with the selected file
            setIdProof({
                file: URL.createObjectURL(selectedFile),
                bytes: selectedFile,
            });

            // Clear any previous error message
            handleInputFieldError("idProof", null);
        }
    };

    //! Handle Image : Normally
    const handleImage = (e) => {
        console.log(e.target.files[0])
        console.log('sdfsdfsdf')
        // && e.target.files[0]?.size < 512000
        if (e.target.files && e.target.files.length > 0) {
            setImage({
                file: URL.createObjectURL(e.target.files[0]),
                bytes: e.target.files[0],
            });
            setIsEditing(true);
        } else {
            alert("Please upload image having size less than 500kb")
        }

        handleInputFieldError("image", null)
    };

    const onImageLoad = useCallback((e) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        const initialCrop = centerCrop(
            makeAspectCrop(
                { unit: '%', width: 50 },
                1 / 1,
                naturalWidth,
                naturalHeight
            ),
            naturalWidth,
            naturalHeight
        );
        setCrop(initialCrop);
        setImageRef(e.currentTarget);
    }, []);

    const onCropComplete = (crop) => setCompletedCrop(crop);

    const applyCrop = async () => {
        if (!completedCrop || !imageRef) return;

        const canvas = document.createElement('canvas');
        const scaleX = imageRef.naturalWidth / imageRef.width;
        const scaleY = imageRef.naturalHeight / imageRef.height;
        canvas.width = completedCrop.width;
        canvas.height = completedCrop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            imageRef,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            completedCrop.width,
            completedCrop.height
        );

        canvas.toBlob((blob) => {
            if (blob) {
                const croppedImageUrl = URL.createObjectURL(blob);
                setImage({ file: croppedImageUrl, bytes: blob });
                setIsEditing(false); // Hide editor after cropping
            }
        });
    };

    //! Handle Image : Drop Feature
    const handleDrop = (e) => {
        console.log(e.dataTransfer.files[0])
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && e.dataTransfer.files[0]?.size < 512000) {
            setImage({
                file: URL.createObjectURL(e.dataTransfer.files[0]),
                bytes: e.dataTransfer.files[0],
            });
        } else {
            alert("Please upload image having size less than 500kb")
        }

        handleInputFieldError("image", null)
    };

    //! Checkbox Logic Start 
    const [stateCheckbox, setStateCheckbox] = useState({
        preferredDays: stateData ? stateData?.preferredDays : [],
        skills: stateData ? stateData?.skill.map((item) => item?._id) : [],
        remedies: stateData ? stateData?.remedies.map((item) => item?._id) : [],
        expertise: stateData ? stateData?.expertise.map((item) => item?._id) : [],
        mainExpertise: stateData ? stateData?.mainExpertise.map((item) => item?._id) : [],
    });

    const { preferredDays, skills, mainExpertise, expertise, remedies } = stateCheckbox

    const updateStateCheckbox = (data) => {
        setStateCheckbox((prevState) => {
            const newData = { ...prevState, ...data };
            return newData;
        });
    };

    const handlePreferredDays = (item) => {
        if (preferredDays.some((selectedItem) => selectedItem === item)) {
            const preferdayData = preferredDays.filter(
                (selectedItem) => selectedItem !== item
            );
            updateStateCheckbox({ preferredDays: preferdayData });
        } else {
            updateStateCheckbox({ preferredDays: [...preferredDays, item] });
        }
        handleInputFieldError("preferredDays", null);
    };

    const handleSkills = (item) => {
        if (skills.some((selectedItem) => selectedItem === item._id)) {
            let skilData = skills.filter((skill) => skill !== item?._id);
            updateStateCheckbox({ skills: skilData });
        } else {
            updateStateCheckbox({ skills: [...skills, item?._id] });
        }
        handleInputFieldError("skills", null);
    };

    const handleRemedies = (item) => {
        if (remedies.some((selectedItem) => selectedItem === item._id)) {
            let remedyData = remedies.filter(
                (selectedItem) => selectedItem !== item._id
            );
            updateStateCheckbox({ remedies: remedyData });
        } else {
            updateStateCheckbox({ remedies: [...remedies, item?._id] });
        }

        handleInputFieldError("remedies", null);
    };

    const handleExpertise = (item) => {
        if (expertise.some((selectedItem) => selectedItem === item._id)) {
            const expertiesData = expertise.filter(
                (selectedItem) => selectedItem !== item._id
            );
            updateStateCheckbox({ expertise: expertiesData });
        } else {
            updateStateCheckbox({ expertise: [...expertise, item?._id] });
        }
        handleInputFieldError("expertise", null);
    };

    const handleMainExpertise = (item) => {
        if (mainExpertise.some((selectedItem) => selectedItem === item._id)) {
            const mainExpertiseData = mainExpertise.filter(
                (selectedItem) => selectedItem !== item._id
            );
            updateStateCheckbox({ mainExpertise: mainExpertiseData });
        } else {
            updateStateCheckbox({ mainExpertise: [...mainExpertise, item?._id] });
        }
        handleInputFieldError("mainExpertise", null);
    };
    //! Checkbox Logic End

    //  Get Age from dob
    function calculateAge(dob) {
        const dobDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        const dobMonth = dobDate.getMonth();
        const todayMonth = today.getMonth();

        if (todayMonth < dobMonth || (todayMonth === dobMonth && today.getDate() < dobDate.getDate())) {
            age--;
        }

        return age;
    }

    //* Validation Start for Adding Customer
    const handleValidation = () => {
        let isValid = true;
        const basicPattern = /^[a-zA-Z\s]{1,56}$/; // Accept Only Alphabet and Space
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const contactPattern = /^[0-9]{10}$/;
        const pinPattern = /^[0-9]{6}$/;
        const ifscPattern = /^[A-Za-z]{4}[0][A-Za-z0-9]{6}$/;
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];  // Check file type
        const disallowedTypes = ['application/pdf', 'application/msword'];  // Disallowed file types
        const regex = /^[a-zA-Z\s]+$/;

        if (image?.file.length == 0 || image?.file == 'https://api.astroremedy.com/') {
            handleInputFieldError("image", "Please Select a Profile Picture");
            isValid = false;
            handleClickOpenSnack("Please Select a Profile Picture");
        }

        if (disallowedTypes.includes(image?.file.type)) {  // Check for disallowed file types
            handleInputFieldError("image", "PDF and DOC files are not allowed");
            isValid = false;
            handleClickOpenSnack("PDF and DOC files are not allowed");
        }

        if (!name) {
            handleInputFieldError("name", "Name is required");
            isValid = false;
            handleClickOpenSnack("Name is required");
        }

        if (!basicPattern.test(name)) {
            handleInputFieldError("name", "Please enter a Valid Name");
            isValid = false;
            handleClickOpenSnack("Please enter a Valid Name");
        }

        if (!email) {
            handleInputFieldError("email", "Email is required");
            isValid = false;
            handleClickOpenSnack("Email is required");
        }

        if (!emailPattern.test(email.trim())) {
            handleInputFieldError("email", "Invalid Email address");
            isValid = false;
            handleClickOpenSnack("Invalid Email address");
        }

        if (!mobile) {
            handleInputFieldError("mobile", "Mobile Number is required");
            isValid = false;
            handleClickOpenSnack("Mobile Number is required");
        }

        if (!contactPattern.test(mobile)) {
            handleInputFieldError("mobile", "Mobile Number is required");
            isValid = false;
            handleClickOpenSnack("Mobile Number is required");
        }

        if (mobile === "0000000000") {
            handleInputFieldError("mobile", "Mobile Number cannot be all zeros");
            isValid = false;
            handleClickOpenSnack("Mobile Number cannot be all zeros");
        }

        if (!currency) {
            handleInputFieldError("currency", "Currency is required");
            isValid = false;
            handleClickOpenSnack("Currency is required");
        }

        if (!gender) {
            handleInputFieldError("gender", "Gender is required");
            isValid = false;
            handleClickOpenSnack("Gender is required");
        }

        if (!password) {
            handleInputFieldError("password", "Password is required");
            isValid = false;
            handleClickOpenSnack("Password is required");
        }

        if (password.length < 8 || password.length > 20) {
            handleInputFieldError("password", "Password must be between 8 and 20 characters");
            isValid = false;
            handleClickOpenSnack("Password must be between 8 and 20 characters");
        }

        if (!/[A-Z]/.test(password)) {
            handleInputFieldError("password", "Password must contain at least one uppercase letter");
            isValid = false;
            handleClickOpenSnack("Password must contain at least one uppercase letter");

        }

        if (!/[a-z]/.test(password)) {
            handleInputFieldError("password", "Password must contain at least one lowercase letter");
            isValid = false;
            handleClickOpenSnack("Password must contain at least one lowercase letter");
        }

        if (/\s/.test(password)) {
            handleInputFieldError("password", "Password must not contain spaces");
            isValid = false;
            handleClickOpenSnack("Password must not contain spaces");
        }

        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
            handleInputFieldError("password", "Password must contain at least one special character");
            isValid = false;
            handleClickOpenSnack("Password must contain at least one special character");
        }

        if (!confirmPassword) {
            handleInputFieldError("confirmPassword", "Confirm Password is required");
            isValid = false;
            handleClickOpenSnack("Confirm Password is required");
        }

        if (password !== confirmPassword) {
            handleInputFieldError("confirmPassword", "Passwords do not match");
            isValid = false;
            handleClickOpenSnack("Passwords do not match");
        }

        if (!dob) {
            handleInputFieldError("dob", "Date Of Birth is required");
            isValid = false;
            handleClickOpenSnack("Date Of Birth is required");
        }

        const age = calculateAge(dob);

        if (age < 18) {
            handleInputFieldError("dob", "Age must be 18 years or older");
            isValid = false;
            handleClickOpenSnack("Age must be 18 years or older");
        }

        if (!experience) {
            handleInputFieldError("experience", "Experience is required");
            isValid = false;
            handleClickOpenSnack("Experience is required");
        }

        if (!language) {
            handleInputFieldError("language", "Language is required");
            isValid = false;
            handleClickOpenSnack("Language is required");

        }
        if (!inputFieldDetail?.language || inputFieldDetail.language.length === 0) {
            handleInputFieldError("language", "Select at least one language");
            isValid = false;
            handleClickOpenSnack("Select at least one language");
        }

        if (!state) {
            handleInputFieldError("state", "State is required");
            isValid = false;
            handleClickOpenSnack("State is required");
        }

        if (!city) {
            handleInputFieldError("city", "City is required");
            isValid = false;
            handleClickOpenSnack("City is required");
        }

        if (pinCode && !pinPattern.test(pinCode)) {
            handleInputFieldError("pinCode", "Please enter a valid Pin Code; only numeric values are acceptable");
            isValid = false;
            handleClickOpenSnack("Please enter a valid Pin Code; only numeric values are acceptable");
        }

        // Check if the number of words is within the desired range
        if (bankName && bankName.length < 3 || bankName.length > 50) {
            handleInputFieldError("bankName", "Bank Name must be between 3 and 50 words");
            isValid = false;
            handleClickOpenSnack("Bank Name must be between 3 and 50 words");
        }

        if (!bankAccountNumber) {
            handleInputFieldError("bankAccountNumber", "Bank Account Number is required");
            isValid = false;
            handleClickOpenSnack("Bank Account Number is required");
        }

        if (!/^\d+$/.test(bankAccountNumber) || parseInt(bankAccountNumber) <= 0) {
            handleInputFieldError(
                "bankAccountNumber",
                "Invalid Bank Account Number. Only digits are allowed."
            );
            isValid = false;
            handleClickOpenSnack(
                "Invalid Bank Account Number. Only digits are allowed."
            );
        }

        if (accountHolderName) {
            if (accountHolderName.length < 3 || accountHolderName.length > 50) {
                handleInputFieldError("accountHolderName", "Account Holder Name must be between 3 and 50 characters.");
                isValid = false;
                handleClickOpenSnack("Account Holder Name must be between 3 and 50 characters.");
            } else if (!regex.test(accountHolderName)) {
                handleInputFieldError("accountHolderName", "Account Holder Name, only letters are allowed.");
                isValid = false;
                handleClickOpenSnack("Account Holder Name, only letters are allowed.");
            }
        }

        if (bankProof && disallowedTypes.includes(bankProof?.file.type)) {  // Check for disallowed file types
            handleInputFieldError("bankProof", "PDF and DOC files are not allowed");
            isValid = false;
            handleClickOpenSnack("PDF and DOC files are not allowed");
        }

        if (!aadharNumber) {
            handleInputFieldError("aadharNumber", "Aadhar Number is required");
            isValid = false;
            handleClickOpenSnack("Aadhar Number is required");
        }

        if (!/^\d{12}$/.test(aadharNumber)) {
            handleInputFieldError("aadharNumber", "Aadhar Number must be a 12-digit number");
            isValid = false;
            handleClickOpenSnack("Aadhar Number must be a 12-digit number");
        }

        if (!panNumber) {
            handleInputFieldError("panNumber", "PAN Number is required");
            isValid = false;
            handleClickOpenSnack("PAN Number is required");

        }

        // if (!/[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(panNumber)) {
        //     handleInputFieldError("panNumber", "Invalid PAN Number format");
        //     isValid = false;
        //     handleClickOpenSnack("Invalid PAN Number format");
        // }

        if (disallowedTypes.includes(idProof?.file.type)) {  // Check for disallowed file types
            handleInputFieldError("idProof", "PDF and DOC files are not allowed");
            isValid = false;
            handleClickOpenSnack("PDF and DOC files are not allowed");
        }

        if (!call_price) {
            handleInputFieldError("call_price", "Call Price is required");
            isValid = false;
            handleClickOpenSnack("Call Price is required");
        }

        if (!commission_call_price) {
            handleInputFieldError("commission_call_price", "Call Plaform Charges is required");
            isValid = false;
            handleClickOpenSnack("Call Plaform Charges is required");
        }

        if (!chat_price) {
            handleInputFieldError("chat_price", "Chat Price is required");
            isValid = false;
            handleClickOpenSnack("Chat Price is required");
        }

        if (!commission_chat_price) {
            handleInputFieldError("commission_chat_price", "Chat Plaform Charges is required");
            isValid = false;
            handleClickOpenSnack("Chat Plaform Charges is required");
        }

        if (!normal_video_call_price) {
            handleInputFieldError("normal_video_call_price", "Video Call Price is required");
            isValid = false;
            handleClickOpenSnack("Video Call Price is required");
        }

        if (!commission_normal_video_call_price) {
            handleInputFieldError("commission_normal_video_call_price", "Video Call Plaform Charges is required");
            isValid = false;
            handleClickOpenSnack("Video Call Plaform Charges is required");
        }

        if (!video_call_price) {
            handleInputFieldError("video_call_price", "Live Price is required");
            isValid = false;
            handleClickOpenSnack("Live Price is required");
        }

        if (!commission_video_call_price) {
            handleInputFieldError("commission_video_call_price", "Live Plaform Charges is required");
            isValid = false;
            handleClickOpenSnack("Live Plaform Charges is required");
        }

        if (!skills || skills.length === 0) {
            handleInputFieldError("skills", "Skills is required");
            isValid = false;
            handleClickOpenSnack("Skills is required");
        }

        if (!remedies || remedies.length === 0) {
            handleInputFieldError("remedies", "Please Select Remedies");
            isValid = false;
            handleClickOpenSnack("Please Select Remedies");
        }

        if (!mainExpertise || mainExpertise.length === 0) {
            handleInputFieldError("mainExpertise", "Please Select Main Expertise");
            isValid = false;
            handleClickOpenSnack("Please Select Main Expertise");
        }

        return isValid;
    };

    //! Handle Submitting for Adding Customer
    const handleSubmit = async () => {
        if (handleValidation()) {
            console.log({ ...inputFieldDetail, ...stateCheckbox });
            console.log({ ...stateCheckbox })

            if (stateData) {
                let formData = new FormData();
                formData.append("astrologerId", stateData?._id);
                formData.append("astrologerName", name);
                formData.append("email", email);
                formData.append("phoneNumber", mobile);
                formData.append("alternateNumber", altMobile);
                formData.append("currency", currency);
                formData.append("gender", gender);
                formData.append("password", password);
                formData.append("confirm_password", confirmPassword);
                formData.append("dateOfBirth", dob);
                formData.append("experience", experience);
                formData.append("address", address);
                formData.append("country", country);
                formData.append("state", state);
                formData.append("city", city);
                formData.append("youtubeLink", youtubeLink);
                formData.append("free_min", freeMinutes);
                formData.append("workingOnOtherApps", working);
                formData.append("profileImage", image.bytes);
                formData.append("bank_proof_image", bankProof.bytes);
                formData.append("id_proof_image", idProof.bytes);
                formData.append("account_name", bankName);
                formData.append("account_number", bankAccountNumber);
                formData.append("account_type", accountType);
                formData.append("IFSC_code", ifscCode);
                formData.append("account_holder_name", accountHolderName);
                formData.append("panCard", panNumber);
                formData.append("aadharNumber", aadharNumber);
                formData.append("consultation_price", consultationPrice);
                formData.append("commission_remark", commissionRemark);
                formData.append("long_bio", longBio);
                formData.append("short_bio", "Astrologer");
                formData.append("startTime", startTime);
                formData.append("endTime", endTime);
                formData.append("zipCode", pinCode);
                formData.append("about", about);
                formData.append("country_phone_code", countryPhoneCode);
                formData.append("rating", rating);
                formData.append("follower_count", followers);
                formData.append("call_price", call_price);
                formData.append("commission_call_price", commission_call_price);
                formData.append("chat_price", chat_price);
                formData.append("commission_chat_price", commission_chat_price);
                formData.append("video_call_price", video_call_price);
                formData.append("commission_video_call_price", commission_video_call_price);
                formData.append("normal_video_call_price", normal_video_call_price);
                formData.append("commission_normal_video_call_price", commission_normal_video_call_price);

                for (let i = 0; i < preferredDays.length; i++) {
                    formData.append(`preferredDays[${i}]`, preferredDays[i]);
                }
                for (let i = 0; i < language.length; i++) {
                    formData.append(`language[${i}]`, language[i]);
                }
                for (let i = 0; i < skills.length; i++) {
                    formData.append(`skill[${i}]`, skills[i]);
                }
                for (let i = 0; i < remedies.length; i++) {
                    formData.append(`remedies[${i}]`, remedies[i]);
                }
                // for (let i = 0; i < expertise.length; i++) {
                //     formData.append(`expertise[${i}]`, expertise[i]);
                // }
                for (let i = 0; i < mainExpertise.length; i++) {
                    formData.append(`mainExpertise[${i}]`, mainExpertise[i]);
                }

                //! Dispatching API for Updating Astrologer
                dispatch(AstrologerActions.updateAstrologerById({ data: formData, onComplete: () => navigate('/astrologer') }));
            } else {
                let formData = new FormData();
                formData.append("astrologerName", name);
                formData.append("email", email);
                formData.append("phoneNumber", mobile);
                formData.append("alternateNumber", altMobile);
                formData.append("currency", currency);
                formData.append("gender", gender);
                formData.append("password", password);
                formData.append("confirm_password", confirmPassword);
                formData.append("dateOfBirth", dob);
                formData.append("experience", experience);
                formData.append("address", address);
                formData.append("country", country);
                formData.append("state", state);
                formData.append("city", city);
                formData.append("youtubeLink", youtubeLink);
                formData.append("free_min", freeMinutes);
                formData.append("workingOnOtherApps", working);
                formData.append("profileImage", image.bytes);
                formData.append("bank_proof_image", bankProof.bytes);
                formData.append("id_proof_image", idProof.bytes);
                formData.append("account_name", bankName);
                formData.append("account_number", bankAccountNumber);
                formData.append("account_type", accountType);
                formData.append("IFSC_code", ifscCode);
                formData.append("account_holder_name", accountHolderName);
                formData.append("panCard", panNumber);
                formData.append("aadharNumber", aadharNumber);
                formData.append("consultation_price", consultationPrice);
                formData.append("call_price", call_price);
                formData.append("commission_call_price", commission_call_price);
                formData.append("chat_price", chat_price);
                formData.append("commission_chat_price", commission_chat_price);
                formData.append("commission_remark", commissionRemark);
                formData.append("long_bio", longBio);
                formData.append("short_bio", "Astrologer");
                formData.append("startTime", startTime);
                formData.append("endTime", endTime);
                formData.append("zipCode", pinCode);
                formData.append("about", about);
                formData.append("country_phone_code", countryPhoneCode);
                formData.append("rating", rating);
                formData.append("follower_count", followers);
                formData.append("video_call_price", video_call_price);
                formData.append("commission_video_call_price", commission_video_call_price);
                formData.append("normal_video_call_price", normal_video_call_price);
                formData.append("commission_normal_video_call_price", commission_normal_video_call_price);

                for (let i = 0; i < preferredDays.length; i++) {
                    formData.append(`preferredDays[${i}]`, preferredDays[i]);
                }
                for (let i = 0; i < language.length; i++) {
                    formData.append(`language[${i}]`, language[i]);
                }
                for (let i = 0; i < skills.length; i++) {
                    formData.append(`skill[${i}]`, skills[i]);
                }
                for (let i = 0; i < remedies.length; i++) {
                    formData.append(`remedies[${i}]`, remedies[i]);
                }
                // for (let i = 0; i < expertise.length; i++) {
                //     formData.append(`expertise[${i}]`, expertise[i]);
                // }
                for (let i = 0; i < mainExpertise.length; i++) {
                    formData.append(`mainExpertise[${i}]`, mainExpertise[i]);
                }

                //! Dispatching API for Creating Astrologer
                dispatch(AstrologerActions.createAstrologer({ data: formData, onComplete: () => navigate('/astrologer') }));
            }
        } else {
            console.log("Validation Error")
        }
    };

    //! Dispatching all Necceassry API on Page Load 
    useEffect(() => {
        dispatch(SkillActions.getSkill());
        dispatch(SkillActions.getSkill());
        dispatch(ExpertiesActions.getExpertise());
        dispatch(ExpertiesActions.getMainExpertise());
        dispatch(RemedyActions.getRemedies());
        dispatch(LanguageActions.getAllLanguage());
        dispatch(MasterActions.getPlatformCharges());
    }, []);

    return (
        <>
            <Snackbar open={openSnack} autoHideDuration={2000} onClose={() => setOpenSnack(false)} message={messageSnack} anchorOrigin={{ vertical: "top", horizontal: "right" }} />

            <div style={{ padding: "20px", backgroundColor: "#fff", marginBottom: "20px", boxShadow: '0px 0px 5px lightgrey', borderRadius: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px", fontFamily: 'Philosopher', backgroundColor: "#fff" }}>
                    <div style={{ fontSize: "22px", fontWeight: "500", color: "#000" }}>{mode === 'Edit' ? 'Edit Astrologer' : 'Add Astrologer'}</div>
                    {/* <div onClick={() => navigate("/astrologer")} style={{ fontWeight: "500", backgroundColor: Color.primary, color: Color.white, padding: "5px 10px", borderRadius: "5px", cursor: "pointer", fontSize: "14px" }}>Display</div> */}
                </div>

                <Grid container spacing={3}>
                    <Grid item lg={4} sm={12} md={12} xs={12}>
                        <div style={{ color: "#000", border: "1px solid #C4C4C4", borderRadius: "3px" }}>
                            <Grid container spacing={2} sx={{ alignItems: "center" }}>
                                <Grid item xs={3}>
                                    <Avatar src={image.file} style={{ width: 54, height: 54, borderRadius: "initial", objectFit: 'contain' }} />
                                </Grid>
                                <Grid item xs={9}>
                                    <label htmlFor="upload-image" style={{ display: "flex", flexDirection: "row", gap: "3px", alignItems: "center", padding: "12px 0", cursor: "pointer", justifyContent: 'space-between' }}>
                                        <div style={{ fontWeight: "600", fontSize: "12px" }}>Choose Astrologer Image to Upload<span style={{ color: "red" }}>*</span>
                                            <div style={{ fontWeight: "400", fontSize: "10px", color: 'green', }}>only png, jpg or jpeg files are allowed</div>
                                        </div>
                                        <input id="upload-image" onChange={handleImage} hidden accept="image/*" type="file" />
                                    </label>
                                </Grid>
                            </Grid>
                        </div>
                        {inputFieldError?.image && <div style={{ color: "#D32F2F", fontSize: "12.5px", padding: "10px 0 0 12px", }}>{inputFieldError?.image}</div>}

                        {/* Image Editor with Toolbar at the Top */}
                        {isEditing && (
                            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: '1000', backgroundColor: Color.white, border: '1px solid #ccc', padding: '10px', display: 'flex', flexDirection: 'column', gap: '50px', justifyContent: 'center', alignItems: 'center' }}>
                                <ReactCrop crop={crop} onChange={(newCrop) => setCrop(newCrop)} onComplete={onCropComplete}>
                                    <img src={image.file} onLoad={onImageLoad} alt="Source" style={{ maxWidth: '300px', borderRadius: '8px' }} />
                                </ReactCrop>

                                <div style={{ display: 'flex', gap: "20px", justifyContent: 'space-around' }}>
                                    <Button onClick={applyCrop} variant="contained" color="primary">Done</Button>
                                    <Button onClick={() => setIsEditing(false)} variant="outlined" color="error">Cancel</Button>
                                </div>
                            </div>
                        )}
                    </Grid>

                    <Grid item lg={4} sm={12} md={12} xs={12}>
                        <TextField
                            label={<>Enter Full Name <span style={{ color: "red" }}>*</span></>} variant="outlined" fullWidth
                            name='name'
                            value={inputFieldDetail?.name}
                            onChange={handleInputField}
                            error={inputFieldError.name ? true : false}
                            helperText={inputFieldError.name}
                            onFocus={() => handleInputFieldError("name", null)}
                        />
                    </Grid>

                    <Grid item lg={4} sm={12} md={12} xs={12}>
                        <TextField
                            label={<>Enter Email <span style={{ color: "red" }}>*</span></>} variant="outlined" fullWidth
                            name='email'
                            value={inputFieldDetail?.email}
                            onChange={handleInputField}
                            error={inputFieldError.email ? true : false}
                            helperText={inputFieldError.email}
                            onFocus={() => handleInputFieldError("email", null)}
                        />
                    </Grid>

                    <Grid item lg={4} sm={12} md={12} xs={12}>
                        <TextField
                            label={<>Enter Mobile Number <span style={{ color: "red" }}>*</span></>} variant="outlined" fullWidth
                            name='mobile'
                            value={inputFieldDetail?.mobile}
                            onChange={handleInputField}
                            error={inputFieldError.mobile ? true : false}
                            helperText={inputFieldError.mobile}
                            onFocus={() => handleInputFieldError("mobile", null)}
                        />
                    </Grid>

                    <Grid item lg={4} sm={12} md={12} xs={12}>
                        <TextField
                            label="Alternate Mobile Number" variant="outlined" fullWidth
                            name='altMobile'
                            value={inputFieldDetail?.altMobile}
                            onChange={handleInputField}
                            error={inputFieldError.altMobile ? true : false}
                            helperText={inputFieldError.altMobile}
                            onFocus={() => handleInputFieldError("altMobile", null)}
                        />
                    </Grid>

                    {/* Currency Dropdown */}
                    <Grid item lg={4} md={12} sm={12} xs={12} >
                        <FormControl fullWidth>
                            <InputLabel id="select-label">Select Currency <span style={{ color: "red" }}>*</span></InputLabel>
                            <Select
                                label="Select Currency *" variant="outlined" fullWidth
                                name='currency'
                                value={inputFieldDetail?.currency}
                                onChange={handleInputField}
                                error={inputFieldError?.currency ? true : false}
                                onFocus={() => handleInputFieldError("currency", null)}
                            >
                                <MenuItem disabled>---Select currency---</MenuItem>
                                <MenuItem value="INR">INR</MenuItem>
                                {/* <MenuItem value="USD">USD</MenuItem>  */}
                            </Select>
                        </FormControl>
                        {inputFieldError?.currency && <div style={{ color: "#D32F2F", fontSize: "13px", padding: "5px 15px 0 12px", fontWeight: "500" }}>{inputFieldError?.currency}</div>}
                    </Grid>

                    {/* Gender Dropdown */}
                    <Grid item lg={4} md={12} sm={12} xs={12} >
                        <FormControl fullWidth>
                            <InputLabel id="select-label">Select Gender <span style={{ color: "red" }}>*</span></InputLabel>
                            <Select
                                label="Select Gender *" variant="outlined" fullWidth
                                name='gender'
                                value={inputFieldDetail?.gender}
                                onChange={handleInputField}
                                error={inputFieldError?.gender ? true : false}
                                onFocus={() => handleInputFieldError("gender", null)}
                            >
                                <MenuItem disabled>---Select Gender---</MenuItem>
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </FormControl>
                        {inputFieldError?.gender && <div style={{ color: "#D32F2F", fontSize: "13px", padding: "5px 15px 0 12px", fontWeight: "500" }}>{inputFieldError?.gender}</div>}
                    </Grid>

                    {/* Password */}
                    <Grid item lg={4} sm={12} md={12} xs={12} style={{ position: "relative" }}>
                        <TextField
                            label={<>Password <span style={{ color: "red" }}>*</span></>} variant="outlined" fullWidth
                            type={showPassword ? 'text' : 'password'}
                            name='password'
                            value={inputFieldDetail?.password}
                            onChange={handleInputField}
                            error={inputFieldError.password ? true : false}
                            helperText={inputFieldError.password}
                            onFocus={() => handleInputFieldError("password", null)}
                        />
                        <InputAdornment position='end' style={{ position: "absolute", right: "20px", top: "52px" }}>
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    </Grid>

                    {/* Confirm Password */}

                    <Grid item lg={4} sm={12} md={12} xs={12} style={{ position: "relative" }}>
                        <TextField
                            label={<> Confirm Password <span style={{ color: "red" }}>*</span></>} variant="outlined" fullWidth
                            type={showConfirmPassword ? 'text' : 'password'}
                            name='confirmPassword'
                            value={inputFieldDetail?.confirmPassword}
                            onChange={handleInputField}
                            error={inputFieldError.confirmPassword ? true : false}
                            helperText={inputFieldError.confirmPassword}
                            onFocus={() => handleInputFieldError("confirmPassword", null)}
                        />
                        <InputAdornment position='end' style={{ position: "absolute", right: "20px", top: "52px" }}>
                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    </Grid>


                    {/* DOB */}
                    <Grid item lg={4} sm={12} md={12} xs={12}>
                        <TextField
                            label={<>Date of Birth <span style={{ color: "red" }}>*</span></>} variant="outlined" fullWidth
                            type="date"
                            name='dob'
                            value={inputFieldDetail?.dob}
                            onChange={handleInputField}
                            error={inputFieldError.dob ? true : false}
                            helperText={inputFieldError.dob}
                            onFocus={() => handleInputFieldError("dob", null)}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ max: get_date_value(18) }}
                        />
                    </Grid>

                    <Grid item lg={4} sm={12} md={12} xs={12}>
                        <TextField
                            label={<>Experience in Years <span style={{ color: "red" }}>*</span></>} variant="outlined" fullWidth
                            type="number"
                            name='experience'
                            value={inputFieldDetail?.experience}
                            onChange={handleInputField}
                            error={inputFieldError.experience ? true : false}
                            helperText={inputFieldError.experience}
                            onFocus={() => handleInputFieldError("experience", null)}
                            inputProps={{ min: 0 }}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12} xs={12} >
                        <FormControl fullWidth>
                            <InputLabel id="select-label">Select Language <span style={{ color: "red" }}>*</span></InputLabel>
                            <Select
                                label="Select Language *" variant="outlined" fullWidth
                                name='language'
                                value={inputFieldDetail?.language}
                                multiple
                                onChange={handleInputField}
                                error={inputFieldError?.language ? true : false}
                                onFocus={() => handleInputFieldError("language", null)}
                            >
                                <MenuItem disabled>---Select Language---</MenuItem>
                                {languageData && languageData.map((item) =>
                                    <MenuItem key={item?._id} value={item?.languageName}>{item?.languageName}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        {inputFieldError?.language && <div style={{ color: "#D32F2F", fontSize: "13px", padding: "5px 15px 0 12px", fontWeight: "500" }}>{inputFieldError?.language}</div>}
                    </Grid>

                    {/* Address Start */}
                    <Grid item lg={12} sm={12} md={12} xs={12}>
                        <TextField
                            label="Address" variant="outlined" fullWidth
                            name='address'
                            value={inputFieldDetail?.address}
                            onChange={handleInputField}
                            error={inputFieldError.address ? true : false}
                            helperText={inputFieldError.address}
                            onFocus={() => handleInputFieldError("address", null)}
                        />
                    </Grid>


                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="select-label">Country <span style={{ color: "red" }}>*</span></InputLabel>
                            <Select
                                label="Country *"
                                variant="outlined"
                                fullWidth
                                name='country'
                                value={inputFieldDetail?.country || 'India'} // Set default value to 'India'
                                onChange={handleInputField}
                                error={inputFieldError?.country ? true : false}
                                onFocus={() => handleInputFieldError("country", null)}
                            // disabled // Disable the select to prevent changing the country
                            >
                                {/* Display only India */}
                                {/* <MenuItem value='India'>{selectedCountryData?.name}</MenuItem> */}
                                {Country.getAllCountries().map((value, index) => <MenuItem key={index} onClick={() => setSelectedCountryData(value)} value={value?.name}>{value?.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                        {inputFieldError?.country && (
                            <div style={{ color: "#D32F2F", fontSize: "13px", padding: "5px 15px 0 12px", fontWeight: "500" }}>
                                {inputFieldError?.country}
                            </div>
                        )}
                    </Grid>



                    <Grid item lg={4} md={12} sm={12} xs={12} >
                        <FormControl fullWidth>
                            <InputLabel id="select-label">State <span style={{ color: "red" }}>*</span></InputLabel>
                            <Select
                                label="State *" variant="outlined" fullWidth
                                name='state'
                                value={inputFieldDetail?.state}
                                onChange={handleInputField}
                                error={inputFieldError?.state ? true : false}
                                onFocus={() => handleInputFieldError("state", null)}
                            >
                                <MenuItem disabled value={null}>
                                    {Object.keys(selectedStateData).length > 0 ? '-Select your State-' : 'Please First Select Country'}
                                </MenuItem>
                                {State.getStatesOfCountry(selectedCountryData?.isoCode).map((value, index) => <MenuItem key={index} onClick={() => setSelectedStateData(value)} value={value?.name}>{value?.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                        {inputFieldError?.state && <div style={{ color: "#D32F2F", fontSize: "13px", padding: "5px 15px 0 12px", fontWeight: "500" }}>{inputFieldError?.state}</div>}
                    </Grid>

                    <Grid item lg={4} md={12} sm={12} xs={12} >
                        <FormControl fullWidth>
                            <InputLabel id="select-label">City <span style={{ color: "red" }}>*</span></InputLabel>
                            <Select
                                label="City *" variant="outlined" fullWidth
                                name='city'
                                value={inputFieldDetail?.city}
                                onChange={handleInputField}
                                error={inputFieldError?.city ? true : false}
                                onFocus={() => handleInputFieldError("city", null)}
                            >
                                <MenuItem disabled value={null}>
                                    {Object.keys(selectedStateData).length > 0 ? '-Select your City-' : 'Please First Select State'}
                                </MenuItem>
                                {City.getCitiesOfState(selectedStateData?.countryCode, selectedStateData?.isoCode).map((value, index) => <MenuItem key={index} value={value?.name}>{value?.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                        {inputFieldError?.city && <div style={{ color: "#D32F2F", fontSize: "13px", padding: "5px 15px 0 12px", fontWeight: "500" }}>{inputFieldError?.city}</div>}
                    </Grid>

                    <Grid item lg={4} sm={12} md={12} xs={12}>
                        <TextField
                            // label={<>Pin Code <span style={{ color: "red" }}>*</span></>} variant="outlined" fullWidth
                            label={<>Pin Code</>} variant="outlined" fullWidth
                            name='pinCode'
                            value={inputFieldDetail?.pinCode}
                            onChange={handleInputField}
                            error={inputFieldError.pinCode ? true : false}
                            helperText={inputFieldError.pinCode}
                            onFocus={() => handleInputFieldError("pinCode", null)}
                        />
                    </Grid>
                    {/* Address End */}

                    <Grid item lg={4} sm={12} md={12} xs={12}>
                        <TextField
                            label="Number Of Followers" variant="outlined" fullWidth
                            name='followers'
                            value={inputFieldDetail?.followers}
                            onChange={handleInputField}
                            error={inputFieldError.followers ? true : false}
                            helperText={inputFieldError.followers}
                            onFocus={() => handleInputFieldError("followers", null)}
                            inputProps={{ min: 0 }}
                        />
                    </Grid>

                    {/* Bank Detail Start */}
                    <Grid item lg={4} sm={12} md={12} xs={12}>
                        <TextField
                            label={<>Bank Name </>} variant="outlined" fullWidth
                            name='bankName'
                            value={inputFieldDetail?.bankName}
                            onChange={handleInputField}
                            error={inputFieldError.bankName ? true : false}
                            helperText={inputFieldError.bankName}
                            onFocus={() => handleInputFieldError("bankName", null)}
                        />
                    </Grid>

                    <Grid item lg={4} sm={12} md={12} xs={12}>
                        <TextField
                            label={<>Bank Account Number <span style={{ color: "red" }}>*</span></>} variant="outlined" fullWidth
                            name='bankAccountNumber'
                            value={inputFieldDetail?.bankAccountNumber}
                            onChange={handleInputField}
                            error={inputFieldError.bankAccountNumber ? true : false}
                            helperText={inputFieldError.bankAccountNumber}
                            onFocus={() => handleInputFieldError("bankAccountNumber", null)}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12} xs={12} >
                        <FormControl fullWidth>
                            <InputLabel id="select-label">Select Account Type</InputLabel>
                            <Select
                                label="Select Account Type" variant="outlined" fullWidth
                                name='accountType'
                                value={inputFieldDetail?.accountType}
                                onChange={handleInputField}
                                error={inputFieldError?.accountType ? true : false}
                                onFocus={() => handleInputFieldError("accountType", null)}
                            >
                                <MenuItem disabled>---Select Account Type---</MenuItem>
                                <MenuItem value="saving">Saving</MenuItem>
                                <MenuItem value="current">Current</MenuItem>
                            </Select>
                        </FormControl>
                        {inputFieldError?.accountType && <div style={{ color: "#D32F2F", fontSize: "13px", padding: "5px 15px 0 12px", fontWeight: "500" }}>{inputFieldError?.accountType}</div>}
                    </Grid>

                    <Grid item lg={4} sm={12} md={12} xs={12}>
                        <TextField
                            label="Account Holder Name" variant="outlined" fullWidth
                            name='accountHolderName'
                            value={inputFieldDetail?.accountHolderName}
                            onChange={handleInputField}
                            error={inputFieldError.accountHolderName ? true : false}
                            helperText={inputFieldError.accountHolderName}
                            onFocus={() => handleInputFieldError("accountHolderName", null)}
                        />
                    </Grid>

                    <Grid item lg={4} sm={12} md={12} xs={12}>
                        <TextField
                            // label={<>IFSC Code <span style={{ color: "red" }}>*</span></>} variant="outlined" fullWidth
                            label={<>IFSC Code</>} variant="outlined" fullWidth
                            name='ifscCode'
                            value={inputFieldDetail?.ifscCode}
                            onChange={handleInputField}
                            error={inputFieldError.ifscCode ? true : false}
                            helperText={inputFieldError.ifscCode}
                            onFocus={() => handleInputFieldError("ifscCode", null)}
                        />
                    </Grid>

                    {/* Bank Detail End */}

                    {/* Aadhar */}
                    <Grid item lg={4} sm={12} md={12} xs={12}>
                        <TextField
                            label={<>Aadhar Card Number<span style={{ color: "red" }}>*</span></>} variant="outlined" fullWidth
                            name='aadharNumber'
                            value={inputFieldDetail?.aadharNumber}
                            onChange={handleInputField}
                            error={inputFieldError.aadharNumber ? true : false}
                            helperText={inputFieldError.aadharNumber}
                            onFocus={() => handleInputFieldError("aadharNumber", null)}
                        />
                    </Grid>

                    {/* Pan */}
                    <Grid item lg={4} sm={12} md={12} xs={12}>
                        <TextField
                            label={<>PAN Card Number<span style={{ color: "red" }}>*</span></>} variant="outlined" fullWidth
                            name='panNumber'
                            value={inputFieldDetail?.panNumber}
                            onChange={handleInputField}
                            error={inputFieldError.panNumber ? true : false}
                            helperText={inputFieldError.panNumber}
                            onFocus={() => handleInputFieldError("panNumber", null)}
                        />
                    </Grid>

                    {/* Id Proof */}
                    <Grid item lg={6} sm={12} md={12} xs={12}>
                        <div style={{ color: "#000", border: "1px solid #C4C4C4", borderRadius: "3px", padding: '5px 20px' }}>
                            <Grid container spacing={2} sx={{ alignItems: "center" }}>
                                <Grid item xs={3}>
                                    <Avatar color={Colors.primaryDark} src={bankProof.file} style={{ width: 56, height: 56 }} />
                                </Grid>
                                <Grid item xs={9}>
                                    <label htmlFor="upload-bank-proof" style={{ display: "flex", flexDirection: "column", gap: "3px", padding: "12px 0", cursor: "pointer", justifyContent: 'space-between' }}>Upload Bank Proof
                                        <div style={{ fontWeight: "400", fontSize: "10px", color: 'green' }}>only png, jpg or jpeg files are allowed</div>
                                        <input id="upload-bank-proof" onChange={handleBankProof} type="file" accept=".jpg,.jpeg,.png" hidden />
                                    </label>
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>

                    <Grid item lg={6} sm={12} md={12} xs={12}>
                        <div style={{ color: "#000", border: "1px solid #C4C4C4", borderRadius: "3px", padding: '5px 20px' }}>
                            <Grid container spacing={2} sx={{ alignItems: "center" }}>
                                <Grid item xs={3}>
                                    <Avatar color={Colors.primaryDark} src={idProof.file} style={{ width: 56, height: 56 }} />
                                </Grid>
                                <Grid item xs={9}>
                                    <label htmlFor="upload-id-proof" style={{ display: "flex", flexDirection: "column", gap: "3px", padding: "12px 0", cursor: "pointer", justifyContent: 'space-between' }}>Upload Id Proof
                                        <div style={{ fontWeight: "400", fontSize: "10px", color: 'green' }}>only png, jpg or jpeg files are allowed</div>
                                        <input id="upload-id-proof" onChange={handleIdProof} accept=".jpg,.jpeg,.png" type="file" hidden />
                                    </label>
                                </Grid>
                            </Grid>
                            {/* {inputFieldError?.idProof && <div style={{ color: "#D32F2F", fontSize: "13px", padding: "5px 15px 0 12px", fontWeight: "500" }}>{inputFieldError?.idProof}</div>} */}
                        </div>
                    </Grid>

                    {/* Price Start */}
                    <Grid item lg={4} sm={12} md={12} xs={12}>
                        <TextField
                            label={<>Call Price (Per/Min) <span style={{ color: "red" }}>*</span></>} variant="outlined" fullWidth
                            type="number"
                            name='call_price'
                            value={inputFieldDetail?.call_price}
                            onChange={handleInputField}
                            error={inputFieldError.call_price ? true : false}
                            helperText={inputFieldError.call_price}
                            onFocus={() => handleInputFieldError("call_price", null)}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12} xs={12} >
                        <FormControl fullWidth>
                            <InputLabel id="select-label">Select Call Plaform Charges <span style={{ color: "red" }}>* </span></InputLabel>
                            <Select
                                label="Select Call Plaform Charges * " variant="outlined" fullWidth
                                name='commission_call_price'
                                value={inputFieldDetail?.commission_call_price}
                                onChange={handleInputField}
                                error={inputFieldError?.commission_call_price ? true : false}
                                onFocus={() => handleInputFieldError("commission_call_price", null)}
                            >
                                <MenuItem disabled>---Select Call Plaform Charges---</MenuItem>
                                {platformChargesData && platformChargesData?.map((item) =>
                                    <MenuItem key={item?._id} value={item?.platformChargeAmount}>{item?.platformChargeAmount}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        {inputFieldError?.language && <div style={{ color: "#D32F2F", fontSize: "13px", padding: "5px 15px 0 12px", fontWeight: "500" }}>{inputFieldError?.language}</div>}
                    </Grid>

                    <Grid item lg={4} sm={12} md={12} xs={12}>
                        <TextField
                            label={<>Chat Price (Per/Min) <span style={{ color: "red" }}>*</span></>} variant="outlined" fullWidth
                            type="number"
                            name='chat_price'
                            value={inputFieldDetail?.chat_price}
                            onChange={handleInputField}
                            error={inputFieldError.chat_price ? true : false}
                            helperText={inputFieldError.chat_price}
                            onFocus={() => handleInputFieldError("chat_price", null)}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12} xs={12} >
                        <FormControl fullWidth>
                            <InputLabel id="select-label">Select Chat Plaform Charges <span style={{ color: "red" }}>* </span></InputLabel>
                            <Select
                                label="Select Chat Plaform Charges * " variant="outlined" fullWidth
                                name='commission_chat_price'
                                value={inputFieldDetail?.commission_chat_price}
                                onChange={handleInputField}
                                error={inputFieldError?.commission_chat_price ? true : false}
                                onFocus={() => handleInputFieldError("commission_chat_price", null)}
                            >
                                <MenuItem disabled>---Select Chat Plaform Charges---</MenuItem>
                                {platformChargesData && platformChargesData?.map((item) =>
                                    <MenuItem key={item?._id} value={item?.platformChargeAmount}>{item?.platformChargeAmount}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        {inputFieldError?.language && <div style={{ color: "#D32F2F", fontSize: "13px", padding: "5px 15px 0 12px", fontWeight: "500" }}>{inputFieldError?.language}</div>}
                    </Grid>

                    <Grid item lg={4} sm={12} md={12} xs={12}>
                        <TextField
                            label={<>Live Price <span style={{ color: "red" }}>*</span></>} variant="outlined" fullWidth
                            type="number"
                            name='video_call_price'
                            value={inputFieldDetail?.video_call_price}
                            onChange={handleInputField}
                            error={inputFieldError.video_call_price ? true : false}
                            helperText={inputFieldError.video_call_price}
                            onFocus={() => handleInputFieldError("video_call_price", null)}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12} xs={12} >
                        <FormControl fullWidth>
                            <InputLabel id="select-label">Select Live Plaform Charges <span style={{ color: "red" }}>* </span></InputLabel>
                            <Select
                                label="Select Live Plaform Charges * " variant="outlined" fullWidth
                                name='commission_video_call_price'
                                value={inputFieldDetail?.commission_video_call_price}
                                onChange={handleInputField}
                                error={inputFieldError?.commission_video_call_price ? true : false}
                                onFocus={() => handleInputFieldError("commission_video_call_price", null)}
                            >
                                <MenuItem disabled>---Select Live Plaform Charges---</MenuItem>
                                {platformChargesData && platformChargesData?.map((item) =>
                                    <MenuItem key={item?._id} value={item?.platformChargeAmount}>{item?.platformChargeAmount}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        {inputFieldError?.language && <div style={{ color: "#D32F2F", fontSize: "13px", padding: "5px 15px 0 12px", fontWeight: "500" }}>{inputFieldError?.language}</div>}
                    </Grid>

                    <Grid item lg={4} sm={12} md={12} xs={12}>
                        <TextField
                            label={<>Video Call Price <span style={{ color: "red" }}>*</span></>} variant="outlined" fullWidth

                            type="number"
                            name='normal_video_call_price'
                            value={inputFieldDetail?.normal_video_call_price}
                            onChange={handleInputField}
                            error={inputFieldError.normal_video_call_price ? true : false}
                            helperText={inputFieldError.normal_video_call_price}
                            onFocus={() => handleInputFieldError("normal_video_call_price", null)}
                        />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12} xs={12} >
                        <FormControl fullWidth>
                            <InputLabel id="select-label">Select Video Call Plaform Charges <span style={{ color: "red" }}>* </span></InputLabel>
                            <Select
                                label="Select Video Call Plaform Charges * " variant="outlined" fullWidth
                                name='commission_normal_video_call_price'
                                value={inputFieldDetail?.commission_normal_video_call_price}
                                onChange={handleInputField}
                                error={inputFieldError?.commission_normal_video_call_price ? true : false}
                                onFocus={() => handleInputFieldError("commission_normal_video_call_price", null)}
                            >
                                <MenuItem disabled>---Select Video Call Plaform Charges---</MenuItem>
                                {platformChargesData && platformChargesData?.map((item) =>
                                    <MenuItem key={item?._id} value={item?.platformChargeAmount}>{item?.platformChargeAmount}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        {inputFieldError?.language && <div style={{ color: "#D32F2F", fontSize: "13px", padding: "5px 15px 0 12px", fontWeight: "500" }}>{inputFieldError?.language}</div>}
                    </Grid>
                    {/* Price End */}

                    {/* Long Bio */}
                    <Grid item lg={12} sm={12} md={12} xs={12}>
                        <TextField
                            label="Long Bio" variant="outlined" fullWidth multiline rows={4}
                            name='longBio'
                            value={inputFieldDetail?.longBio}
                            onChange={handleInputField}
                            error={inputFieldError.longBio ? true : false}
                            helperText={inputFieldError.longBio}
                            onFocus={() => handleInputFieldError("longBio", null)}
                        />
                    </Grid>

                    <Grid item lg={12} sm={12} md={12} xs={12}>
                        <FormLabel component="legend" sx={{ fontWeight: 'bold' }}>Skills <span style={{ color: "red" }}>*</span></FormLabel>
                        <FormGroup aria-label="position" row>
                            {skillData && skillData?.sort((a, b) => a.skill.localeCompare(b.skill))?.map((item, index) => {
                                return (
                                    <Grid key={index} xs={12} md={3}>
                                        <FormControlLabel
                                            value={item._id}
                                            className={classes.checkbox}
                                            control={<Checkbox checked={skills && skills.includes(item._id)} onChange={() => handleSkills(item)} className={classes.smallCheckbox} style={{ fontSize: '14px' }} size="small" />}
                                            label={item?.skill}
                                            labelPlacement="end"
                                        />
                                    </Grid>
                                );
                            })}
                        </FormGroup>
                        {inputFieldError?.skills && <div style={{ color: "#D32F2F", fontSize: "13px", padding: "5px 15px 0 12px", fontWeight: "500" }}>{inputFieldError?.skills}</div>}
                    </Grid>

                    <Grid item lg={12} sm={12} md={12} xs={12}>
                        <FormLabel component="legend" sx={{ fontWeight: 'bold' }}>Remedies <span style={{ color: "red" }}>*</span></FormLabel>
                        <FormGroup row>
                            {remediesData && remediesData?.sort((a, b) => a.title.localeCompare(b.title))?.map((item, index) => {
                                return (
                                    <Grid key={index} xs={12} md={3}>
                                        <FormControlLabel
                                            value={item._id}
                                            className={classes.checkbox}
                                            control={<Checkbox checked={remedies && remedies.includes(item._id)} onChange={() => handleRemedies(item)} className={classes.smallCheckbox} style={{ fontSize: '14px' }} size="small" />}
                                            label={item.title}
                                            labelPlacement="end"
                                            sx={{ textWrap: 'nowrap' }}
                                        />
                                    </Grid>
                                );
                            })}
                        </FormGroup>
                        {inputFieldError?.remedies && <div style={{ color: "#D32F2F", fontSize: "13px", padding: "5px 15px 0 12px", fontWeight: "500" }}>{inputFieldError?.remedies}</div>}
                    </Grid>

                    <Grid item lg={12} sm={12} md={12} xs={12}>
                        <FormLabel component="legend" sx={{ fontWeight: 'bold' }}>Main Expertise <span style={{ color: "red" }}>*</span></FormLabel>
                        <FormGroup aria-label="position" row>
                            {mainExpertiseData && mainExpertiseData?.sort((a, b) => a.mainExpertise.localeCompare(b.mainExpertise))?.map((item, index) => {
                                return (
                                    <Grid key={index} xs={12} md={3}>
                                        <FormControlLabel
                                            value={item._id}
                                            className={classes.checkbox}
                                            control={<Checkbox checked={mainExpertise && mainExpertise.includes(item._id)} onChange={() => handleMainExpertise(item)} className={classes.smallCheckbox} style={{ fontSize: '14px' }} size="small" />}
                                            label={item.mainExpertise}
                                            labelPlacement="end"
                                        />
                                    </Grid>
                                );
                            })}
                        </FormGroup>
                        {inputFieldError?.mainExpertise && <div style={{ color: "#D32F2F", fontSize: "13px", padding: "5px 15px 0 12px", fontWeight: "500" }}>{inputFieldError?.mainExpertise}</div>}
                    </Grid>
                    {/* Check Box End */}

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

export default AddAstrologer;