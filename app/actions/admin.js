import * as actionTypes from "./types"
import firebaseClient from "../firebaseClient"
const { firebase: { database } } = firebaseClient
import axios from "axios"

export const updateUserProfile = ({ sKey, sUsername, sEmail, sPhone, type = "user" }) => dispatch => {

    dispatch({ type: actionTypes.CLEAR_RES_MESSAGE })

    database().ref(`/users/${sKey}`).update({ sUsername, sEmail, sPhone })
        .then(() => {
            dispatch({
                type: type == "user" ? actionTypes.UPDATE_PROFILE : actionTypes.UPDATE_USER_DETAILS,
                isSuccess: true,
                payload: {
                    userDetails: { sKey, sUsername, sEmail, sPhone }
                }
            })
        })
        .catch(err => {
            dispatch({
                type: type == "user" ? actionTypes.UPDATE_PROFILE : actionTypes.UPDATE_USER_DETAILS,
                isSuccess: false,
                message: err.message
            })
        })
}
export const clearResMessage = () => dispatch => {
    dispatch({ type: actionTypes.CLEAR_RES_MESSAGE })
}

export const deleteFeedback = (key) => dispatch => {
    database().ref(`/feedback/${key}`).remove()
        .then(() => {
            dispatch({
                type: actionTypes.DELETE_FEEDBACK,
                isSuccess: true,
                message: "Feedback deleted successfully.",
                payload: {
                    key
                }
            })
        })
        .catch(err => {
            dispatch({
                type: actionTypes.DELETE_FEEDBACK,
                message: err.message,
                isSuccess: false
            })
        })
}

export const getUsersList = () => dispatch => {
    const users = []
    database().ref("/users").orderByChild("eRole").equalTo("user").once("value", dataSnapshot => {
        dataSnapshot.forEach(snapshot => {
            const data = snapshot.val()
            users.push({ sKey: snapshot.key, ...data })
        })
        dispatch({
            type: actionTypes.GET_USERS_LIST,
            isSuccess: true,
            payload: { userList: users.reverse() }
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

export const deleteUser = (key) => dispatch => {
    dispatch({ type: actionTypes.CLEAR_RES_MESSAGE })
    database().ref(`/users/${key}`).remove()
        .then(() => {
            dispatch({
                type: actionTypes.DELETE_USER,
                message: "User deleted successfully.",
                isSuccess: true,
                payload: { key }
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

export const deleteVideo = (key) => dispatch => {
    database().ref(`/videos/${key}`).remove()
        .then(() => {
            dispatch({
                type: actionTypes.DELETE_VIDEO,
                isSuccess: true,
                message: "Video deleted successfully.",
                payload: { key }
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



export const sendMessage = ({ senderId: sSenderId, senderName: sSenderName, receiverId: sReceiverId, title: sTitle, description: sDescription, isReply: bIsReply = false, receiver: sReceiver = null, type: sType = "message" }) => dispatch => {
    dispatch({ type: actionTypes.CLEAR_RES_MESSAGE })
    if (sType == "feedback") {
        database().ref("/feedback").push({
            sSenderId,
            sSenderName,
            sTitle,
            sDescription,
            dCreatedAt: -1 * Date.now()

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
                    message: err.message
                })
            })
    }
    else {


        let messageReceiverId = null
        if (sReceiver && sReceiver.toString().length) {
            if (sReceiver == "Admin") {
                messageReceiverId = "-MSEFy6HF8VJmcLU-20S"
            }
            else {
                messageReceiverId = `-MSEffFZMa2wH4ykJaGE`
            }
        }
        else {
            messageReceiverId = sReceiverId
        }

        const messageSendRef = `/users/${messageReceiverId}/messages`
        database().ref(messageSendRef).push({
            bIsReply,
            sSenderId,
            sSenderName,
            sTitle,
            sDescription,
            sReceiverId: messageReceiverId,
            dCreatedAt: -1 * Date.now()
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

export const getFeedbackList = () => dispatch => {
    dispatch({ type: actionTypes.CLEAR_RES_MESSAGE })
    const feedbackData = []
    database().ref("/feedback").orderByChild("dCreatedAt").once("value", dataSnapshot => {
        dataSnapshot.forEach(snapshot => {
            const data = snapshot.val()
            feedbackData.push({ sKey: snapshot.key, ...data })
        })
        dispatch({
            type: actionTypes.GET_FEEDBACK_LIST,
            isSuccess: true,
            payload: { feedbackList: feedbackData }
        })
    })
        .catch(err => {
            dispatch({
                type: actionTypes.GET_FEEDBACK_LIST,
                isSuccess: false,
                message: err.message
            })
        })

}



export const updateUserStatus = (key, bIsActive) => dispatch => {
    dispatch({ type: actionTypes.CLEAR_RES_MESSAGE })
    database().ref(`/users/${key}`).once("value", dataSnapshot => {
        if (dataSnapshot.exists()) {
            const user = dataSnapshot.val()
            database().ref(`/users/${key}`).update({ ...user, bIsActive })
                .then(() => {
                    dispatch({
                        type: actionTypes.UPDATE_USER_STATUS,
                        message: "User updated successfully",
                        isSuccess: true,
                        payload: {
                            userDetails: { ...user, bIsActive }
                        }
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

function getYoutubeId(url) {
    const videoRegex = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const matches = url.match(videoRegex)
    return matches && matches.length ? matches[1] : false
}

export const addVideo = ({ videoUrl: sVideoUrl }) => (dispatch, getState) => {
    const youtubeApiKey = `AIzaSyBq4-Wpu4z9TGhjcbhEOgg5b9oOHfaOgPU`
    const videoId = getYoutubeId(sVideoUrl)
    const isAlreadyAdded = getState().admin.videoList.some(video => video.sId == videoId)

    if (isAlreadyAdded) {
        dispatch({ type: actionTypes.ADD_VIDEO, isSuccess: false, message: "Video already added." })
    }
    else {
        axios.get(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${youtubeApiKey}`)
            .then(res => {
                const data = res?.data?.items?.[0]?.snippet
                const sTitle = data?.title
                const sDescription = data?.description.split("").splice(0, 100).join("")
                const sThumbnail = data?.thumbnails?.default.url
                const dPublishedAt = data?.publishedAt
                const sChannelTitle = data?.channelTitle
                database().ref("/videos")
                    .push({ sId: videoId, sTitle, sThumbnail, sDescription, dPublishedAt, sChannelTitle, sUrl: sVideoUrl, dCreatedAt: Date.now() })
                    .then(result => {
                        if (result) {
                            dispatch({ type: actionTypes.ADD_VIDEO, isSuccess: true, message: "Video added successfully." })
                        }
                        else { dispatch({ type: actionTypes.ADD_VIDEO, isSuccess: false, message: "Add video failed." }) }
                    })
                    .catch(err => {
                        dispatch({ type: actionTypes.ADD_VIDEO, isSuccess: false, message: err.message })
                    })
            })
            .catch(err => {
                dispatch({ type: actionTypes.ADD_VIDEO, isSuccess: false, message: err.message })
            })
    }

}


export const getVideos = () => (dispatch) => {
    const videos = []
    dispatch({ type: actionTypes.CLEAR_RES_MESSAGE })
    database().ref(`/videos`).limitToFirst(30).orderByChild("dCreatedAt").once("value", dataSnapshot => {
        dataSnapshot.forEach(snapshot => {
            videos.push({ sKey: snapshot.key, ...snapshot.val() })
        })
        dispatch({
            type: actionTypes.GET_VIDEOS_LIST,
            isSuccess: true,
            payload: { videoList: videos }
        })
    })
        .catch(err => {
            dispatch({
                type: actionTypes.GET_VIDEOS_LIST,
                isSuccess: false,
                message: err.message
            })
        })

}

export const getSensorData = () => dispatch => {
    const sensorData = []
    database().ref("/sensordata").limitToFirst(30).once("value", dataSnapshot => {
        dataSnapshot.forEach(snapshot => {
            const data = snapshot.val()
            sensorData.push({ sKey: snapshot.key, ...data })
        })
        dispatch({
            type: actionTypes.GET_SENSOR_DATA_LIST,
            isSuccess: true,
            payload: { sensorDataList: sensorData.reverse() }
        })
    })
        .catch(err => {
            dispatch({
                type: actionTypes.GET_SENSOR_DATA_LIST,
                isSuccess: false,
                message: err.message
            })
        })
}

export const getMessageList = () => (dispatch, getState) => {
    const messages = []
    const { user } = getState().auth
    database().ref("/users").orderByChild("sEmail").equalTo(user.sEmail).once("value", snapshot => {
        if (snapshot.exists()) {
            const userKey = Object.keys(snapshot.val())[0]

            database().ref(`/users/${userKey}/messages`).limitToFirst(30).once("value", dataSnapshot => {
                dataSnapshot.forEach(snapshot => {
                    const data = snapshot.val()
                    messages.push({ sKey: snapshot.key, ...data })
                })
                dispatch({
                    type: actionTypes.GET_MESSAGE_LIST,
                    isSuccess: true,
                    payload: { messageList: messages.reverse() }
                })
            })
                .catch(err => {
                    dispatch({
                        type: actionTypes.GET_MESSAGE_LIST,
                        isSuccess: false,
                        message: err.message
                    })
                })
        }
        else {
            dispatch({
                type: actionTypes.GET_MESSAGE_LIST,
                isSuccess: false,
                message: "Something went wrong while retrieving user messages."
            })
        }
    })
}

