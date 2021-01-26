import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, FlatList } from "react-native";
import routes from "../navigation/routes"
import Screen from "../components/Screen";
import Card from "../components/Card";
import colors from "../config/colors";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import ActivityIndicator from "../components/ActivityIndicator"
import { useDispatch, useSelector } from "react-redux";
import { getSensorData } from "../actions/user"
import { showMessage } from "react-native-flash-message";


export default function UserDashboard({ navigation }) {
  const [sensorData, setSensorData] = useState([])
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch()
  const userState = useSelector(state => state.user)
  const { resMessage = "", resStatus, sensorData: sensorDataState } = userState
  const prevProps = useRef({ resMessage, sensorDataState }).current




  useEffect(() => {
    setLoading(true)
    dispatch(getSensorData())
  }, [])

  useEffect(() => {
    if (prevProps.sensorDataState !== sensorDataState) {
      if (sensorDataState && sensorDataState.length)
        setSensorData(sensorDataState)
      setLoading(false)
    }
    return () => {
      prevProps.sensorDataState = sensorDataState
    }
  }, [sensorDataState])

  useEffect(() => {
    if (prevProps.resMessage !== resMessage) {
      if (resMessage && !resStatus) {
        setLoading(false)
        showMessage({ message: resMessage, duration: 2000, type: "danger" })
      }
    }
    return () => {
      prevProps.resMessage = resMessage
    }
  }, [resMessage, resStatus])


  return (
    <Screen style={styles.screen}>
      {/* {error && <>
      <AppText>
        Could not retrive the listings
       </AppText>
      <AppButton title="Retry" onPress={() => loadListings()} />
    </> */}
      {/* } */}
      <ActivityIndicator visible={loading} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={sensorData}
        keyExtractor={data => data.key}
        renderItem={({ item }) => {
          return (
            (!item.temperature && !item.moisture && !item.humidity) ? null :
              (
                <Card
                  temperature={item.temperature == "0" || item.temperature ? `Temperature :${item.temperature}°C` : ""}
                  moisture={item.moisture == "0" || item.moisture ? `Moisture :${item.moisture} g/m³` : ""}
                  humidity={item.humidity == "0" || item.humidity ? `Humidity :${item.humidity} RH` : ""}
                // imageUri={item.images[0]}
                // thumbnailUrl={item.images[0]}
                />
              ))
        }}
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true)
          dispatch(getSensorData())
          setRefreshing(false)
        }}
      />
    </Screen>);
}

const styles = StyleSheet.create({
  screen: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: colors.light
  }
});
