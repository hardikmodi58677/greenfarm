import React from "react";
import { StyleSheet, Text, View, ImageBackground, Image } from "react-native";
import colors from "../config/colors";
import AppButton from "../components/AppButton";
import routes from "../navigation/routes";

function WelcomeScreen({ navigation }) {
    return (
        <ImageBackground
            blurRadius={30}
            style={styles.background}>
            <View style={styles.logoContainer} >
                <Image style={styles.appLogo}
                    source={require("../assets/images/applogo.png")}
                />
            </View>
            <View style={styles.buttonsContainer}>
                <AppButton
                    title="Login"
                    onPress={() => navigation.navigate(routes.LOGIN)}
                    color="primary" />
                <AppButton
                    title="Register"
                    onPress={() => navigation.navigate(routes.REGISTER)}
                    color="secondary" />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    appLogo: {
        width: 200,
        height: 200,
    },
    background: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: colors.white
    },
    buttonsContainer: {
        padding: 20,
        width: "100%",
    },
    logoContainer: {
        position: "absolute",
        top: "20%",
        alignItems: "center",
    },
    registerBtn: {
        width: "100%",
        height: 70,
        backgroundColor: colors.secondary,
    },
    tagLine: {
        fontFamily: "",
        paddingVertical: 20,
        fontWeight: "bold",
        fontSize: 25
    }
});

export default WelcomeScreen;