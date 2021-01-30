import * as actionTypes from "./types"
import firebaseClient from "../firebaseClient"
import cache from "../utility/cache"
const { firebase: { auth, database } } = firebaseClient


export const getUserLoginStatus = () => dispatch => {
    auth().onAuthStateChanged(user => {
        if (!user || !user.uid) {
            cache.getData("user").then(userDetails => {
                if (userDetails) {
                    dispatch({
                        type: actionTypes.GET_LOGIN_STATUS,
                        isSuccess: true,
                        payload: {
                            user: userDetails,
                        }
                    })
                }
                else {
                    dispatch({
                        type: actionTypes.GET_LOGIN_STATUS,
                        isSuccess: false,
                    })
                }
            })
        }
        else {
            database().ref("/users").orderByChild("sEmail").equalTo(user.email).once("value", snapshot => {
                if (snapshot.exists()) {
                    const key = Object.keys(snapshot.val())[0]
                    const details = Object.values(snapshot.val())[0]
                    dispatch({
                        type: actionTypes.GET_LOGIN_STATUS,
                        isSuccess: true,
                        payload: { user: { ...details, sKey: key } }
                    })
                }
            })
                .catch(err => {
                    dispatch({
                        type: actionTypes.GET_LOGIN_STATUS,
                        isSuccess: false,
                        message: err.message
                    })
                })
        }
    })
}

export const clearMessage = () => (dispatch) => {
    dispatch({ type: actionTypes.CLEAR_MESSAGE })
}

export const loginUser = ({ loginType: sLoginType = "sEmail", loginId: sLoginId = "", password: sPassword = "" }) => dispatch => {
    dispatch({ type: actionTypes.CLEAR_MESSAGE })
    database().ref("/users").orderByChild(sLoginType).equalTo(sLoginId).once("value", snapshot => {
        if (snapshot.exists()) {
            const user = Object.values(snapshot.val())[0]
            if ((user.bIsActive !== undefined || user.bIsActive !== null) && user.bIsActive === false) {
                dispatch({
                    type: actionTypes.LOGIN_USER,
                    isSuccess: false,
                    message: "Your account has been disabled by admin.Please contact admin for support.",
                })
            }
            else {
                const userEmail = user.sEmail
                auth().signInWithEmailAndPassword(userEmail, sPassword).then(() => {
                    dispatch({
                        type: actionTypes.LOGIN_USER,
                        isSuccess: true,
                        message: "User login successful.",
                        payload: { ...user, sKey: user.sKey }
                    })
                }).catch(err => {
                    dispatch({ type: actionTypes.LOGIN_USER, message: err.message, isSuccess: false })
                })
            }
        }
        else {
            dispatch({ type: actionTypes.LOGIN_USER, message: "No such user exists.Please try again.", isSuccess: false })
        }
    }).catch(err => {
        dispatch({ type: actionTypes.LOGIN_USER, message: err.message, isSuccess: false })
    })
}



export const registerUser = ({ username: sUsername, email: sEmail, password: sPassword, phoneNumber: sPhone }) => (dispatch) => {
    dispatch({ type: actionTypes.CLEAR_MESSAGE })
    database().ref("/users").orderByChild("sPhone").equalTo(sPhone).once("value", snapshot => {
        if (snapshot.exists()) {
            dispatch({
                type: actionTypes.REGISTER_USER,
                isSuccess: false,
                message: "This mobile number is already is use with another account."
            })
        }
        else {
            database().ref("/users").orderByChild("sEmail").equalTo(sEmail).once("value", snapshot => {
                if (snapshot.exists()) {
                    dispatch({
                        type: actionTypes.REGISTER_USER,
                        isSuccess: false,
                        message: "This email id is already is use with another account."
                    })
                }
                else {
                    auth()
                        .createUserWithEmailAndPassword(sEmail, sPassword)
                        .then((result) => {
                          
                            database().ref("/users").push({ sUsername: sUsername, sEmail, sPhone: sPhone, eRole: "user", dCreatedAt: Date.now(), bIsActive: true })
                                .then((data) => {
                                    if (data) {
                                        dispatch({
                                            type: actionTypes.REGISTER_USER,
                                            isSuccess: true,
                                            message: "User registered successfully."
                                        })
                                    }
                                })
                                .catch(err => {
                                    dispatch({
                                        type: actionTypes.REGISTER_USER,
                                        isSuccess: false,
                                        message: err.message
                                    })
                                })
                        })
                        .catch(err => {
                            dispatch({
                                type: actionTypes.REGISTER_USER,
                                isSuccess: false,
                                message: err.message
                            })
                        })
                }
            })
        }
    })
        .catch(err => {
            dispatch({
                type: actionTypes.REGISTER_USER,
                isSuccess: false,
                message: err.message
            })
        })
}

export const logoutUser = () => dispatch => {
    auth().signOut()
    cache.removeData("user")
    dispatch({ type: actionTypes.LOGOUT_USER })
}

