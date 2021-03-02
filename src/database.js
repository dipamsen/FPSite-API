const firebase = require("firebase").default

const firebaseConfig = {
  apiKey: "AIzaSyDn_E9L9JYJeM0caKYBLJdGAk7bL-mSClc",
  authDomain: "fun-planet-95e02.firebaseapp.com",
  projectId: "fun-planet-95e02",
  storageBucket: "fun-planet-95e02.appspot.com",
  messagingSenderId: "881612924662",
  appId: "1:881612924662:web:bfe8741f292f32c50a6ed7"
};

firebase.initializeApp(firebaseConfig);

module.exports = firebase.firestore()