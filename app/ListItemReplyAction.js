import React from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "./config/colors";

export default function ListItemReplyAction({ onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.replyAction}>
        <MaterialCommunityIcons name="message" size={40} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  replyAction: {
    borderBottomRightRadius: 18,
    borderTopRightRadius: 18,
    height: "100%",
    backgroundColor: colors.primary,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});
