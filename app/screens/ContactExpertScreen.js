import React, { useState, useRef, Fragment } from "react";
import * as Yup from "yup";
import { StyleSheet, Image, Modal, StatusBar, ScrollView, View, Text, Switch } from "react-native";
import LottieView from "lottie-react-native"
import Screen from "../components/Screen";
import { AppForm, SubmitButton, AppFormField } from "../components/forms"
import AppModal from "../components/AppModal"
import { useDispatch, useSelector } from "react-redux";
import { getExpertContactDetails } from "../actions/admin"
import { useEffect } from "react";
import { showMessage } from "react-native-flash-message";
import routes from "../navigation/routes";
import colors from "../config/colors";
import AppButton from "../components/AppButton";
import ListItem from "../components/ListItem";
import { Linking } from 'react-native'

function ContactExpert({ route, navigation }) {
    const dispatch = useDispatch()

    const expertDetails = useSelector(state => state.admin.expertContactDetails)
    useEffect(() => {
        dispatch(getExpertContactDetails())
    }, [])

    return (
        <Fragment >
            <Screen style={styles.container}>
                <Image style={styles.logo} source={require("../assets/images/applogox.png")} />

                <ListItem
                    icon="user"
                    title={expertDetails?.sUsername}
                    subTitle={`Email : ${expertDetails?.sEmail || ""}`}
                    phoneNumber={`Phone : ${expertDetails?.sPhone || ""} `}
                />
                <AppButton title="Contact" style={{ backgroundColor: colors.secondary }} onPress={() => Linking.openURL(`tel:${expertDetails?.sPhone}`)}/>
            </Screen >
        </Fragment >);
}

const styles = StyleSheet.create({
    logo: {
        resizeMode: "contain",
        width: 200,
        height: 200,
        alignSelf: "center",
        marginVertical: 50,
    },
    container: {
        padding: 30,
        marginTop: StatusBar.currentHeight
    },
});

export default ContactExpert;
