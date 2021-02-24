import { createStackNavigator } from "@react-navigation/stack"
import React from 'react'
import AccountScreen from "../screens/AccountScreen"
import ContactExpert from "../screens/ContactExpertScreen"
import MessagesScreen from "../screens/MessagesScreen"
import UserDetailsScreen from "../screens/UserDetailsScreen"
import routes from "./routes"

const Stack = createStackNavigator()
const AccountNavigator = () => (
    <Stack.Navigator headerMode="none" >
        <Stack.Screen name={routes.ACCOUNT} component={AccountScreen} />
        <Stack.Screen name={routes.MESSAGES} component={MessagesScreen} />
        <Stack.Screen name={routes.USER_DETAILS} component={UserDetailsScreen} />
        <Stack.Screen name={routes.CONTACT_EXPERT} component={ContactExpert} />
    </Stack.Navigator>
)

export default AccountNavigator