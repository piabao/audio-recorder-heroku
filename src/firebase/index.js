import firebase from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBOLuAJPXoRQcughGjTA00P2aYLwlCfmdw",
    authDomain: "audio-recorder-3b0c5.firebaseapp.com",
    projectId: "audio-recorder-3b0c5",
    storageBucket: "audio-recorder-3b0c5.appspot.com",
    messagingSenderId: "1019975589440",
    appId: "1:1019975589440:web:62c020457584adb0c109a5"
};
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };