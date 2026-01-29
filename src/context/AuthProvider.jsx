import { createContext, useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import app from "../firebase/firebase.init";

export const AuthContext = createContext(null);
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  const signInUser = async (email, password) => {
    setLoading(true);
    const credential = await signInWithEmailAndPassword(auth, email, password);

    const res = await fetch(
      `https://local-chef-bazaar-server-black.vercel.app/users/role/${email}`
    );
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
      try {
        if (firebaseUser) {
          const res = await fetch(
            `https://local-chef-bazaar-server-black.vercel.app/users/role/${firebaseUser.email}`
          );
          const data = await res.json();

          setUser({ ...firebaseUser, role: data.role });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth restore failed", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        createUser,
        updateUserProfile,
        signInUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
