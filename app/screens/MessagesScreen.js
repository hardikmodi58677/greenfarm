import React, { Fragment, useEffect, useRef, useState, } from "react";
import { StyleSheet, FlatList, Modal, View, StatusBar, Alert, Switch, Text, TouchableHighlight } from "react-native";
import { AppForm, SubmitButton, AppFormField } from "../components/forms"
import MessageCard from "../components/messageCard";
import AppButton from "../components/AppButton";
import LottieView from "lottie-react-native"
import Screen from "../components/Screen";
import ListItemSeparator from "../components/ListItemSeparator";
import { getUserMessages, sendMessage, clearMessage } from "../actions/user"
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import ErrorMessage from "../components/forms/ErrorMessage";
import colors from "../config/colors";
import ListItemReplyAction from "../ListItemReplyAction"
import * as Yup from "yup";
import { MaterialCommunityIcons } from "@expo/vector-icons";



function MessagesScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [messages, setMessages] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [messageReceiver, setMessageReceiver] = useState("Admin")


  const dispatch = useDispatch()
  const { user: currentUser } = useSelector(state => state.auth)
  const userState = useSelector(state => state.user)
  const { resMessage = "", resStatus, messages: userMessages } = userState
  const prevProps = useRef({ resMessage, userMessages }).current

  const messageValidationSchema = Yup.object().shape({
    title: Yup.string().required().label("Tfitle").min(5).max(10),
    description: Yup.string().required().label("Description").min(10).max(20),
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [receiverId, setReceiverId] = useState(null);
  const [isReply, setIsReply] = useState(false)



  useEffect(() => {
    setLoading(true)
    dispatch(getUserMessages())
  }, [])

  const handleReply = (message) => {
    setModalVisible(!modalVisible)
    setIsReply(true)
    setReceiverId(message.senderId || null)
  }

  const toggleMessageReceiver = () => {
    setMessageReceiver(msgReceiver => msgReceiver == "Admin" ? "Expert" : "Admin")
    // dispatch(updateUserStatus(userKey, !isActive))
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
          dispatch(clearMessage())
          dispatch(getUserMessages())
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

  useEffect(() => {
    if (prevProps.userMessages !== userMessages) {
      setLoading(false)
      if (userMessages && userMessages.length) {
        setErrorMessage("")
        setMessages(userMessages)
      }
      else {
        setMessages([])
        setErrorMessage("No messages yet.")
      }
    }
    return () => {
      prevProps.userMessages = userMessages
    }
  }, [userMessages])

  return (
    <Fragment>
      <Screen>
        {!!errorMessage && <ErrorMessage style={styles.errorText} error={errorMessage} />}
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
          scrollEnabled
          data={messages}
          keyExtractor={(message) => message.key}
          renderItem={({ item }) => {
            return (
              <MessageCard
                from={item.senderName}
                title={item.title}
                subTitle={item.description}
                image={item.image}
                onPress={() => Alert.alert(item.title, item.description)}
                renderRightActions={() => (<ListItemReplyAction onPress={() => handleReply(item)} />)}
              />
            );
          }}
          ItemSeparatorComponent={ListItemSeparator}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true)
            dispatch(getUserMessages())
            setRefreshing(false)

          }}
        />
      </Screen>
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
                  dispatch(sendMessage({ senderId: currentUser.key, senderName: currentUser.role == "user" ? currentUser.username : currentUser.role, receiverId, title, description, isReply, receiver: messageReceiver }))
                  setReceiverId(null)
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
                {!isReply && currentUser.role == "user" && (
                  <View style={styles.switch}>
                    <Text >{`Send Message to`} </Text>
                    <Switch
                      trackColor={{ false: colors.primary, true: colors.secondary }}
                      thumbColor={messageReceiver == "Admin" ? colors.secondary : colors.primary}
                      onValueChange={() => toggleMessageReceiver()}
                      value={messageReceiver == "Admin"}
                    />
                    <Text >{messageReceiver == "Admin" ? "Admin" : "Expert"} </Text>
                  </View>
                )}
                <View style={styles.buttonContainer}>
                  <SubmitButton title="Send" style={styles.buttonStyle} />
                  <AppButton title="Cancel" onPress={() => setModalVisible(!modalVisible)} style={{ ...styles.buttonStyle, backgroundColor: colors.danger }} />
                </View>
              </AppForm>
            </View>
          </View>
        </Modal>
      </Fragment>
      {
        currentUser.role === "user" && (
          <TouchableHighlight
            style={styles.floatingBtn}
            onPress={() => { setModalVisible(true); setIsReply(false) }}>
            <MaterialCommunityIcons name="plus" size={40} />
          </TouchableHighlight>
        )
      }
    </Fragment>
  );
}

const styles = StyleSheet.create({
  errorText: {
    fontSize: 25,
    color: colors.danger,
  },
  switch: {
    fontWeight: "bold",
    alignItems: "center",
    display: "flex",
    flexDirection: "row"
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
export default MessagesScreen;
