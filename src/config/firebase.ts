import { initializeApp } from 'firebase/app';
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: 'accesstoken-ecommerce-01.firebaseapp.com',
	projectId: 'accesstoken-ecommerce-01',
	storageBucket: 'accesstoken-ecommerce-01.appspot.com',
	messagingSenderId: '993761382977',
	appId: '1:993761382977:web:8cd3df1b0b073dad996cc0',
};

const app = initializeApp(firebaseConfig);

export default app;
