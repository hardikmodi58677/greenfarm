import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, FlatList, Modal, View, StatusBar, Text, } from "react-native";

import Screen from "../components/Screen";
import ListItem from "../components/ListItem";
import Icon from "../components/Icon";
import { logoutUser } from "../actions/auth"
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import { sendMessage, clearMessage } from "../actions/user"
import routes from "../navigation/routes";
import ListItemSeparator from "../components/ListItemSeparator"
import { AppForm, SubmitButton, AppFormField } from "../components/forms"
import AppButton from "../components/AppButton";
import LottieView from "lottie-react-native"
import colors from "../config/colors";
import * as Yup from "yup";


export default function AccountScreen({ navigation }) {

  const dispatch = useDispatch()
  const authState = useSelector(state => state.auth)
  const { user } = authState

  const userState = useSelector(state => state.user)
  const { resMessage = "", resStatus } = userState
  const prevProps = useRef({ resMessage }).current

  const messageValidationSchema = Yup.object().shape({
    title: Yup.string().required().label("Title").min(5).max(12),
    description: Yup.string().required().label("Feedback message").min(5)
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    if (prevProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          showMessage({ message: resMessage, floating: true, type: "success", duration: 1500 })
          setLoading(false)
          if(modalVisible){
            setModalVisible(false)
          }
          dispatch(clearMessage())
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

  const menuItems = [
    {
      title: "Feedback",
      icon: {
        name: "account-star",
        backgroundColor: colors.secondary,
      },
      onPress: () => setModalVisible(!modalVisible)
    },
    {
      title: "Update Profile",
      icon: {
        name: "face",
        backgroundColor: colors.primary,
      },
      onPress: () => navigation.navigate(routes.USER_DETAILS, { user })
    },
    {
      title: "Logout",
      icon: {
        name: "logout",
        backgroundColor: colors.danger,
      },
      onPress: () => dispatch(logoutUser())
    }
  ];

  return (
    <>
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
        <View style={styles.container}>
          <ListItem
            image=""
            icon="user"
            title={user.username}
            subTitle={user.email}
            image={require("../assets/images/userImage.jpg")}
            phoneNumber={user.phoneNumber}
          />
        </View>
        <View style={styles.container}>
          <FlatList
            data={menuItems}
            ItemSeparatorComponent={ListItemSeparator}
            keyExtractor={(item) => item.title.toString()}
            renderItem={({ item }) => {
              if (item.title == "Feedback" && user.role != "user") {
                return null
              }
              else {
                return (

                  <ListItem
                    title={item.title}
                    IconComponent={
                      <Icon
                        name={item.icon.name}
                        backgroundColor={item.icon.backgroundColor}
                      />
                    }
                    onPress={item.onPress}
                  />
                );
              }

            }}
          />
        </View>

      </Screen>
      <>
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
                  dispatch(sendMessage({ type: "feedback", title, description, senderId: user.key, senderName: user.role === "user" ? user.username : user.role }))
                }}
                validationSchema={messageValidationSchema}
              >
                <AppFormField
                  multiline
                  name="title"
                  placeholder="Title"
                  iconName="format-title"
                />
                <AppFormField
                  maxLength={150}
                  multiline
                  name="description"
                  numberOfLines={3}
                  placeholder="Feedback"
                  iconName="thought-bubble"
                />
                <View style={styles.buttonContainer}>
                  <SubmitButton title="Send" style={styles.buttonStyle} />
                  <AppButton title="Cancel" onPress={() => setModalVisible(!modalVisible)} style={{ ...styles.buttonStyle, backgroundColor: colors.danger }} />
                </View>
              </AppForm>
            </View>
          </View>
        </Modal>
      </>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
  },
  container: {
    marginVertical: 20,
    backgroundColor: colors.white,
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
