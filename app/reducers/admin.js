import * as actionTypes from "../actions/types";
import cache from "../utility/cache";


const initialState = {
    users: [],
    user: null,
    resMessage: "",
    resStatus: false,
    userData: null,
    isDeleted: false,
    userDetails: null,
    feedbackData: []
}

const adminReducer = (state = initialState, action) => {
    const { isSuccess = false, message = "", payload = null, user = null, userDetails } = action
    switch (action.type) {

        case actionTypes.GET_LOGIN_STATUS: {
            if (isSuccess) {
                // console.log("action user ", action.user, user)
                cache.storeData("user", user)
                return { ...state, user }
            }
            return { ...state, user: null }
        }

        case actionTypes.SEND_FEEDBACK: {
            return { ...state, resMessage: message, resStatus: isSuccess }
        }

        case actionTypes.GET_FEEDBACK_DATA: {
            if (isSuccess) {
                return { ...state, feedbackData: payload.feedbackData, resStatus: true }
            }
            return { ...state, resStatus: false, resMessage: message }
        }

        case actionTypes.SEND_MESSAGE: {
            console.log("admin reducer send messages")
            return { ...state, resMessage: message, resStatus: isSuccess }
        }

        case actionTypes.CLEAR_MESSAGE: {
            return { ...state, resMessage: "", resStatus: false, isDeleted: false }
        }

        case actionTypes.UPDATE_USER_DETAILS: {
            if (isSuccess) {
                return { state, resStatus: true, resMessage: "User details updated successfully" }
            }
            return { ...state, resStatus: false, resMessage: message }
        }

        case actionTypes.DELETE_FEEDBACK: {
            return { ...state, resMessage: message, resStatus: isSuccess }
        }
        case actionTypes.UPDATE_USER_STATUS: {
            if (isSuccess) {
                return { state, resStatus: true, resMessage: message, userDetails }
            }
            return { ...state, resStatus: false, resMessage: message }
        }

        case actionTypes.DELETE_USER: {
            if (isSuccess) {
                return { state, resStatus: true, resMessage: "User deleted successfully.", isDeleted: true }
            }
            return { ...state, resStatus: false, resMessage: message }
        }

        case actionTypes.GET_USERS_LIST: {
            if (isSuccess) {
                return { ...state, resStatus: true, users: payload.users }
            }
            return { ...state, resStatus: false, resMessage: "Failed to fetch users list." }
        }





        default: return state
    }
}

export default adminReducer