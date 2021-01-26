import HMR from '@roxi/routify/hmr'
import App from './App.svelte';

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/performance";
import "firebase/analytics";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCy2CnRPSQisQO4JMIUXZs9PlwlPOvCjCA",
    authDomain: "megauno.firebaseapp.com",
    projectId: "megauno",
    storageBucket: "megauno.appspot.com",
    messagingSenderId: "559730893311",
    appId: "1:559730893311:web:8390c5674d6e1bbd9ac7ca",
    measurementId: "G-5GP74FY121",
};

firebase.initializeApp(firebaseConfig);

const app = HMR(App, { target: document.body }, 'routify-app')

export default app;