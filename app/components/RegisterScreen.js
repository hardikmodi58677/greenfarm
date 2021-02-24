import React, { useState } from "react";
import { StyleSheet, Image, Modal, View } from "react-native";
import LottieView from "lottie-react-native"
import Screen from "../components/Screen";
import authApi from "../api/auth"
import * as Yup from "yup";
import { AppForm, SubmitButton, AppFormField, ErrorMessage } from "../components/forms"
import routeConstants from "../navigation/routes"
export default function RegisterScreen({ navigation }) {
    const validationSchema = Yup.object().shape({
        username: Yup.string().required().label("Name"),
        email: Yup.string().required().email().label("Email"),
        password: Yup.string().required().min(5).label("Password"),
    });

    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState(false)

    return (
        <Screen style={styles.container}>
            {
                loading && (
                    <Modal visible={loading}>
                        <View style={styles.modal}>
                            <LottieView
                                loop={true}
                                autoPlay
                                source={require("../assets/animations/loader.json")}
                            />
                        </View>
                    </Modal>
                )
            }
            <Image style={styles.logo} source={require("../assets/applogox.png")} />
            <ErrorMessage style={styles.error} error={errorMessage} />
            <AppForm
                initialValues={{ username: "", email: "", password: "" }}
                onSubmit={async ({ username, email, password }) => {
                    try {
                        setLoading(true)
                        const result = await authApi.registerUser({ displayName: username, email, password })
                        setLoading(false)
                        if (!result.isSuccess) {
                            setErrorMessage(errorMessage)
                        }
                        else {
                            navigation.navigate(routeConstants.LOGIN)

                        }
                    }
                    catch (err) {
                        alert(err.message)
                    }

                }}
                validationSchema={validationSchema}
            >
                <AppFormField
                    name="username"
                    placeholder="Name"
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
                    autoCapitalize="none"
                    autoCorrect={false}
                    iconName="lock"
                    name="password"
                    placeholder="Password"
                    secureTextEntry
                    textContent="password" //Only for ios
                />
                <SubmitButton title="Register" />
            </AppForm>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    logo: {
        width: 100,
        height: 100,
        alignSelf: "center",
        marginTop: 50,
        marginBottom: 20,
    },
    error: {
        fontSize: 15
    }
});
