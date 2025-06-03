
// Firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs ,addDoc,deleteDoc,updateDoc,where,query} from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyCe7WxGrSApJprD9Onr8seatf6ehIaNoWQ",
  authDomain: "layale-9ae36.firebaseapp.com",
  projectId: "layale-9ae36",
  storageBucket: "layale-9ae36.firebasestorage.app",
  messagingSenderId: "244561551238",
  appId: "1:244561551238:web:efe9a7c12ac2dce47a1607"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// تصدير db والدوال الأخرى لاستخدامها في باقي المشروع
export { db, doc, getDoc, collection, getDocs, addDoc,deleteDoc,updateDoc,where ,query};