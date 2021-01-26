import React, { useEffect } from "react";
import { StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import Icon from "./Icon";
import AppText from "./AppText";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function CategoryPickerItem(props) {
  const { onPress, item } = props;
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
      <Icon
        backgroundColor={item.backgroundColor}
        name={item.iconName}
        size={80}
      />
      <AppText style={styles.label}>{item.label}</AppText>
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    alignItems: "center",
    width: "33%",
  },
  label: {
    marginTop: 5,
    fontSize: 15,
    textAlign: "center",
  },
});
