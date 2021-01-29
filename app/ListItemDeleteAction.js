import React from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "./config/colors";

export default function ListItemDeleteAction({ onPress, style }) {
  return (
    <TouchableWithoutFeedback onPress={onPress} >
      <View style={[{ ...styles.deleteAction, ...style }]}>
        <MaterialCommunityIcons name="trash-can" size={40} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  deleteAction: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    height: 100,
    backgroundColor: colors.danger,
    width: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
});
