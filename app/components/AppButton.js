import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import colors from "../config/colors";

function AppButton(props) {
  const { title, onPress, color = "primary", style } = props;
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: colors[color], ...style }]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "100%",
    marginVertical: 10
  },
  text: {
    color: colors.white,
    fontSize: 18,
    fontFamily: "",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default AppButton;
