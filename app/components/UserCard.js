import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import colors from "../config/colors";
import AppText from "./AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import defaultStyles from "../config/styles";

function UserCard(props) {
  const { image, username, email, onPress, phoneNumber } = props

  return (
    <TouchableWithoutFeedback onPress={onPress} >
      <View style={styles.card}>
        {image ?
          <Image style={styles.image} source={{ uri: image }} /> :
          <Image style={styles.image} source={require("../assets/images/userImage.jpg")}
          />}
        <View style={styles.detailsContainer}>
          {username && <AppText style={styles.username}>{username}</AppText>}
          {email && <AppText style={styles.email}>{email}</AppText>}
          {phoneNumber && <AppText style={styles.phoneNumber}>{phoneNumber}</AppText>}
        </View>
        <View style={styles.chevron}>
          <MaterialCommunityIcons
            name="chevron-right"
            size={30}
            color={defaultStyles.colors.medium}
          />
        </View>


      </View>


    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: colors.white,
    marginBottom: 20,
    overflow: "hidden",
    display: "flex",
    flexDirection: "row",
    paddingRight: 10
  },
  detailsContainer: {
    display: "flex",
    justifyContent: "space-around",
    padding: 12,
    width: "65%"
  },
  chevron: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex"
  },
  image: {
    width: "30%",
    height: 120,
  },
  email: {
    color: colors.secondary,
    fontSize: 17
  },
  phoneNumber: {
    color: colors.black,
    fontStyle: "italic"

  },
  username: {
    color: colors.primary,
    fontWeight: "bold",
    fontFamily: "Roboto",
  },
});
export default UserCard;
