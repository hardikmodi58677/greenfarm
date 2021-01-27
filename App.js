import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getUserLoginStatus } from './app/actions/auth';
import { NavigationContainer } from "@react-navigation/native"
import navigationTheme from './app/navigation/navigationTheme';
import AuthNavigator from './app/navigation/AuthNavigator';
import { LogBox } from 'react-native';
import FlashMessage from "react-native-flash-message";
import AppNavigator from "./app/navigation/AppNavigator"
import AppLoading from 'expo-app-loading';
LogBox.ignoreLogs(['Setting a timer'])

const App = () => {

  const { user, isReady } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUserLoginStatus())
  }, [])

  if (!isReady) {
    return (
      <AppLoading />
    )
  }
  else {
    return (
      <NavigationContainer theme={navigationTheme}>
        {
          user && user.role ? <AppNavigator role={user.role} /> : <AuthNavigator />
        }
        < FlashMessage position="top" autoHide />
      </NavigationContainer>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App