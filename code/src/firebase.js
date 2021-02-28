import firebase from 'firebase';

/*Initialize app. Code provided from firebase*/
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBABECgLxo0K5A0HVcg8aPLzmWUitkIq_s",
    authDomain: "beej-e0db0.firebaseapp.com",
    projectId: "beej-e0db0",
    storageBucket: "beej-e0db0.appspot.com",
    messagingSenderId: "511189162680",
    appId: "1:511189162680:web:b99c76d2127c85ea66b24d",
    measurementId: "G-R4Z3XQSSM9"
  });

  const db = firebaseApp.firestore();  /*access the db*/
  const auth = firebase.auth(); /*for authentication, create users, login, logout*/
  const storage = firebase.storage();   /* for uploading pictures to firebase and storing in db */

  export {db, auth, storage};