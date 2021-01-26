import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AppText from "../AppText";

export default function ErrorMessage(props) {
  const { error, style } = props;
  if (!error) return null;
  return <AppText style={[styles.errorText,style]}>{error}</AppText>;
}

const styles = StyleSheet.create({
  errorText: {
    color: "red",
  },
});
