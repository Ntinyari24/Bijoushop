import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "../lib/firebase"; // adjust if your firebase export is different
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";

interface User {
  uid: string;
  email: string | null;
  role: "admin" | "seller" | "customer";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  currentPage: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState("home");

  // Helper to fetch role from localStorage
  const getUserRole = (uid: string): User["role"] => {
    const role = localStorage.getItem(`user_role_${uid}`);
    if (role === "admin" || role === "seller") return role;
    return "customer";
  };

  // Run on app load and login state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const role = getUserRole(firebaseUser.uid);

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role,
        });

        // Redirect logic
        if (role === "admin") {
          setCurrentPage("admin");
        } else {
          setCurrentPage("home");
        }
      } else {
        setUser(null);
        setCurrentPage("home");
      }
    });

    return () => unsubscribe();
  }, []);

  // Login with email/password
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // redirection handled by onAuthStateChanged above
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setCurrentPage("home");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, currentPage, setCurrentPage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
