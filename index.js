// Import stylesheets
import './style.css';
// Firebase App (the core Firebase SDK) is always required
import { initializeApp } from 'firebase/app';

// Add the Firebase products and methods that you want to use

import {
  getAuth,
  EmailAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  where,
} from 'firebase/firestore';
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
  db = getFirestore();

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

  //Listen RSVP events click
  startRsvpButton.addEventListener('click', () => {
    if (auth.currentUser) {
      //User is signed in; allows to sign out
      signOut(auth);
    } else {
      ui.start('#firebaseui-auth-container', uiConfig);
    }

    ui.start('#firebaseui-auth-container', uiConfig);
  });

  const ui = new firebaseui.auth.AuthUI(auth);

  //Listen current Auth State
  onAuthStateChanged(auth, (user) => {
    if (user) {
      startRsvpButton.textContent = 'LOGOUT';
      //Show guestbook to only logged in users
      guestbookContainer.style.display = 'block';
      //subscribe to guestbook collection
      subscribeGuestbook();
      //subscribe to the user's rsvp
      subscribeCurrentRSVP(user);
    } else {
      startRsvpButton.textContent = 'RSVP';
      //hide guestbook to non-logged-in users
      guestbookContainer.style.display = 'none';
      //unsub from the guestbook collection
      unsubscribeGuestbook();

      //unsubscribe from rsvp
      unsubscribeCurrentRSVP();
    }
  });

  //Listen to the form submission
  form.addEventListener('submit', async (e) => {
    //prevent default
    e.preventDefault();
    //write a new message to the database collection guestbook
    addDoc(collection(db, 'guestbook'), {
      text: input.value,
      timestamp: Date.now(),
      name: auth.currentUser.displayName,
      userID: auth.currentUser.uid,
    });

    //clear message input field after
    input.value = '';
    //return false to avoid redirect
    return false;
  });

  //listen rsvp responses
  rsvpYes.onclick = async () => {
    const userRef = doc(db, 'attendees', auth.currentUser.uid);
    try {
      await setDoc(userRef, {
        attending: true,
      });
    } catch (e) {
      console.log(e);
    }
  };
  rsvpNo.onclick = async () => {
    const userRef = doc(db, 'attendees', auth.currentUser.uid);
    try {
      await setDoc(userRef, {
        attending: false,
      });
    } catch (e) {
      console.log(e);
    }
  };
  const attendingQuery = query(
    collection(db, 'attendees'),
    where('attending', '==', true)
  );
  const unsubscribe = onSnapshot(attendingQuery, (snap) => {
    const newAttendeeCount = snap.docs.length;
    numberAttending.innerHTML = newAttendeeCount + ' people going';
  });
}

//Listen to guestbook updates
function subscribeGuestbook() {
  //create a query for messages
  const q = query(collection(db, 'guestbook'), orderBy('timestamp', 'desc'));

  onSnapshot(q, (snaps) => {
    //reset page
    guestbook.innerHTML = '';

    //Loop through documents in database
    snaps.forEach((doc) => {
      //Create an HTML entry for each document and add it to the chat
      const entry = document.createElement('p');
      entry.textContent = doc.data().name + ': ' + doc.data().text;
      guestbook.appendChild(entry);
    });
  });
}

//Unsubscribe from guestbook updates
function unsubscribeGuestbook() {
  if (guestbookListener != null) {
    guestbookListener();
    guestbookListener = null;
  }
}

//Listen 4 attendee listen
function subscribeCurrentRSVP(user) {
  const ref = doc(db, 'attendees', user.uid);
  rsvpListener = onSnapshot(ref, (doc) => {
    if (doc && doc.data()) {
      const attendingResponse = doc.data().attending;

      if (attendingResponse) {
        rsvpYes.className = 'clicked';
        rsvpNo.className = '';
      } else {
        rsvpYes.className = '';
        rsvpNo.className = 'clicked';
      }
    }
  });
}

function unsubscribeCurrentRSVP() {
  if (rsvpListener != null) {
    rsvpListener();
    rsvpListener = null;
  }
  rsvpYes.className = '';
  rsvpNo.className = '';
}

main();
