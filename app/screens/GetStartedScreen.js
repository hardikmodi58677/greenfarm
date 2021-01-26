import React, { useRef, useEffect, Fragment } from "react";
import { StyleSheet, Image } from "react-native";
import Screen from "../components/Screen";
import * as Yup from "yup";
import { AppForm, SubmitButton, AppFormField } from "../components/forms"
import firebaseObj from "../firebaseClient"
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, verifyOtp, clearMessage } from "../actions/auth"
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha"
import { showMessage } from "react-native-flash-message";
import routes from "../navigation/routes";

export default function GetStartedScreen({ navigation }) {
  const phoneRegExp = /^[6-9]\d{9}$/
  const validationSchemaPhone = Yup.object().shape({
    phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required().label("Phone number")
  });

  const validationSchemaOtp = Yup.object().shape({
    otpCode: Yup.string().required().max(6).label("OTP code")
  });


  const dispatch = useDispatch()
  const authState = useSelector(state => state.auth)
  const { verificationId, isUserRegistered, resStatus, resMessage, isOTPVerified } = authState
  const verifierRef = useRef(null)
  const prevProps = useRef({ resMessage }).current

  // const { user, setUser } = useContext(AuthContext)

  // const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (prevProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          if (isOTPVerified && isUserRegistered) {
            showMessage({ message: resMessage, floating: true, type: "success", duration: 1000 })
            // setLoading(false)
            dispatch(clearMessage())
            setTimeout(() => { navigation.navigate(routes.USER_DASHBOARD) }, 500);
          }

          if (isUserRegistered !== null && !isUserRegistered && isOTPVerified) {
            showMessage({ message: resMessage, floating: true, type: "success", duration: 1000 })
            setTimeout(() => { navigation.navigate(routes.REGISTER) }, 500);
            dispatch(clearMessage())
          }

        }
        else {
          // dispatch(clearMessage())
          showMessage({ message: resMessage, duration: 2000, type: "danger" })
        }
      }
    }

    return () => {
      prevProps.resMessage = resMessage
    }

  }, [resMessage, resStatus])

  return (
    <Screen style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={verifierRef}
        firebaseConfig={firebaseObj.config}
        attemptInvisibleVerification={true}
      />
      <Image style={styles.logo} source={require("../assets/images/applogo.png")} />
      {/* <ErrorMessage style={styles.error} error={errorMessage} /> */}
      {
        verificationId ?
          (
            <Fragment>
              <AppForm
                initialValues={{ otpCode: "" }}
                onSubmit={async ({ otpCode }) => {
                  // firebaseObj.firebase.auth().verifyPhoneNumber(phoneNumber).then(status => { console.log("status", status) })
                  dispatch(verifyOtp({ otpCode, verificationId }))
                  // const result = await authApi.loginUser(email, password)
                  // if (!result.isSuccess) {
                  //   setErrorMessage(result.errorMessage)
                  // }
                  // setUser(result.user)
                }}
                validationSchema={validationSchemaOtp}
              >
                <AppFormField
                  name="otpCode"
                  placeholder="OTP"
                  autoCorrect={false}
                  iconName="phone"
                  keyboardType="number-pad"
                  maxLenght={6}
                />
                <SubmitButton title="Verify" />
              </AppForm>
            </Fragment>
          )
          : (
            <Fragment>
              <AppForm
                initialValues={{ phoneNumber: "" }}
                onSubmit={async ({ phoneNumber }) => {
                  // firebaseObj.firebase.auth().verifyPhoneNumber(phoneNumber).then(status => { console.log("status", status) })
                  dispatch(sendOtp({ phoneNumber, verifierRef: verifierRef.current }))
                  // const result = await authApi.loginUser(email, password)
                  // if (!result.isSuccess) {
                  //   setErrorMessage(result.errorMessage)
                  // }
                  // setUser(result.user)
                }}
                validationSchema={validationSchemaPhone}
              >
                <AppFormField
                  name="phoneNumber"
                  placeholder="Phone Number"
                  autoCapitalize="none"
                  autoCorrect={false}
                  iconName="phone"
                  keyboardType="number-pad"
                />
                <SubmitButton title="Send Otp" />
              </AppForm>

            </Fragment>
          )
      }
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  error: {
    fontSize: 15
  }
});
