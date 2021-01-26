import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Screen from "../components/Screen";
import ListItem from "../components/ListItem";
import colors from "../config/colors";
import Icon from "../components/Icon";
import { logoutUser } from "../actions/auth"
import { useDispatch, useSelector } from "react-redux";
import { showMessage, clearMessage } from "react-native-flash-message";


export default function AccountScreen({ navigation }) {

  const dispatch = useDispatch()
  const authState = useSelector(state => state.auth)
  const { resMessage = "", resStatus, user } = authState
  const prevProps = useRef({ resMessage }).current





  useEffect(() => {
    if (prevProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          showMessage({ message: resMessage, floating: true, type: "success", duration: 1500 })
          setLoading(false)
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

  // const menuItems = [
  //   {
  //     title: "My Messages",
  //     icon: {
  //       name: "email",
  //       backgroundColor: colors.secondary,
  //     },
  //     targetScreen: routes.MESSAGES
  //   },
  // ];


  return (
    <Screen style={styles.screen}>
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
        {/* <FlatList
          data={menuItems}
          ItemSeparatorComponent={ListItemSeparator}
          keyExtractor={(item) => item.title.toString()}
          renderItem={({ item }) => {
            return (
              <ListItem
                title={item.title}
                IconComponent={
                  <Icon
                    name={item.icon.name}
                    backgroundColor={item.icon.backgroundColor}
                  />
                }
                onPress={() => navigation.navigate(item.targetScreen)}
              />
            );
          }}
        /> */}
      </View>
      <View style={styles.container}>
        <ListItem
          title="Logout"
          onPress={() => dispatch(logoutUser())}
          IconComponent={<Icon name="logout" backgroundColor={colors.primary} />}
        />
      </View>
    </Screen>
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
});
