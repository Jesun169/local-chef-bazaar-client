import { createContext, useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import app from "../firebase/firebase.init";

export const AuthContext = createContext(null);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= CREATE USER =================
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // ================= UPDATE PROFILE =================
  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  // ================= EMAIL LOGIN =================
  const signInUser = async (email, password) => {
    setLoading(true);

    const credential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const res = await fetch(
      `https://local-chef-bazaar-server-black.vercel.app/users/role/${email}`
    );
    const data = await res.json();

    const loggedUser = {
      ...credential.user,
      role: data.role,
    };

    setUser(loggedUser);
    setLoading(false);

    return credential.user;
  };

  // ================= GOOGLE LOGIN =================
  const signInWithGoogle = async () => {
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      const res = await fetch(
        `https://local-chef-bazaar-server-black.vercel.app/users/role/${firebaseUser.email}`
      );
      const data = await res.json();

      const googleUser = {
        ...firebaseUser,
        role: data.role,
      };

      setUser(googleUser);

      return firebaseUser;
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGOUT =================
  const logout = async () => {
    setLoading(true);

    await signOut(auth);
    setUser(null);

    setLoading(false);
  };

  // ================= AUTH STATE RESTORE =================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const res = await fetch(
            `https://local-chef-bazaar-server-black.vercel.app/users/role/${firebaseUser.email}`
          );
          const data = await res.json();

          setUser({
            ...firebaseUser,
            role: data.role,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth restore failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // ================= CONTEXT VALUE =================
  const authInfo = {
    user,
    loading,
    createUser,
    updateUserProfile,
    signInUser,
    signInWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;