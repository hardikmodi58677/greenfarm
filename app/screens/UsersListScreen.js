import React, { Fragment, useEffect, useRef, useState } from "react";
import { StyleSheet, FlatList, Modal } from "react-native";
import Screen from "../components/Screen";
import UserCard from "../components/UserCard";
import colors from "../config/colors";
import LottieView from "lottie-react-native"
import { useDispatch, useSelector } from "react-redux";
import { getUsersList } from "../actions/admin"
import { showMessage } from "react-native-flash-message";
import routes from "../navigation/routes";


export default function UsersListScreen({ navigation }) {
  const [usersList, setUsersList] = useState([])
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch()
  const adminState = useSelector(state => state.admin)
  const { resMessage = "", resStatus, users } = adminState
  const prevProps = useRef({ resMessage, users }).current

  useEffect(() => {
    setLoading(true)
    dispatch(getUsersList())
  }, [])

  useEffect(() => {
    if (prevProps.users !== users) {
      if (users && users.length)
        setUsersList(users)
      setLoading(false)
    }
    return () => {
      prevProps.users = users
    }
  }, [users])

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
        data={usersList}
        keyExtractor={data => data.key}
        renderItem={({ item }) => {
          return (
            <UserCard
              image={item.image}
              username={item.username}
              email={item.email}
              phoneNumber={item.phoneNumber}
              onPress={() => navigation.navigate(routes.USER_DETAILS, { user: item })
              }
            />
          )
        }}
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true)
          dispatch(getUsersList())
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
