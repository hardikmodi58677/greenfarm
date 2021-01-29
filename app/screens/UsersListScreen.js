import React, {  useEffect, useRef, useState } from "react";
import { StyleSheet, FlatList, Modal } from "react-native";
import Screen from "../components/Screen";
import UserCard from "../components/UserCard";
import colors from "../config/colors";
import LottieView from "lottie-react-native"
import { useDispatch, useSelector } from "react-redux";
import { getUsersList,clearResMessage } from "../actions/admin"
import { showMessage } from "react-native-flash-message";
import routes from "../navigation/routes";
import { ErrorMessage } from "../components/forms";


export default function UsersListScreen({ navigation }) {
  const [list, setList] = useState(null)
  const [errorMessage, setErrorMessage] = useState(false)
  const [loading, setLoading] = useState(false)

  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch()
  const adminState = useSelector(state => state.admin)
  const { resMessage = "", resStatus, userList } = adminState
  const prevProps = useRef({ resMessage, userList }).current

  useEffect(() => {
    setLoading(true)
    dispatch(getUsersList())
  }, [])

  useEffect(() => {
    if (prevProps.userList !== userList) {
      if (userList?.length) {
        setList(userList)
        setErrorMessage("")
        setLoading(false)
      }
      else{
        setList([])
        setErrorMessage("No users available.")
        setLoading(false)
      }
      
    }
    return () => {
      prevProps.userList = userList
    }
  }, [userList])

  
  useEffect(() => {
    if (prevProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          showMessage({ message: resMessage, floating: true, type: "success", duration: 1000 })
          setLoading(false)
          dispatch(clearResMessage())
          dispatch(getUsersList())
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
        renderItem={({ item: user }) => {
          return (
            <UserCard
              image={user.sImage}
              username={user.sUsername}
              email={user.sEmail}
              phoneNumber={user.sPhone}
              onPress={() => navigation.navigate(routes.USER_DETAILS, { currentUser: user })
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
