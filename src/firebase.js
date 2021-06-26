import firebase from 'firebase'

const firebaseapp = firebase.initializeApp({
    apiKey: "AIzaSyC9vjlQB061RSM1dOxueLZqFmLog3qhK1Y",
    authDomain: "instagram-clone-d1db0.firebaseapp.com",
    projectId: "instagram-clone-d1db0",
    storageBucket: "instagram-clone-d1db0.appspot.com",
    messagingSenderId: "988289655850",
    appId: "1:988289655850:web:55300624d5c198ff3a4f53"
  });

const db = firebaseapp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export { db, auth, storage }