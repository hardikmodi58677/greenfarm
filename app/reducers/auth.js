import AsyncStorage from '@react-native-async-storage/async-storage';
import * as actionTypes from "../actions/types";
import cache from "../utility/cache";


const initialState = {
    isLoggedIn: false,
    user: null,
    isReady: false,
    resMessage: "",
    resStatus: false,
    verificationId: "",
    isUserRegistered: null,
    isOTPVerified: null
}

const authReducer = (state = initialState, action) => {
    const { payload, isSuccess = false, isUserRegistered = null, message = "", user = null } = action
    switch (action.type) {
        case actionTypes.GET_LOGIN_STATUS: {
            if (isSuccess) {
                // console.log("action user ", action.user, user)
                cache.storeData("user", user)
                return { ...state, user, isReady: true }
            }
            return { ...state, user: null, isReady: true  }
        }

        case actionTypes.REGISTER_USER: {
            if (!isSuccess) {
                return { ...state, resMessage: message }
            }
            return { ...state, resMessage: "User registered successfully.", resStatus: isSuccess }
        }

        case actionTypes.LOGIN_USER: {
            if (!isSuccess) {
                return { ...state, resMessage: message }
            }
            cache.storeData("user", user.details)
            return { ...state, resMessage: "User login successful.", resStatus: isSuccess, user }
        }

        case actionTypes.LOGOUT_USER: {
            return { ...state, user: null, resStatus: true, resMessage: "Logged out successfully." }
        }

        case actionTypes.CLEAR_MESSAGE: {
            return { ...state, resMessage: "", resStatus: false, verificationId: "" }
        }

        case actionTypes.SEND_OTP: {

            if (isSuccess) {
                return { ...state, verificationId: payload.verificationId, resStatus: true, resMessage: "OTP sent." }
            }
            return { ...state, resMessage: message, resStatus: false }
        }

        case actionTypes.OTP_VERIFIED: {
            if (isSuccess) {
                if (!isUserRegistered) {
                    return { ...state, resMessage: message, resStatus: true, isUserRegistered, isOTPVerified: true }
                }
                console / log("OTP verified", action.user, user)
                AsyncStorage.setItem(JSON.stringify(user))
                return { ...state, resMessage: message, resStatus: true, isUserRegistered, user, isOTPVerified: true }
                // else{
                //     return { ...state, resMessage: message, resStatus: false }

                // }

            }
            return { ...state, resStatus: false, resMessage: message }
        }

        default: return state
    }
}

export default authReducer