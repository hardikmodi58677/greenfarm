import React from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "./config/colors";

export default function ListItemDeleteAction({ onPress }) {
  console.log("render right called");
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.deleteAction}>
        <MaterialCommunityIcons name="trash-can" size={40} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  deleteAction: {
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    height: 150,
    backgroundColor: colors.danger,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});
