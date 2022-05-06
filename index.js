// Import stylesheets
import './style.css';
// Firebase App (the core Firebase SDK) is always required
import { initializeApp } from 'firebase/app';

// Add the Firebase products and methods that you want to use

import { getAuth, EmailAuthProvider } from 'firebase/auth';
import {} from 'firebase/firestore';
import * as firebaseui from 'firebaseui';

// Document elements
const startRsvpButton = document.getElementById('startRsvp');
const guestbookContainer = document.getElementById('guestbook-container');

const form = document.getElementById('leave-message');
const input = document.getElementById('message');
const guestbook = document.getElementById('guestbook');
const numberAttending = document.getElementById('number-attending');
const rsvpYes = document.getElementById('rsvp-yes');
const rsvpNo = document.getElementById('rsvp-no');

let rsvpListener = null;
let guestbookListener = null;

let db, auth;

async function main() {
  // Add Firebase project configuration object here
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: 'AIzaSyCQmmTf7YqtZfbgLOpte1xFXAbcTVba7_8',
    authDomain: 'fir-gtk-web-start-eeedd.firebaseapp.com',
    projectId: 'fir-gtk-web-start-eeedd',
    storageBucket: 'fir-gtk-web-start-eeedd.appspot.com',
    messagingSenderId: '446806504875',
    appId: '1:446806504875:web:b266e7f09d05e523a98eee',
    measurementId: 'G-7ZYXWMG67F',
  };

  initializeApp(firebaseConfig);
  auth = getAuth();
  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        // Handle sign-in.
        // Return false to avoid redirect.
        return false;
      },
    },
  };

  const ui = new firebaseui.auth.AuthUI(auth);
}
main();
