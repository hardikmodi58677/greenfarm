import React from 'react'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import UserDashboard from "../screens/UserDashboardScreen"
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FontAwesome5 } from '@expo/vector-icons';
import routes from './routes'
import AccountNavigator from "./AccountNavigator"
import MessagesScreen from '../screens/MessagesScreen'
import FeedbackScreen from '../screens/FeedbackScreen'
import VideosScreen from "../screens/VideosScreen"
import UsersListScreen from "../screens/UsersListScreen"
import UserSectionNavigator from "../navigation/UsersNavigator"
import { MaterialIcons } from '@expo/vector-icons';


const Tab = createBottomTabNavigator()

const AppNavigator = ({ role }) => (
    <Tab.Navigator>

        {role == "admin" &&
            <>
                <Tab.Screen
                    name={routes.USER_LIST}
                    children={() => <UserSectionNavigator />}
                    options={{
                        tabBarIcon: ({ color, size }) => <FontAwesome5 name="users" color={color} size={size} />,

                    }}
                />
                <Tab.Screen
                    name={routes.USER_FEEDBACK}
                    children={() => <FeedbackScreen />}
                    options={{ tabBarIcon: ({ color, size }) => <MaterialIcons name="feedback" color={color} size={size} /> }}
                />
            </>
        }
        <Tab.Screen
            name={role == "admin" ? routes.SENSORS_DATA : routes.USER_DASHBOARD}
            children={() => <UserDashboard role={role} />}
            options={{ tabBarIcon: ({ color, size }) => <FontAwesome5 name="temperature-low" size={size} color={color} /> }}
        />

        <Tab.Screen
            name={routes.USER_VIDEOS}
            children={() => <VideosScreen role={role} />}
            options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="play" color={color} size={size} /> }}
        />
        <Tab.Screen
            name={routes.USER_MESSAGES}
            children={() => <MessagesScreen role={role} />}
            options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="message" color={color} size={size} /> }}
        />
        <Tab.Screen
            name={routes.USER_ACCOUNT}
            children={() => <AccountNavigator role={role} />}
            options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account" color={color} size={size} /> }}
        />
    </Tab.Navigator>


)

export default AppNavigator