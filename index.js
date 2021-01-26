import App from "./App"
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from "./app/reducers"
import OfflineNotice from "./app/components/offlineNotice";



const store = configureStore()

const Main = () => (
    <Provider store={store}>
        <OfflineNotice />
        <App />
    </Provider>
)

export default Main