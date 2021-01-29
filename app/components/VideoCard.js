import React from "react";
import { useRef } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import colors from "../config/colors";
import AppText from "./AppText";



function VideoCard(props) {

    const actionRef = (null)
    const { title, subtitle, channelTitle, thumbnail, onPress, renderLeftActions } = props;
    return (
        <Swipeable renderLeftActions={renderLeftActions} ref={actionRef}>
            <TouchableWithoutFeedback onPress={onPress}>
                <View style={styles.card}>
                    <Image
                        style={styles.image}
                        source={{ uri: thumbnail }}
                    />
                    <View style={styles.detailsContainer}>
                        <AppText style={styles.title}>{`${title}`}</AppText>
                        <AppText style={styles.subTitle}>{channelTitle || ""}</AppText>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Swipeable>

    );
}

const styles = StyleSheet.create({
    card: {
        display: "flex",
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
        height: 150,
        borderRadius: 12,
        flexDirection: "row",
        backgroundColor: colors.black,
        marginBottom: 12,
        borderColor: colors.danger,
        borderWidth: 2,
        overflow: "hidden"
    },
    detailsContainer: {
        flex: 1,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "space-evenly",
        display: "flex",
    },
    image: {
        resizeMode: "cover",
        width: "50%",
        margin: 5,
        height: 150,
    },
    subTitle: {
        color: colors.secondary,
        fontSize: 13,
    },
    title: {
        color: colors.primary,
        fontWeight: "bold",
        fontSize: 16,
        overflow: "scroll"
    },
});
export default VideoCard;
