import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Optionally import the services that you want to use
// import {...} from 'firebase/auth';
// import {...} from 'firebase/database';
// import {...} from 'firebase/firestore';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDnEwmZMap9EVd3WberAQn1XFDx3_h7AH0",
    authDomain: "genai-ml-test.firebaseapp.com",
    projectId: "genai-ml-test",
    storageBucket: "genai-ml-test.firebasestorage.app",
    messagingSenderId: "835691285458",
    appId: "1:835691285458:web:AIzaSyDnEwmZMap9EVd3WberAQn1XFDx3_h7AH0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
