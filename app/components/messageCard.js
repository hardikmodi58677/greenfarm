import React from "react";
import { StyleSheet, View, Image, TouchableHighlight } from "react-native";
import AppText from "./AppText";
import colors from "../config/colors";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ListItem(props) {
  const {
    from,
    title,
    subTitle,
    image,
    IconComponent,
    onPress,
    renderRightActions,
    phoneNumber
  } = props;
  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableHighlight underlayColor={colors.light} onPress={onPress}>
        <View style={styles.container}>
          {IconComponent}
          {<Image style={styles.image} source={require("../assets/images/userImage.jpg")} />}
          <View style={styles.detailsContainer}>
            <AppText numberOfLines={1} style={styles.title}>{title}</AppText>
            {subTitle && <AppText numberOfLines={2} style={styles.subTitle}>{subTitle}</AppText>}
            {phoneNumber && <AppText numberOfLines={2} style={styles.subTitle}>{phoneNumber}</AppText>}
          </View>
          {/* <MaterialCommunityIcons color={colors.medium} name="chevron-right" size={25} /> */}
        </View>
      </TouchableHighlight>
    </Swipeable >
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    backgroundColor: colors.white
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 10,
  },
  title: {
    fontWeight: "bold",
    color: colors.primary
  },
  phoneNumber: {
    color: colors.medium,
    fontSize: 15,
    fontStyle: "italic"
  },
});
