import { createStackNavigator } from "@react-navigation/stack"
import React from 'react'
import LoginScreen from "../screens/LoginScreen"
// import GetStartedScreen from "../screens/GetStartedScreen"
import RegisterScreen from "../screens/RegisterScreen"
import WelcomeScreen from "../screens/WelcomeScreen"
import routes from "./routes"

const Stack = createStackNavigator()
const AuthNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name={routes.WELCOME} component={WelcomeScreen} options={{ headerShown: false }} />
        {/* <Stack.Screen name={routes.GET_STARTED} component={GetStartedScreen} options={{ headerShown: false }} /> */}
        <Stack.Screen name={routes.LOGIN} component={LoginScreen} />
        <Stack.Screen name={routes.REGISTER} component={RegisterScreen} />
    </Stack.Navigator>
)

export default AuthNavigator