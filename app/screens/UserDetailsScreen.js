import React, { useState, useRef, Fragment } from "react";
import * as Yup from "yup";
import { StyleSheet, Image, Modal, StatusBar, ScrollView, View, Text, Switch } from "react-native";
import LottieView from "lottie-react-native"
import Screen from "../components/Screen";
import { AppForm, SubmitButton, AppFormField } from "../components/forms"
import AppModal from "../components/AppModal"
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile, clearResMessage, updateUserStatus, deleteUser, sendMessage } from "../actions/admin"
import { useEffect } from "react";
import { showMessage } from "react-native-flash-message";
import routes from "../navigation/routes";
import colors from "../config/colors";
import AppButton from "../components/AppButton";
import { clearMessage } from "../actions/auth";

function UserDetailsScreen({ route, navigation }) {
  const { currentUser } = route.params
  const dispatch = useDispatch()
  const userState = useSelector(state => state.admin)
  const authState = useSelector(state => state.auth)
  const { resMessage: authResMessage, resStatus: authResState } = authState
  const { eRole: userRole, sKey: userKey, sUsername: username, sEmail: userEmail } = authState.user
  const { resMessage, resStatus, isDeleted } = userState

  const prevProps = useRef({ resMessage, authResMessage }).current

  const phoneRegExp = /^[6-9]\d{9}$/
  const validationSchema = Yup.object().shape({
    sUsername: Yup.string().required().label("Name"),
    sEmail: Yup.string().required().email().label("Email"),
    sPhone: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required().label("Phone number"),
    sSoil: Yup.string()
  });

  const messageValidationSchema = Yup.object().shape({
    title: Yup.string().required().label("Title").max(15),
    description: Yup.string().required().label("Description").max(30),
  });

  const [loading, setLoading] = useState(false)
  const [isActive, setIsActive] = useState(currentUser?.bIsActive == undefined ? true : !!currentUser?.bIsActive)
  const [modalVisible, setModalVisible] = useState(false);


  const toggleUserStatus = (userKey) => {
    setIsActive(!isActive)
    dispatch(updateUserStatus(userKey, !isActive))
  }


  useEffect(() => {
    if (prevProps.authResMessage !== authResMessage) {
      if (authResMessage) {
        if (authResState) {
          showMessage({ message: authResMessage, floating: true, type: "success", duration: 1000 })
          if (modalVisible) {
            setModalVisible(false)
          }
          setLoading(false)
          dispatch(clearMessage())
        }
        else {
          setLoading(false)
          showMessage({ message: authResMessage, duration: 2000, type: "danger" })
          dispatch(clearMessage())
        }
      }
    }
    return () => {
      prevProps.authResMessage = authResMessage
    }

  }, [authResMessage, authResState])

  useEffect(() => {
    if (prevProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          showMessage({ message: resMessage, floating: true, type: "success", duration: 1000 })
          if (modalVisible) {
            setModalVisible(false)
          }
          if (isDeleted) { navigation.navigate(routes.USER_LIST) }
          setLoading(false)
          dispatch(clearResMessage())
        }
        else {
          setLoading(false)
          showMessage({ message: resMessage, duration: 2000, type: "danger" })
          dispatch(clearResMessage())
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
            initialValues={{ sUsername: currentUser.sUsername, sEmail: currentUser.sEmail, sPhone: currentUser.sPhone, sSoil: currentUser.sSoil || "" }}
            onSubmit={async ({ sUsername, sEmail, sPhone, sSoil }) => {
              setLoading(true)
              dispatch(updateUserProfile({ sKey: currentUser.sKey, sUsername, sEmail, sPhone, sSoil, type: userEmail !== sEmail ? "admin" : "user" }))
            }}
            validationSchema={validationSchema}
          >
            <AppFormField
              name="sEmail"
              placeholder="Email"
              editable={false}
              iconName="email"
            />
            <AppFormField
              name="sUsername"
              placeholder="Username"
              autoCapitalize="none"
              autoCorrect={false}
              iconName="account"
              keyboardType="email-address" //Only for ios
            />

            <AppFormField
              name="sPhone"
              placeholder="Phone Number"
              iconName="phone"
              keyboardType="number-pad"
              textContent="telephoneNumber" //Only for ios
            />

            {currentUser.eRole == "user"  && (
              <AppFormField
                name="sSoil"
                placeholder="Soil Type"
                
                iconName="dots-horizontal-circle-outline"
                keyboardType="default"
              />
            )}

            {
              (userRole == "admin" && currentUser.sEmail !== userEmail) && (
                <View style={styles.switch}>
                  <Text >{`User Status`} </Text>
                  <Switch
                    trackColor={{ false: colors.medium, true: colors.secondary }}
                    thumbColor={isActive ? colors.secondary : colors.danger}
                    onValueChange={() => toggleUserStatus(currentUser.sKey, isActive)}
                    value={isActive}
                  />
                  <Text >{isActive ? "Active" : "Inactive"} </Text>
                </View>
              )
            }
            <SubmitButton style={styles.submitBtn} title="Update details" />
          </AppForm>
          {(userRole == "admin" && currentUser.sEmail !== userEmail) && (
            <View style={styles.btnContainer}>
              <AppButton style={styles.deleteBtn} title="Delete" onPress={() => dispatch(deleteUser(currentUser.sKey))} />
              <AppButton style={{ ...styles.deleteBtn, backgroundColor: colors.secondary }} title="Message" onPress={() => setModalVisible(!modalVisible)} />
            </View>
          )}
        </ScrollView>
      </Screen >
      {
        userRole == "admin" && (
          <AppModal
            visible={modalVisible}
            setIsVisible={setModalVisible}
            validationSchema={messageValidationSchema}
            formFields={[
              {
                name: "title",
                placeholder: "Title",
                iconName: "format-title",
              },
              {
                multiline: true,
                name: "description",
                numberOfLines: 3,
                placeholder: "Description",
                iconName: "message"
              }
            ]}
            buttons={{ btn1: { title: "Send", style: {} }, btn2: { title: "Cancel", style: {} } }}
            onSubmit={(fields) => {
              setLoading(true)
              dispatch(sendMessage({ ...fields, senderId: userKey, senderName: userRole == "user" ? username : userRole, receiverId: currentUser.sKey, isReply: false, type: "message" }))
            }}
          />

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
  submitBtn: { backgroundColor: colors.primary },
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
