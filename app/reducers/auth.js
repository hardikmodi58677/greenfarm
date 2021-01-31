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
                cache.storeData("user", action.payload.user)
                return { ...state, user: action.payload.user, isReady: true }
            }
            return { ...state, resStatus: isSuccess, resMessage: message, isReady: true }
        }

        case actionTypes.REGISTER_USER: {
            if (!isSuccess) {
                return { ...state, resMessage: message, resStatus: isSuccess }
            }
            return { ...state, resMessage: message, resStatus: isSuccess }
        }

        case actionTypes.UPDATE_PROFILE: {
            if (!isSuccess) {
                return { ...state, resStatus: isSuccess, resMessage: message }
            }
            return { ...state, user: { ...state.user, ...action.payload.userDetails }, resStatus: isSuccess, resMessage: "User profile updated successfully." }
        }

        case actionTypes.LOGIN_USER: {
            if (!isSuccess) {
                return { ...state, resMessage: message, resStatus: isSuccess }
            }
            cache.storeData("user", action.payload.user)
            return { ...state, resMessage: message, resStatus: isSuccess, user: action.payload.user }
        }

        case actionTypes.LOGOUT_USER: {
            return { ...state, user: null, resStatus: true, resMessage: "Logged out successfully." }
        }

        case actionTypes.CLEAR_MESSAGE: {
            return { ...state, resMessage: "", resStatus: false }
        }

        // case actionTypes.SEND_OTP: {

        //     if (isSuccess) {
        //         return { ...state, verificationId: payload.verificationId, resStatus: true, resMessage: "OTP sent." }
        //     }
        //     return { ...state, resMessage: message, resStatus: false }
        // }

        // case actionTypes.OTP_VERIFIED: {
        //     if (isSuccess) {
        //         if (!isUserRegistered) {
        //             return { ...state, resMessage: message, resStatus: true, isUserRegistered, isOTPVerified: true }
        //         }
        //         console / log("OTP verified", action.user, user)
        //         AsyncStorage.setItem(JSON.stringify(user))
        //         return { ...state, resMessage: message, resStatus: true, isUserRegistered, user, isOTPVerified: true }
        //         // else{
        //         //     return { ...state, resMessage: message, resStatus: false }

        //         // }

        //     }
        //     return { ...state, resStatus: false, resMessage: message }
        // }

        default: return state
    }
}

export default authReducer