import React, { Fragment, useEffect, useRef, useState, } from "react";
import { StyleSheet, FlatList, Modal, Alert, Text } from "react-native";
import MessageCard from "../components/messageCard";
import LottieView from "lottie-react-native"
import Screen from "../components/Screen";
import ListItemSeparator from "../components/ListItemSeparator";
import { getFeedbackList, deleteFeedback, clearResMessage } from "../actions/admin"
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import ErrorMessage from "../components/forms/ErrorMessage";
import colors from "../config/colors";
import ListItemDeleteAction from "../ListItemDeleteAction";



function FeedbackScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")


  const dispatch = useDispatch()
  const adminState = useSelector(state => state.admin)
  const { resMessage = "", resStatus, feedbackList } = adminState
  const prevProps = useRef({ resMessage, feedbackList }).current


  useEffect(() => {
    setLoading(true)
    dispatch(getFeedbackList())
  }, [])

  const handleDelete = (feedback) => {
    setLoading(true)
    dispatch(deleteFeedback(feedback.sKey))
  }



  useEffect(() => {
    if (prevProps.feedbackList !== feedbackList) {
      if (feedbackList && feedbackList.length) {
        setList(feedbackList)
        setErrorMessage("")
        setLoading(false)
        dispatch(clearResMessage())
      }
      else {
        setList([])
        setErrorMessage("No feedback data available")
        setLoading(false)
      }
    }
    return () => {
      prevProps.feedbackList = feedbackList
    }
  }, [feedbackList])


  useEffect(() => {
    if (prevProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          showMessage({ message: resMessage, floating: true, type: "success", duration: 1000 })
          dispatch(clearResMessage())
          dispatch(getFeedbackList())
        }
        else {
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
        {!!errorMessage && <ErrorMessage error={`No feeedback available.`} />}
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
          keyExtractor={(feedback) => feedback.sKey}
          renderItem={({ item: feedback }) => {
            return (
              <MessageCard
                from={feedback.sSenderName}
                title={feedback.sTitle}
                subTitle={feedback.sDescription}
                onPress={() => Alert.alert(feedback.sTitle, feedback.sDescription)}
                renderLeftActions={() => (<ListItemDeleteAction onPress={() => {
                  handleDelete(feedback)
                  this.close()
                }} />)}
              />
            );
          }}
          ItemSeparatorComponent={ListItemSeparator}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true)
            dispatch(getFeedbackList())
            setRefreshing(false)

          }}
        />
      </Screen>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  screen: {
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
export default FeedbackScreen;
