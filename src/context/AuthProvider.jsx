import { createContext, useState, useEffect } from "react";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "firebase/auth";
import app from "../firebase/firebase.init";

export const AuthContext = createContext(null);
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signInUser = async (email, password) => {
    setLoading(true);
    const credential = await signInWithEmailAndPassword(auth, email, password);

    // Fetch role from backend
    const res = await fetch(`https://local-chef-bazaar-server-black.vercel.app/users/role/${email}`);
    const data = await res.json();
    
    setUser({ ...credential.user, role: data.role });
    setLoading(false);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch role from backend
        const res = await fetch(`https://local-chef-bazaar-server-black.vercel.app/users/role/${firebaseUser.email}`);
        const data = await res.json();
        setUser({ ...firebaseUser, role: data.role });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signInUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
