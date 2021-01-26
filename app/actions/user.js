import * as actionTypes from "./types"
import firebaseClient from "../firebaseClient"
const { firebase: { auth, database } } = firebaseClient
import store from "../reducers/index"

export const getSensorData = () => dispatch => {
    const sensorData = []
    database().ref("/sensordata").limitToFirst(50).once("value", dataSnapshot => {
        dataSnapshot.forEach(snapshot => {
            const data = snapshot.val()
            sensorData.push({ key: snapshot.key, ...data })
        })
        dispatch({
            type: actionTypes.GET_SENSOR_DATA,
            isSuccess: true,
            payload: { sensorData }
        })
    })
        .catch(err => {
            dispatch({
                type: actionTypes.GET_SENSOR_DATA,
                isSuccess: false,
                message: err.message
            })
        })
}


export const getUserMessages = () => (dispatch, getState) => {
    const messages = []
    const user = getState().auth.user

    database().ref("/users").orderByChild("email").equalTo(user.email).once("value", snapshot => {
        if (snapshot.exists()) {
            const userKey = Object.keys(snapshot.val())[0]

            database().ref(`/users/${userKey}/messages`).limitToFirst(40).once("value", dataSnapshot => {
                dataSnapshot.forEach(snapshot => {
                    const data = snapshot.val()
                    messages.push({ key: snapshot.key, ...data })
                })
                dispatch({
                    type: actionTypes.GET_USER_MESSAGES,
                    isSuccess: true,
                    payload: { messages }
                })
            })
                .catch(err => {
                    dispatch({
                        type: actionTypes.GET_USER_MESSAGES,
                        isSuccess: false,
                        message: err.message
                    })
                })
        }
        else {
            dispatch({
                type: actionTypes.GET_USER_MESSAGES,
                isSuccess: false,
                message: err.message
            })
        }
    })
}

export const getUserVideos = () => (dispatch) => {
    const videos = []
    database().ref(`/videos`).limitToFirst(30).once("value", dataSnapshot => {
        dataSnapshot.forEach(snapshot => {
            const data = snapshot.val()
            videos.push({ key: snapshot.key, ...data })
        })
        dispatch({
            type: actionTypes.GET_USER_VIDEOS,
            isSuccess: true,
            payload: { videos }
        })
    })
        .catch(err => {
            dispatch({
                type: actionTypes.GET_USER_VIDEOS,
                isSuccess: false,
                message: err.message
            })
        })

}

