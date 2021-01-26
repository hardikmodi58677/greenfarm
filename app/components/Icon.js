import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Icon(props) {
  const {
    backgroundColor = colors.black,
    iconColor = colors.white,
    name,
    size = 40,
  } = props;
  return (
    <View
      style={{
        backgroundColor: backgroundColor,
        width: size,
        height: size,
        borderRadius: size / 2,
        justifyContent : "center",
        alignItems : "center"
      }}
    >
      <MaterialCommunityIcons name={name} size={size * 0.5} color={iconColor} />
    </View>
  );
}

const styles = StyleSheet.create({});
