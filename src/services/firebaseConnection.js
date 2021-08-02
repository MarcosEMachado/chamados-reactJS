import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

let firebaseConfig = {
  apiKey: "AIzaSyAU2ehkZjUSIS3tOAtOEXtTPSztYDjWNVM",
  authDomain: "sitema-8fe9c.firebaseapp.com",
  projectId: "sitema-8fe9c",
  storageBucket: "sitema-8fe9c.appspot.com",
  messagingSenderId: "938229718376",
  appId: "1:938229718376:web:c0b5691554c992ac5f0add",
  measurementId: "G-WVX9GY1HBX"
};
  

  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }
  
  export default firebase;