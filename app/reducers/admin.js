import * as actionTypes from "../actions/types";
import cache from "../utility/cache";


const initialState = {
    userList: [],
    videoList: [],
    feedbackList: [],
    sensorDataList: [],
    messageList: [],
    resMessage: "",
    resStatus: false,
    isDeleted: false,
    userDetails: null,
}

const adminReducer = (state = initialState, action) => {
    const { isSuccess = false, message = "", type } = action
    switch (type) {


        case actionTypes.SEND_FEEDBACK: {
            return { ...state, resMessage: message, resStatus: isSuccess }
        }

        case actionTypes.GET_FEEDBACK_LIST: {
            if (isSuccess) {
                return { ...state, feedbackList: action.payload.feedbackList, resStatus: isSuccess }
            }
            return { ...state, resStatus: false, resMessage: message }
        }

        case actionTypes.SEND_MESSAGE: {
            return { ...state, resMessage: message, resStatus: isSuccess }
        }

        case actionTypes.ADD_VIDEO: {
            return { ...state, resMessage: message, resStatus: isSuccess }
        }

        case actionTypes.DELETE_VIDEO: {
            if (isSuccess) {
                return { ...state, resMessage: message, resStatus: isSuccess, videoList: state.videoList.filter(({ sKey }) => sKey !== action.payload.key) }
            }
            return { ...state, resMessage: message, resStatus: false }
        }

        case actionTypes.CLEAR_RES_MESSAGE: {
            return { ...state, resMessage: "", resStatus: false, isDeleted: false }
        }

        case actionTypes.UPDATE_USER_DETAILS: {
            if (isSuccess) {
                return {
                    state, resStatus: true, resMessage: "User details updated successfully",
                    userDetails: action.payload.userDetails
                }
            }
            return { ...state, resStatus: false, resMessage: message }
        }

        case actionTypes.DELETE_FEEDBACK: {
            return { ...state, resMessage: message, feedbackList: state.feedbackList.filter(({ key }) => key !== action.payload.key), resStatus: isSuccess }
        }
        case actionTypes.UPDATE_USER_STATUS: {
            if (isSuccess) {
                return { state, resStatus: true, resMessage: message, userDetails: action.payload.userDetails }
            }
            return { ...state, resStatus: false, resMessage: message }
        }

        case actionTypes.DELETE_USER: {
            if (isSuccess) {
                return { state, resStatus: true, resMessage: message, isDeleted: true, userList: state.userList.filter(({ key }) => key !== action.payload.key), isDeleted: true }
            }
            return { ...state, resStatus: false, resMessage: message }
        }

        case actionTypes.GET_USERS_LIST: {
            if (isSuccess) {
                return {
                    ...state,
                    resStatus: true,
                    userList: action.payload.userList,
                    resMessage: message
                }
            }
            return { ...state, resStatus: false, resMessage: message }
        }

        case actionTypes.GET_VIDEOS_LIST: {
            if (isSuccess) {

                return { ...state, resStatus: isSuccess, videoList: action.payload.videoList }
            }
            return { ...state, resMessage: message, resStatus: isSuccess }
        }

        // Sensors

        case actionTypes.GET_SENSOR_DATA_LIST: {
            if (isSuccess) {
                return { ...state, resStatus: isSuccess, sensorDataList: action.payload.sensorDataList }
            }
            return { ...state, resStatus: isSuccess, resMessage: message }
        }

        case actionTypes.GET_MESSAGE_LIST: {
            if (isSuccess) {
                return { ...state, resStatus: isSuccess, messageList: action.payload.messageList }
            }
            return { ...state, resStatus: false, resMessage: message }
        }

        case actionTypes.GET_EXPERT_CONTACT_DETAILS: {
            if (isSuccess) {
                return { ...state, expertContactDetails: action.payload.expertContactDetails }
            }
            return { ...state, resStatus: false, resMessage: message }
        }





        default: return state
    }
}

export default adminReducer