import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import colors from "../config/colors";
import AppText from "./AppText";

function Card(props) {
  const { humidity = "Data unavailable", temperature = "Data unavailable", moisture = "Data unavailable" } = props;
  return (
    <TouchableWithoutFeedback >
      <View style={styles.card}>
        {/* <Image style={styles.image} source={{ uri: imageUri }} /> */}
        {/* <Image
          style={styles.image}
          // tint = "light"
          // preview={{ uri: thumbnailUrl }} 
          uri={imageUri} /> */}
        <View style={styles.detailsContainer}>
          <AppText style={styles.subTitle}>{temperature || "No data available"}</AppText>
          <AppText style={styles.subTitle}>{humidity || "No data available"}</AppText>
          <AppText style={styles.subTitle}>{moisture || "No data available"}</AppText>
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
    overflow: "hidden"
  },
  detailsContainer: {
    padding: 15,
  },
  image: {
    width: "100%",
    height: 150,
  },
  subTitle: {
    fontWeight: "bold",
    fontFamily: "Roboto",
    color: colors.primary
  },
  title: {
    marginBottom: 7,
  },
});
export default Card;
