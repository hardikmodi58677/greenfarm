import AsyncStorage from '@react-native-community/async-storage';
import moment from "moment"
const prefix = "cache"
const expiryInMinutes = 120
const storeData = async (key, value) => {
    try {
        const item = {
            value,
            timestamp: Date.now()
        }
        await AsyncStorage.setItem(prefix + key, JSON.stringify(item))
    }
    catch (err) {
    }
}

const isExpired = (item) => {
    const now = moment(Date.now())
    const storedTime = moment(item.timestamp)
    const isExpired = now.diff(storedTime, 'minutes') > expiryInMinutes

    return isExpired
}

const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(prefix + key)
        const item = JSON.parse(value)
        if (!item) return null
        if (isExpired(item)) {
            await AsyncStorage.removeItem(prefix + key)
            return null
        }
        return item.value
    } catch (error) {
        return null
    }
}

const removeData = async key => {
    try {
        await AsyncStorage.removeItem(prefix + key)
        return null
    } catch (error) {
        return null
    }
}

export default {
    storeData,
    getData,
    removeData
}