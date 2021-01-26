import { createStackNavigator } from "@react-navigation/stack"
import React from 'react'
import userDetailsScreen from "../screens/UserDetailsScreen"
import UsersListScreen from "../screens/UsersListScreen"
import routes from "./routes"

const Stack = createStackNavigator()
const AccountNavigator = () => (
    <Stack.Navigator mode="modal" headerMode="none" >
        <Stack.Screen name={routes.USER_LIST} component={UsersListScreen} />
        <Stack.Screen name={routes.USER_DETAILS} component={userDetailsScreen} />
    </Stack.Navigator>
)

export default AccountNavigator