// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-analytics.js";
const firebaseConfig = {
    apiKey: "AIzaSyCL3L0xwHya40VwEgCHfkyMSL5SYh_PHgI",
    authDomain: "seeds-bot.firebaseapp.com",
    projectId: "seeds-bot",
    storageBucket: "seeds-bot.appspot.com",
    messagingSenderId: "741474982741",
    appId: "1:741474982741:web:d04f156a97509a394b6ddc",
    measurementId: "G-RX43CXQWH5"
};  
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);