import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Image, Modal } from "react-native";
import LottieView from "lottie-react-native"
import Screen from "../components/Screen";
import * as Yup from "yup";
import { AppForm, SubmitButton, AppFormField } from "../components/forms"
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearMessage } from "../actions/auth"
import { showMessage } from "react-native-flash-message";
import routes from "../navigation/routes";

export default function LoginScreen({ navigation }) {
  const validationSchema = Yup.object().shape({
    email: Yup.string().required(),
    password: Yup.string().required().min(5).label("Password"),
  });



  const dispatch = useDispatch()
  const authState = useSelector(state => state.auth)
  const { resMessage = "", resStatus } = authState
  const [loading, setLoading] = useState(false)
  const [formikActions, setFormikActions] = useState(null)
  const prevProps = useRef({ resMessage }).current

  useEffect(() => {
    if (prevProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          showMessage({ message: resMessage, floating: true, type: "success", duration: 1500 })
          setLoading(false)
          dispatch(clearMessage())
          formikActions.resetForm({ email: "", password: "" })
        }
        else {
          setLoading(false)
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
      {
        loading && (
          <Modal visible={loading} style={styles.modal} transparent>
            <LottieView
              loop={true}
              autoPlay
              source={require("../assets/animations/loader.json")}
            />
          </Modal>
        )
      }
      <Image style={styles.logo} source={require("../assets/images/applogo.png")} />
      <AppForm
        initialValues={{ email: "", password: "" }}
        onSubmit={async ({ email, password }, actions) => {
          setLoading(true)
          dispatch(loginUser({ loginType: /\S+@\S+\.\S+/.test(email) ? "email" : "phoneNumber", loginId: email, password }))
          setFormikActions(actions)
          // const result = await authApi.loginUser(email, password)
          // if (!result.isSuccess) {
          //   setErrorMessage(result.errorMessage)
          // }
          // setUser(result.user)
        }}
        validationSchema={validationSchema}
      >
        <AppFormField
          name="email"
          placeholder="Email / Phone Number"
          autoCapitalize="none"
          autoCorrect={false}
          iconName="account"
          keyboardType="default"
        />
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          iconName="lock"
          name="password"
          placeholder="Password"
          secureTextEntry
          textContent="password" //Only for ios
        />
        <SubmitButton title="Login" />
      </AppForm>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  modal: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    width: 200
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
  },
});
