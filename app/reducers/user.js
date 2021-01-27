import * as actionTypes from "../actions/types";


const initialState = {
    sensorData: [],
    messages: [],
    videos: [],
    resStatus: false,
    resMessage: ""
}

const userReducer = (state = initialState, action) => {
    const { payload, isSuccess = false, message = "" } = action
    switch (action.type) {
        case actionTypes.GET_SENSOR_DATA: {
            if (isSuccess) {
                return { ...state, sensorData: payload.sensorData }
            }
            return { ...state, resMessage: message }
        }

        case actionTypes.SEND_FEEDBACK:{
            return { ...state, resMessage: message, resStatus: isSuccess }
        }
        case actionTypes.CLEAR_MESSAGE: {
            return { ...state, resMessage: "", resStatus: false }
        }

        case actionTypes.SEND_MESSAGE: {
            return { ...state, resMessage: message, resStatus: isSuccess }
        }

        case actionTypes.GET_USER_MESSAGES: {
            if (isSuccess) {
                return { ...state, messages: payload.messages }
            }
            return { ...state, resMessage: message }
        }

        case actionTypes.GET_USER_VIDEOS: {
            if (isSuccess) {
                return { ...state, videos: payload.videos }
            }
            return { ...state, resMessage: message }
        }

        default: return state
    }
}
export default userReducer
