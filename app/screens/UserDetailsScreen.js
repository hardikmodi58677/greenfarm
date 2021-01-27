import React, { useState, useRef, Fragment } from "react";
import * as Yup from "yup";
import { StyleSheet, Image, Modal, StatusBar, ScrollView, View, Text, Switch } from "react-native";
import LottieView from "lottie-react-native"
import Screen from "../components/Screen";
import { AppForm, SubmitButton, AppFormField } from "../components/forms"
import { useDispatch, useSelector } from "react-redux";
import { updateUser, clearMessage, updateUserStatus, deleteUser, getUsersList, sendMessage } from "../actions/admin"
import { useEffect } from "react";
import { showMessage } from "react-native-flash-message";
import routes from "../navigation/routes";
import colors from "../config/colors";
import AppButton from "../components/AppButton";

function UserDetailsScreen({ route, navigation }) {
  const { user } = route.params

  const dispatch = useDispatch()
  const adminState = useSelector(state => state.admin)
  const authState = useSelector(state => state.auth)
  const { role, key, username, email } = authState.user
  const { resMessage, resStatus, isDeleted } = adminState

  const prevProps = useRef({ resMessage }).current

  const phoneRegExp = /^[6-9]\d{9}$/
  const validationSchema = Yup.object().shape({
    username: Yup.string().required().label("Name"),
    email: Yup.string().required().email().label("Email"),
    phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required().label("Phone number"),
  });

  const messageValidationSchema = Yup.object().shape({
    title: Yup.string().required().label("Tfitle").min(8),
    description: Yup.string().required().label("Description").min(14),
  });

  // const [errMessage, setErrMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [isActive, setIsActive] = useState(user.isActive == undefined ? true : user.isActive)
  const [modalVisible, setModalVisible] = useState(false);


  const toggleUserStatus = (userKey) => {
    setIsActive(!isActive)
    dispatch(updateUserStatus(userKey, !isActive))
  }

  useEffect(() => {
    if (prevProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          showMessage({ message: resMessage, floating: true, type: "success", duration: 1000 })
          if (modalVisible) {
            setModalVisible(false)
          }
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
    <Fragment >
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
              dispatch(updateUser({ key: user.key, username, email, phoneNumber, }))
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
            {
              (role == "admin" && user.email!==email) && (
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
              )
            }
            <SubmitButton style={styles.submitBtn} title="Update details" />
          </AppForm>
          {(role == "admin" && user.email!==email) && (
            <View style={styles.btnContainer}>
              <AppButton style={styles.deleteBtn} title="Delete" onPress={() => dispatch(deleteUser(user.key))} />
              <AppButton style={{ ...styles.deleteBtn, backgroundColor: colors.primary }} title="Message" onPress={() => setModalVisible(!modalVisible)} />
            </View>
          )}
        </ScrollView>
      </Screen >
      {
        role == "admin" && (
          <Fragment>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(!modalVisible)}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <AppForm
                    initialValues={{ title: "", description: "" }}
                    onSubmit={async ({ title, description }) => {
                      setLoading(true)
                      dispatch(sendMessage({ senderId: key, senderName: role == "user" ? username : role, receiverId: user.key, title, description, isReply: false }))
                    }}
                    validationSchema={messageValidationSchema}
                  >
                    <AppFormField
                      name="title"
                      placeholder="Title"
                      iconName="format-title"
                      keyboardType="default" //Only for ios
                    />
                    <AppFormField
                      maxLength={150}
                      multiline
                      name="description"
                      numberOfLines={4}
                      placeholder="Description"
                      iconName="message"
                      keyboardType="default" //Only for ios
                    />
                    <View style={styles.buttonContainer}>
                      <SubmitButton title="Send" style={styles.buttonStyle} />
                      <AppButton title="Cancel" onPress={() => setModalVisible(!modalVisible)} style={{ ...styles.buttonStyle, backgroundColor: colors.danger }} />
                    </View>
                  </AppForm>
                </View>
              </View>
            </Modal>
          </Fragment>
        )
      }
    </Fragment>);
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
    backgroundColor: colors.danger,
    padding: 10,
    width: "48%"
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
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  modalView: {
    margin: 25,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floatingBtn: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    position: 'absolute',
    bottom: 10,
    right: 10,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 100,
  },
  buttonContainer: {
    display: "flex",
    width: "90%",
    justifyContent: "space-evenly",
    flexDirection: "row"
  },
  buttonStyle: {
    width: "50%",
    margin: 20,
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 10,
    elevation: 7,
  },
});

export default UserDetailsScreen;
