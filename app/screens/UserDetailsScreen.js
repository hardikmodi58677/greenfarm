import React, { useState, useRef } from "react";
import * as Yup from "yup";
import { StyleSheet, Image, Modal, StatusBar, ScrollView, View, Text, Switch } from "react-native";
import LottieView from "lottie-react-native"
import Screen from "../components/Screen";
import { AppForm, SubmitButton, AppFormField } from "../components/forms"
import { useDispatch, useSelector } from "react-redux";
import { updateUser, clearMessage, updateUserStatus, deleteUser, getUsersList } from "../actions/admin"
import { useEffect } from "react";
import { showMessage } from "react-native-flash-message";
import routes from "../navigation/routes";

import colors from "../config/colors";
import AppButton from "../components/AppButton";

function UserDetailsScreen({ route, navigation }) {
  const { user } = route.params


  const dispatch = useDispatch()
  const adminState = useSelector(state => state.admin)
  const { resMessage, resStatus, isDeleted } = adminState

  const prevProps = useRef({ resMessage }).current

  const phoneRegExp = /^[6-9]\d{9}$/
  const validationSchema = Yup.object().shape({
    username: Yup.string().required().label("Name"),
    email: Yup.string().required().email().label("Email"),
    phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required().label("Phone number")
  });

  // const [errMessage, setErrMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [isActive, setIsActive] = useState(user.isActive == undefined ? true : user.isActive)

  const toggleUserStatus = (userKey) => {
    setIsActive(!isActive)
    dispatch(updateUserStatus(userKey, !isActive))
  }

  useEffect(() => {
    if (prevProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          showMessage({ message: resMessage, floating: true, type: "success", duration: 1000 })
          setLoading(false)
          if (isDeleted) {
            navigation.navigate(routes.USER_LIST)

          }
          dispatch(clearMessage())
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
    <Screen style={styles.container}>
      <ScrollView vertical >
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

        <Image style={styles.logo} source={require("../assets/images/userImage.jpg")} />


        <AppForm
          initialValues={{ username: user.username, email: user.email, phoneNumber: user.phoneNumber }}
          onSubmit={async ({ username, email, phoneNumber }) => {
            setLoading(true)
            dispatch(updateUser({ key: user.key, username, email, phoneNumber }))
          }}
          validationSchema={validationSchema}
        >

          <AppFormField
            name="email"
            placeholder="Email"
            editable={false}
            iconName="email"
          />
          <AppFormField
            name="username"
            placeholder="Username"
            autoCapitalize="none"
            autoCorrect={false}
            iconName="account"
            keyboardType="email-address" //Only for ios
          />

          <AppFormField
            name="phoneNumber"
            placeholder="Phone Number"
            iconName="phone"
            keyboardType="number-pad"
            textContent="telephoneNumber" //Only for ios
          />

          <View style={styles.switch}>
            <Text >{`User Status`} </Text>
            <Switch
              trackColor={{ false: colors.medium, true: colors.secondary }}
              thumbColor={isActive ? colors.secondary : colors.danger}
              onValueChange={() => toggleUserStatus(user.key, isActive)}
              value={isActive}
            />
            <Text >{isActive ? "Active" : "Inactive"} </Text>
          </View>
          <SubmitButton style={styles.submitBtn} title="Update details" />
        </AppForm>
        <AppButton style={styles.deleteBtn} title="Delete" onPress={() => dispatch(deleteUser(user.key))} />


      </ScrollView>
    </Screen >
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: "center",
    marginBottom: 20,
  },
  switch: {
    fontWeight: "bold",
    alignItems: "center",
    display: "flex",
    flexDirection: "row"
  },
  btnContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between"
  },
  submitBtn: { backgroundColor: colors.secondary },
  deleteBtn: {
    backgroundColor: colors.danger
  },
  modal: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    width: 200
  },
  container: {
    padding: 18,
    marginTop: StatusBar.currentHeight
  },
  detailsContainer: {
    padding: 20,
  },
  price: {
    color: colors.secondary,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 7,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
  },
  userContainer: {
    marginVertical: 30
  }
});

export default UserDetailsScreen;
