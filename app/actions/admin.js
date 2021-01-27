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

export const deleteFeedback = (feedbackKey) => dispatch => {
    database().ref(`/feedback/${feedbackKey}`).remove()
        .then(() => {
            dispatch({
                type: actionTypes.DELETE_FEEDBACK,
                isSuccess: true,
                message: "Feedback deleted successfully."
            })
        })
        .catch(err => {
            dispatch({
                type: actionTypes.DELETE_FEEDBACK,
                message: "Failed to delete feedback.",
                isSuccess: false
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

export const sendMessage = ({ senderId, senderName, receiverId, title, description, isReply = false, receiver = null, type = "message" }) => dispatch => {
    dispatch({ type: actionTypes.CLEAR_MESSAGE })
    if (type == "feedback") {
        database().ref("/feedback").push({
            senderId,
            senderName,
            title,
            description,
            createdAt: Date.now()
        })
            .then(data => {
                if (data) {
                    dispatch({
                        type: actionTypes.SEND_FEEDBACK,
                        isSuccess: true,
                        message: "Feedback sent successfully."
                    })
                }
                else {
                    dispatch({
                        type: actionTypes.SEND_FEEDBACK,
                        isSuccess: false,
                        message: "Something went wrong."
                    })
                }
            })
            .catch(err => {
                dispatch({
                    type: actionTypes.SEND_FEEDBACK,
                    isSuccess: false,
                    message: "Sending feedback failed."
                })
            })
    }
    else {

        let messageReceiverId = null

        if (receiver && receiver.toString().length) {
            if (receiver == "Admin") {
                messageReceiverId = "-MRyFiGAcdwGYHmJrzD9"
            }
            else {
                messageReceiverId = `-MS3Y__oOTon2BVLVIps`
            }
        }
        else {
            messageReceiverId = receiverId
        }

        const messageSendRef = `/users/${messageReceiverId}/messages`
        database().ref(messageSendRef).push({
            isReply,
            senderId,
            senderName,
            receiverId: messageReceiverId,
            title,
            description,
            createdAt: Date.now()
        }).then(data => {
            if (data) {
                dispatch({
                    type: actionTypes.SEND_MESSAGE,
                    message: "Message sent successfully",
                    isSuccess: true,
                })
            }
            else {
                dispatch({
                    type: actionTypes.SEND_MESSAGE,
                    message: "Send message failed",
                    isSuccess: false,
                })
            }
        }).catch(err => {
            dispatch({
                type: actionTypes.SEND_MESSAGE,
                message: err.message,
                isSuccess: false,
            })
        })
    }
}

export const getUserFeedbackData = () => dispatch => {
    dispatch({ type: actionTypes.CLEAR_MESSAGE })
    const feedbackData = []
    database().ref("/feedback").once("value", dataSnapshot => {
        dataSnapshot.forEach(snapshot => {
            const data = snapshot.val()
            feedbackData.push({ key: snapshot.key, ...data })
        })
        dispatch({
            type: actionTypes.GET_FEEDBACK_DATA,
            isSuccess: true,
            payload: { feedbackData }
        })
    })
        .catch(err => {
            dispatch({
                type: actionTypes.GET_FEEDBACK_DATA,
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

