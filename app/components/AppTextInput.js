import React from "react";
import { StyleSheet, Text, View, TextInput, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import defaultStyles from "../config/styles";
export default function AppTextInput(props) {
  const { iconName, placeholder, ...otherProps } = props;
  return (
    <View style={styles.container}>
      {iconName && (
        <MaterialCommunityIcons
          name={iconName}
          size={20}
          color={defaultStyles.colors.medium}
          style={styles.icon}
        />
      )}
      <TextInput
        autoCompleteType="off"
        clearButtonMode="always"
        placeholderTextColor={defaultStyles.colors.medium}
        style={defaultStyles.text}
        placeholder={placeholder}
        {...otherProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 25,
    flexDirection: "row",
    width: "100%",
    padding: 15,
    marginVertical: 10,
    alignItems: "center"
  },
  icon: {
    marginRight: 10,
  },
});
