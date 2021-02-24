import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import colors from "../config/colors";
import AppText from "./AppText";

function Card(props) {
  const { list = [], item = null } = props;
  const index = list.findIndex(it => item.sKey == it.sKey)
  let { prevTemp, prevMois, prevHumd, temp, tempStyle = { color: colors.primary }, humd, humdStyle = { color: colors.primary }, mois, moisStyle = { color: colors.primary } } = {}
  if (index !== list.length) {
    const prevValues = list[index + 1]
    const currentValues = list[index]
    if (prevValues && currentValues) {

      prevTemp = parseInt(prevValues.temperature)
      prevHumd = parseInt(prevValues.humidity)
      prevMois = parseInt(prevValues.moisture)
      temp = parseInt(currentValues.temperature)
      humd = parseInt(currentValues.humidity)
      mois = parseInt(currentValues.moisture)

      if (prevTemp < temp) {
        tempStyle = { color: colors.danger }
      } else if (prevTemp > temp) {
        tempStyle = { color: colors.secondary }
      }

      if (prevMois < mois) {
        moisStyle = { color: colors.secondary }
      } else if (prevMois > mois) {
        moisStyle = { color: colors.danger }
      }

      if (prevHumd < humd) {
        humdStyle = { color: colors.secondary }
      } else if (prevHumd > humd) {
        humdStyle = { color: colors.danger }
      }
    }
  }

  if (!temp && !humd && !mois) {
    return null
  }
  else return (
    <TouchableWithoutFeedback >
      <View style={styles.card}>
        <View style={styles.detailsContainer}>
          <AppText style={[styles.subTitle, tempStyle]}>{temp == 0 || temp ? `Temperature :${temp}℃` : "Data unavailable"}</AppText>
          <AppText style={[styles.subTitle, humdStyle]}>{humd == 0 || humd ? `Humidity :${humd} RH` : "Data unavailable"}</AppText>
          <AppText style={[styles.subTitle, moisStyle]}>{mois == 0 || mois ? `Moisture :${mois} g/m³` : "Data unavailable"}</AppText>
        </View>
      </View>
    </TouchableWithoutFeedback >
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
