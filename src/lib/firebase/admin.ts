import firebase from "firebase-admin";

import {
  DATABASE_URL,
  STORAGE_BUCKET,
  FIREBASE_SERVICE_ACCOUNT_KEY,
} from "$env/static/private";

const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT_KEY as string);
if (firebase?.apps?.length === 0) {
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: DATABASE_URL,
    storageBucket: STORAGE_BUCKET,
  });
}

export const fbAdmin = firebase;
export const firestore = firebase.firestore();
