import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import colors from "../config/colors";
import AppText from "./AppText";

function VideoCard(props) {
    const { title, subtitle, creator, thumbnail, onPress, renderRightActions } = props;
    return (
        <Swipeable renderRightActions={renderRightActions}>
            <TouchableWithoutFeedback onPress={onPress}>
                <View style={styles.card}>
                    <Image
                        style={styles.image}
                        source={{ uri: thumbnail }} />
                    <View style={styles.detailsContainer}>
                        <AppText style={styles.title}>{`${title} -${creator}`}</AppText>
                        <AppText style={styles.subTitle}>{subtitle}</AppText>
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
        flexDirection: "row",
        borderRadius: 18,
        backgroundColor: "black",
        marginBottom: 12,
        borderColor: colors.primary,
        borderWidth: 2,
        overflow: "hidden"
    },
    detailsContainer: {
        overflow: "scroll",
        flex: 1,
        display: "flex",
        padding: 5,
    },
    image: {
        display: "flex",
        resizeMode: "cover",
        width: "50%",
        padding: 5,
        height: 150,
    },
    subTitle: {
        color: colors.secondary,
        fontSize: 10,
    },
    title: {
        color: colors.primary,
        fontWeight: "bold",
        fontSize: 15,
        overflow: "scroll"
    },
});
export default VideoCard;
