import * as actionTypes from "./types"
import firebaseClient from "../firebaseClient"
const { firebase: { auth, database } } = firebaseClient
import { getUserLoginStatus as getLoginStatus } from "./auth"
import { clearMessage as clearPreviousMessage } from "./auth"

export const getUserLoginStatus = getLoginStatus
export const clearMessage = clearPreviousMessage
export const updateUser = ({ key, username, email, phoneNumber }) => dispatch => {
    dispatch({ type: actionTypes.CLEAR_MESSAGE })

    database().ref(`/users/${key}`).update({ username, phoneNumber, email })
        .then(() => {
            dispatch({
                type: actionTypes.UPDATE_USER_DETAILS,
                isSuccess: true,
            })
        })
        .catch(err => {
            dispatch({
                type: actionTypes.UPDATE_USER_DETAILS,
                isSuccess: false,
                message: err.message
            })
        })
}

export const getUsersList = () => dispatch => {
    const users = []
    database().ref("/users").orderByChild("role").equalTo("user").once("value", dataSnapshot => {
        dataSnapshot.forEach(snapshot => {
            const data = snapshot.val()
            users.push({ key: snapshot.key, ...data })
        })
        dispatch({
            type: actionTypes.GET_USERS_LIST,
            isSuccess: true,
            payload: { users }
        })
    })
        .catch(err => {
            dispatch({
                type: actionTypes.GET_USERS_LIST,
                isSuccess: false,
                message: err.message
            })
        })
}

export const deleteUser = (userKey) => dispatch => {
    dispatch({ type: actionTypes.CLEAR_MESSAGE })
    database().ref(`/users/${userKey}`).remove()
        .then(() => {
            dispatch({
                type: actionTypes.DELETE_USER,
                message: "User deleted successfully",
                isSuccess: true
            })
        })
        .catch(err => {
            dispatch({
                type: actionTypes.DELETE_USER,
                message: err.message,
                isSuccess: false
            })
        })
}

export const deleteVideo = (videoKey) => {
    dispatch({ type: actionTypes.CLEAR_MESSAGE })
    database().ref(`/videos/${videoKey}`).remove()
        .then(() => {
            dispatch({
                type: actionTypes.DELETE_VIDEO,
                isSuccess: true
            })
        }).
        catch(err => {
            dispatch({
                type: actionTypes.DELETE_VIDEO,
                isSuccess: false,
                message: err.message
            })
        })
}



export const updateUserStatus = (userKey, isActive) => dispatch => {
    dispatch({ type: actionTypes.CLEAR_MESSAGE })
    database().ref(`/users/${userKey}`).once("value", dataSnapshot => {
        if (dataSnapshot.exists()) {
            const user = dataSnapshot.val()
            database().ref(`/users/${userKey}`).update({ ...user, isActive })
                .then(() => {
                    dispatch({
                        type: actionTypes.UPDATE_USER_STATUS,
                        message: "User updated successfully",
                        isSuccess: true,
                        userDetails: { ...user, isActive }
                    })
                })
                .catch(err => {
                    dispatch({
                        type: actionTypes.UPDATE_USER_STATUS,
                        message: err.message,
                        isSuccess: false
                    })
                })
        }
        else {
            dispatch({
                type: actionTypes.UPDATE_USER_STATUS,
                message: "Failed to update user.",
                isSuccess: false
            })
        }

    }).catch(err => {
        dispatch({
            type: actionTypes.UPDATE_USER_STATUS,
            message: err.message,
            isSuccess: false
        })
    })

}

