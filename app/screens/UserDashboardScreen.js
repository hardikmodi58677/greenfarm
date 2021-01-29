import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, FlatList, Modal } from "react-native";
import Screen from "../components/Screen";
import Card from "../components/Card";
import colors from "../config/colors";
import { useDispatch, useSelector } from "react-redux";
import { getSensorData, clearResMessage } from "../actions/admin"
import { showMessage } from "react-native-flash-message";
import LottieView from "lottie-react-native"
import ErrorMessage from "../components/forms/ErrorMessage";


export default function UserDashboard({ navigation }) {
  const [list, setList] = useState([])
  const [errorMessage, setErrorMessage] = useState(false)
  const [loading, setLoading] = useState(false)

  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch()
  const userState = useSelector(state => state.admin)
  const { resMessage = "", resStatus, sensorDataList } = userState
  const prevProps = useRef({ resMessage, sensorDataList }).current


  useEffect(() => {
    setLoading(true)
    dispatch(getSensorData())
  }, [])

  useEffect(() => {
    if (prevProps.sensorDataList !== sensorDataList) {
      if (sensorDataList && sensorDataList.length) {
        setList(sensorDataList)
        setErrorMessage("")
        setLoading(false)
        dispatch(clearResMessage())
      }
      else {
        setList([])
        setLoading(false)
        setErrorMessage("Sensor data not available.")
      }
    }
    return () => {
      prevProps.sensorDataList = sensorDataList
    }
  }, [sensorDataList])


  useEffect(() => {
    if (prevProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          showMessage({ message: resMessage, floating: true, type: "success", duration: 1000 })
          setLoading(false)
          dispatch(clearResMessage())
        }
        else {
          setLoading(false)
          showMessage({ message: resMessage, duration: 2000, type: "danger" })
        }
      }
    }
    return () => {
      prevProps.resMessage = resMessage
    }
  }, [resMessage, resStatus])

  return (
    <Screen style={styles.screen}>
      {!!errorMessage && <ErrorMessage error={errorMessage} />}
      {
        loading && (
          <Modal visible={loading} style={styles.modal} transparent>
            <LottieView
              loop={true}
              autoPlay
              source={require("../assets/animations/loader.json")}
            />
          </Modal>
        )
      }
      <FlatList
        showsVerticalScrollIndicator={false}
        data={list}
        keyExtractor={data => data.sKey}
        renderItem={({ item }) => {
          return (
            (!item.temperature && !item.moisture && !item.humidity) ? null :
              (
                <Card
                  temperature={item.temperature == "0" || item.temperature ? `Temperature :${item.temperature}°C` : ""}
                  moisture={item.moisture == "0" || item.moisture ? `Moisture :${item.moisture} g/m³` : ""}
                  humidity={item.humidity == "0" || item.humidity ? `Humidity :${item.humidity} RH` : ""}
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
