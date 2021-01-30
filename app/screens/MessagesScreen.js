import React, { Fragment, useEffect, useRef, useState, } from "react";
import { StyleSheet, FlatList, Modal, View, StatusBar, Alert, Switch, Text, TouchableHighlight } from "react-native";
import MessageCard from "../components/messageCard";
import LottieView from "lottie-react-native"
import Screen from "../components/Screen";
import ListItemSeparator from "../components/ListItemSeparator";
import { getMessageList, sendMessage, clearResMessage } from "../actions/admin"
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import ErrorMessage from "../components/forms/ErrorMessage";
import colors from "../config/colors";
import ListItemReplyAction from "../ListItemReplyAction"
import * as Yup from "yup";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppModal from "../components/AppModal";



function MessagesScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [list, setList] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [messageReceiver, setMessageReceiver] = useState("Admin")


  const dispatch = useDispatch()
  const { user: currentUser } = useSelector(state => state.auth)
  const userState = useSelector(state => state.admin)
  const { resMessage = "", resStatus, messageList } = userState
  const prevProps = useRef({ resMessage, messageList }).current

  const messageValidationSchema = Yup.object().shape({
    title: Yup.string().required().label("Title").max(15),
    description: Yup.string().required().label("Description").max(40),
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [receiverId, setReceiverId] = useState(null);
  const [isReply, setIsReply] = useState(false)



  useEffect(() => {
    setLoading(true)
    dispatch(getMessageList())
  }, [])

  const handleReply = (message) => {
    setModalVisible(!modalVisible)
    setIsReply(true)
    setReceiverId(message.sSenderId || null)
  }

  const toggleMessageReceiver = () => {
    setMessageReceiver(msgReceiver => msgReceiver == "Admin" ? "Expert" : "Admin")
  }


  useEffect(() => {
    if (prevProps.messageList !== messageList) {
      if (messageList && messageList.length) {
        setList(messageList)
        setErrorMessage("")
        setLoading(false)
      }
      else {
        setLoading(false)
        setErrorMessage("No messages available.")
      }
    }
    return () => {
      prevProps.messageList = messageList
    }
  }, [messageList])

  useEffect(() => {
    if (prevProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          showMessage({ message: resMessage, floating: true, type: "success", duration: 1000 })
          if (modalVisible) {
            setModalVisible(false)
          }
          setLoading(false)
          dispatch(clearResMessage())
          dispatch(getMessageList())
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
    <Fragment>
      <Screen style={styles.screen}>
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
          data={list}
          keyExtractor={(message) => message.sKey}
          renderItem={({ item: message }) => {
            return (
              <MessageCard
                from={message.sSenderName}
                title={message.sTitle}
                subTitle={message.sDescription}
                image={message.sImage}
                onPress={() => Alert.alert(message.sTitle, message.sDescription)}
                renderRightActions={() => (<ListItemReplyAction onPress={() => handleReply(message)} />)}
              />
            );
          }}
          ItemSeparatorComponent={ListItemSeparator}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true)
            dispatch(getMessageList())
            setRefreshing(false)

          }}
        />
      </Screen>
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
          dispatch(sendMessage({ ...fields, senderId: currentUser.sKey, senderName: currentUser.eRole == "user" ? currentUser.sUsername : currentUser.eRole, receiverId, isReply, receiver: currentUser.eRole == "user" && !isReply ? messageReceiver : null }))
          setReceiverId(null)
        }}
        renderSwitch={() => !isReply && currentUser.eRole == "user"
          ? (<View style={styles.switch}>
            <Text >{`Send Message to`} </Text>
            <Switch
              trackColor={{ false: colors.primary, true: colors.secondary }}
              thumbColor={messageReceiver == "Admin" ? colors.secondary : colors.primary}
              onValueChange={toggleMessageReceiver}
              value={messageReceiver == "Admin"}
            />
            <Text >{messageReceiver == "Admin" ? "Admin" : "Expert"} </Text>
          </View>
          )
          : null}
      />
      {
        currentUser.eRole === "user" && (
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
  screen: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: colors.light
  },
  switch: {
    fontWeight: "bold",
    alignItems: "center",
    display: "flex",
    flexDirection: "row"
  },
});
export default MessagesScreen;
