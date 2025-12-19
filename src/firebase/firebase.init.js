
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBtQeiyYXGb2BzutszJrwAO8GYdtlSvaik",
  authDomain: "local-chef-bazaar-ff60f.firebaseapp.com",
  projectId: "local-chef-bazaar-ff60f",
  storageBucket: "local-chef-bazaar-ff60f.appspot.com",
  messagingSenderId: "661995798004",
  appId: "1:661995798004:web:e7fcd234053ab6bd660da1",
  measurementId: "G-6EJQRL19Q8",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;