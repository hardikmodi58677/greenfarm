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
                        user: userDetails,
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
            database().ref("/users").orderByChild("email").equalTo(user.email).once("value", snapshot => {
                if (snapshot.exists()) {
                    const details = Object.values(snapshot.val())[0]
                    dispatch({
                        type: actionTypes.GET_LOGIN_STATUS,
                        isSuccess: true,
                        user: details,
                    })
                }
            })
                .catch(err => {
                    dispatch({
                        type: actionTypes.GET_LOGIN_STATUS,
                        isSuccess: false,
                    })
                })
        }
    })
}

export const clearMessage = () => (dispatch) => {
    dispatch({ type: actionTypes.CLEAR_MESSAGE })
}

export const verifyOtp = ({ otpCode, verificationId }) => dispatch => {
    const credential = auth.PhoneAuthProvider.credential(verificationId, otpCode)
    auth().signInWithCredential(credential)
        .then(result => {
            if (!result.user.email) {
                dispatch({ type: actionTypes.OTP_VERIFIED, isSuccess: true, message: "OTP verified.", isUserRegistered: false })
                // result.user.updateEmail("hardikmodi5867@gmail.com")
                //     .then(res => {
                //         console.log("email updated", res)
                //         console.log("email", auth().currentUser.email)
                //     })
                //     .catch(err => {
                //         console.log('err updating email', err.message)
                //     })
            }
            else {
                console.log("Already exists", result.user)
                dispatch({ type: actionTypes.OTP_VERIFIED, isSuccess: true, message: "OTP verified.", isUserRegistered: true, user: result.user })
                // console.log("Already exists", result.user.phoneNumber)
                // database().ref("/users").orderByChild("phoneNumber").equalTo(result.user.phoneNumber.substring(3)).once("value", snapshot => {
                //     if (snapshot.exists()) {
                //         console.log("existing user details", snapshot.val())
                //         // dispatch({
                //         //     type: actionTypes.REGISTER_USER,
                //         actionTypes.//     isSuccess: false,
                //         //     message: "This mobile number is already is use with another account."
                //         // })
                //     }
                // })
            }




            // result.user.pro
        })
        .catch(err => {
            console.log("err", err.message)
            dispatch({ type: actionTypes.OTP_VERIFIED, isSuccess: false, message: "Entered OTP is invalid.Please try again." })
        })
}



export const sendOtp = ({ phoneNumber, verifierRef }) => (dispatch) => {
    const phoneProvider = new auth.PhoneAuthProvider()
    phoneProvider
        .verifyPhoneNumber(`+91${phoneNumber}`, verifierRef)
        .then(verificationId => {
            console.log("otp sent")
            dispatch({ type: actionTypes.SEND_OTP, payload: { verificationId }, isSuccess: true })
        }).catch(err => {
            console.log('err', err)
            dispatch({ type: actionTypes.SEND_OTP, message: err.message, isSuccess: false })
        });
}

export const loginUser = ({ loginType = "email", loginId = "", password = "" }) => dispatch => {
    dispatch({ type: actionTypes.CLEAR_MESSAGE })
    database().ref("/users").orderByChild(loginType).equalTo(loginId).once("value", snapshot => {
        if (snapshot.exists()) {
            const user = Object.values(snapshot.val())[0]
            const userEmail = user.email
            auth().signInWithEmailAndPassword(userEmail, password).then((userCredential) => {
                dispatch({
                    type: actionTypes.LOGIN_USER,
                    isSuccess: true,
                    user,
                })
            }).catch(err => {
                dispatch({ type: actionTypes.LOGIN_USER, message: err.message, isSuccess: false })
            })
        }
        else {
            dispatch({ type: actionTypes.LOGIN_USER, message: "No such user exists.Please try again.", isSuccess: false })
        }
    }).catch(err => {
        dispatch({ type: actionTypes.LOGIN_USER, message: err.message, isSuccess: false })
    })
}


// export const loginUser = ({ phoneNumber }) => (dispatch) => {
//     // dispatch({ type: "CLEAR_MESSAGE" })
//     database().ref("/users").orderByChild("phoneNumber").equalTo(phoneNumber).once("value", snapshot => {
//         if (snapshot.exists()) {
//             const user = snapshot.val()
//             console.log("usr", user)

//             auth().verifyP

//             // dispatch({
//             //     type: "actionTypes.REGISTER_USER",
// actionTypes.//             //     isSuccess: false,
//             //     message: "This mobile number is already is use with another account."
//             // })
//         }
//         else {
//             dispatch({
//                 type: "VALIDATE_OTP",
//                 isSuccess: false,
//                 message: "Mobile number doesnt belong to any user."
//             })

//         }


//     }).then(data => {
//         console.log("data repeat", data)
//     }).catch(err => {
//         console.log('err', err)
//     })
// }


export const registerUser = ({ username, email, password, phoneNumber }) => (dispatch) => {
    dispatch({ type: actionTypes.CLEAR_MESSAGE })
    database().ref("/users").orderByChild("phoneNumber").equalTo(phoneNumber).once("value", snapshot => {
        if (snapshot.exists()) {
            dispatch({
                type: actionTypes.REGISTER_USER,
                isSuccess: false,
                message: "This mobile number is already is use with another account."
            })
        }
        else {
            database().ref("/users").orderByChild("email").equalTo(email).once("value", snapshot => {
                if (snapshot.exists()) {
                    dispatch({
                        type: actionTypes.REGISTER_USER,
                        isSuccess: false,
                        message: "This email id is already is use with another account."
                    })
                }
                else {
                    auth()
                        .createUserWithEmailAndPassword(email, password)
                        .then((result) => {
                            console.log("user registered", result)
                            // result.user.updatePhoneNumber(`+91${phoneNumber}`).then(res => {
                            //     console.log("currentUser", auth().currentUser)
                            //     console.log("updateProfile", res)
                            // }).catch(err => {
                            //     console.log("updateProfile err", err)
                            // })
                            database().ref("/users").push({ username, email, phoneNumber, role: "user", dCreatedAt: Date.now() })
                                .then((data) => {
                                    if (data) {
                                        console.log("user added to database", data)
                                        dispatch({
                                            type: actionTypes.REGISTER_USER,
                                            isSuccess: true
                                        })
                                    }
                                })
                                .catch(err => {
                                    console.log("db error", err)
                                    dispatch({
                                        type: actionTypes.REGISTER_USER,
                                        isSuccess: false,
                                        message: err.message
                                    })
                                })
                        })
                        .catch(err => {
                            console.log("Error registering user", err)
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
            console.log("db error", err)
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

