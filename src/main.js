import HMR from '@roxi/routify/hmr'
import App from './App.svelte';

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/performance";
import "firebase/analytics";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAoMgQCuzqrIQc2E3Bus41YRsIDyhGGA1w",
    authDomain: "aioaio.firebaseapp.com",
    projectId: "aioaio",
    storageBucket: "aioaio.appspot.com",
    messagingSenderId: "69762931915",
    appId: "1:69762931915:web:06a2a829d519e242e20f4e",
    measurementId: "G-CVXLF6SDQY"
  };

firebase.initializeApp(firebaseConfig);

const app = HMR(App, { target: document.body }, 'routify-app')

export default app;