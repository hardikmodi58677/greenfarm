import React, {  useState } from "react";
import { StyleSheet, Image, Modal } from "react-native";
import LottieView from "lottie-react-native"
import Screen from "../components/Screen";
import * as Yup from "yup";
import { AppForm, SubmitButton, AppFormField} from "../components/forms"
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearMessage } from "../actions/auth"
import { useRef } from "react";
import { useEffect } from "react";
import { showMessage } from "react-native-flash-message";
import routes from "../navigation/routes";

export default function RegisterScreen({ navigation }) {

    const dispatch = useDispatch()
    const authState = useSelector(state => state.auth)
    const { resMessage, resStatus } = authState

    const prevProps = useRef({ resMessage }).current

    const phoneRegExp = /^[6-9]\d{9}$/
    const validationSchema = Yup.object().shape({
        email: Yup.string().required().email().label("Email"),
        username: Yup.string().required().label("Name"),
        password: Yup.string().required().min(6).label("Password"),
        phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required().label("Phone number")
    });

    // const [errMessage, setErrMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [formikActions, setFormikActions] = useState(null)
    



    useEffect(() => {
        if (prevProps.resMessage !== resMessage) {
            if (resMessage) {
                if (resStatus) {
                    showMessage({ message: resMessage, floating: true, type: "success", duration: 1000 })
                    setLoading(false)
                    dispatch(clearMessage())
                    formikActions.resetForm({ username: "", email: "", phoneNumber: "", password: "" })
                    setTimeout(() => { navigation.navigate(routes.LOGIN) }, 500);
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
                initialValues={{ username: "", email: "", password: "", phoneNumber: "" }}
                onSubmit={async ({ username, email, phoneNumber, password }, actions) => {
                    setFormikActions(actions)
                    setLoading(true)
                    dispatch(registerUser({ username, email, phoneNumber, password }))

                }}
                validationSchema={validationSchema}
            >
                <AppFormField
                    name="username"
                    placeholder="Username"
                    autoCapitalize="none"
                    autoCorrect={false}
                    iconName="account"
                    keyboardType="email-address" //Only for ios
                />
                <AppFormField
                    name="email"
                    placeholder="Email"
                    autoCapitalize="none"
                    autoCorrect={false}
                    iconName="email"
                    keyboardType="email-address"
                    textContent="emailAddress" //Only for ios
                />
                <AppFormField
                    name="phoneNumber"
                    placeholder="Phone Number"
                    iconName="phone"
                    keyboardType="number-pad"
                    textContent="telephoneNumber" //Only for ios
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
                {/* <ErrorMessage style={styles.error} error={errMessage} /> */}
                <SubmitButton title="Register" />
            </AppForm>

        </Screen >
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 18,
    },
    logo: {
        width: 200,
        height: 200,
        alignSelf: "center",
        marginBottom: 20,
    },
    modal: {
        alignItems: "center",
        justifyContent: "center",
        height: 200,
        width: 200
    }
});
