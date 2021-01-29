import { applyMiddleware, combineReducers, createStore } from "redux"
import thunk from "redux-thunk"
import authReducer from "./auth"
import userReducer from "./user"
import adminReducer from "./admin"

const rootReducer = combineReducers({
    auth: authReducer,
    admin: adminReducer
})


const configureStore = () => createStore(rootReducer, applyMiddleware(thunk));


export default configureStore;