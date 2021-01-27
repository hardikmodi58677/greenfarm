import React, { Fragment, useEffect, useRef, useState, } from "react";
import { StyleSheet, FlatList, Modal, View, StatusBar, Alert, Switch, Text, TouchableHighlight } from "react-native";
import { AppForm, SubmitButton, AppFormField } from "../components/forms"
import MessageCard from "../components/messageCard";
import AppButton from "../components/AppButton";
import LottieView from "lottie-react-native"
import Screen from "../components/Screen";
import ListItemSeparator from "../components/ListItemSeparator";
import { getUserFeedbackData, deleteFeedback, clearMessage } from "../actions/admin"
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import ErrorMessage from "../components/forms/ErrorMessage";
import colors from "../config/colors";
import ListItemReplyAction from "../ListItemReplyAction"
import * as Yup from "yup";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ListItemDeleteAction from "../ListItemDeleteAction";



function FeedbackScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [feedbackList, setFeedbackList] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [messageReceiver, setMessageReceiver] = useState(null)


  const dispatch = useDispatch()
  const { user: currentUser } = useSelector(state => state.auth)
  const adminState = useSelector(state => state.admin)
  const { resMessage = "", resStatus, feedbackData } = adminState
  const prevProps = useRef({ resMessage, feedbackData }).current


  useEffect(() => {
    setLoading(true)
    dispatch(getUserFeedbackData())
  }, [])

  const handleDelete = (feedback) => {
    setLoading(true)
    dispatch(deleteFeedback(feedback.key))
  }


  useEffect(() => {
    if (prevProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          showMessage({ message: resMessage, floating: true, type: "success", duration: 1000 })
          setLoading(false)
          dispatch(clearMessage())
          dispatch(getUserFeedbackData())
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
    if (prevProps.feedbackData !== feedbackData) {
      setLoading(false)
      if (feedbackData && feedbackData.length) {
        setErrorMessage("")
        setFeedbackList(feedbackData)
      }
      else {
        setFeedbackList([])
        setErrorMessage("No feedbacks yet.")
      }
    }
    return () => {
      prevProps.feedbackData = feedbackData
    }
  }, [feedbackData])

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
          data={feedbackList}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => {
            return (
              <MessageCard
                from={item.senderName}
                title={item.title}
                subTitle={item.description}
                onPress={() => Alert.alert(item.title, item.description)}
                renderRightActions={() => (<ListItemDeleteAction onPress={() => handleDelete(item)} />)}
              />
            );
          }}
          ItemSeparatorComponent={ListItemSeparator}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true)
            dispatch(getUserFeedbackData())
            setRefreshing(false)

          }}
        />
      </Screen>
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

});
export default FeedbackScreen;
