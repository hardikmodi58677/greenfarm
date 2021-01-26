import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, FlatList } from "react-native";
import MessageCard from "../components/messageCard";
import Screen from "../components/Screen";
import ListItemSeparator from "../components/ListItemSeparator";
import ListItemDeleteAction from "../ListItemDeleteAction";
import { getUserMessages } from "../actions/user"
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";


const initialMessages = [
  {
    id: 1,
    title: "T1",
    description: "D1",
    image: require("../assets/images/userImage.jpg"),
  },
  {
    id: 2,
    title: "T2",
    description: "D2",
    image: require("../assets/images/userImage.jpg"),
  },
  {
    id: 3,
    title: "T3",
    description: "D3",
    image: require("../assets/images/userImage.jpg"),
  },
];

function MessagesScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [messages, setMessages] = useState(initialMessages)
  const [loading, setLoading] = useState(false)


  const dispatch = useDispatch()
  const userState = useSelector(state => state.user)
  const { resMessage = "", resStatus, messages: userMessages } = userState
  const prevProps = useRef({ resMessage, userMessages }).current


  useEffect(() => {
    setLoading(true)
    dispatch(getUserMessages())
  }, [])

  useEffect(() => {
    if (prevProps.resMessage !== resMessage) {
      if (resMessage) {
        if (!resMessage) {
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
      console.log("userMessages", userMessages)
      if (userMessages && userMessages.length) {
        setMessages(userMessages)
        setLoading(false)
      }
    }
    return () => {
      prevProps.userMessages = userMessages
    }
  }, [userMessages])

  // const handleDelete = (message) => {
  //   setMessages(messages.filter((m) => m.id !== message.id));
  // };

  return (
    <Screen>
      <FlatList
        data={messages}
        keyExtractor={(message) => message.key}
        renderItem={({ item }) => {
          console.log("item", item)
          return (
            <MessageCard
              from={item.from}
              title={item.title}
              subTitle={item.description}
              image={item.image}
              onPress={() => alert(item.description)}
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
  );
}

const styles = StyleSheet.create({});
export default MessagesScreen;
