import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyB0UjMIuuRdASr2fVvUvVbnKlV54CfuHGM",
    authDomain: "greenfarm-bfa9d.firebaseapp.com",
    databaseURL: "https://greenfarm-bfa9d-default-rtdb.firebaseio.com",
    projectId: "greenfarm-bfa9d",
    storageBucket: "greenfarm-bfa9d.appspot.com",
    messagingSenderId: "261744891855",
    appId: "1:261744891855:web:8d29a922a76918ca43e4ba",
    measurementId: "G-QB0E30C0HY"
};
firebase.initializeApp(firebaseConfig);


export default {
    config: firebaseConfig,
    firebase,
}
