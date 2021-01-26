import React from 'react'
import { StyleSheet, View } from 'react-native'
import colors from '../config/colors'
import Constants from "expo-constants"
import AppText from "./AppText"
import { useNetInfo } from "@react-native-community/netinfo"


export default function OfflineNotice() {

    const netInfo = useNetInfo()
    if (netInfo.type == "unknown" || netInfo.isInternetReachable === false) {
        return (
            <View style={styles.container}>
                <AppText style={styles.text}>No Internet connection</AppText>
            </View>
        )
    }
    return null
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: colors.primary,
        height: 70,
        justifyContent: "center",
        top: Constants.statusBarHeight,
        width: "100%",
        position: "relative",
        zIndex: 1,
    },
    text: {
        color: colors.white,
        textTransform: "capitalize",
    }
})