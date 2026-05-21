import { createContext, useContext, useEffect, useState } from "react"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth"
import { auth } from "../firebase"


const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 👂 ESCUCHAR SESIÓN DE FIREBASE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (error) {
      console.error("🔥 Login error:", error.code)
      return { success: false, error: error.code }
    }
  }

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      // Step 1: Create the baseline credentials with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Step 2: IMMEDIATELY save the username as the profile's displayName!
      await updateProfile(user, {
        displayName: username.trim()
      });

      // Step 3: Refresh local state tracking parameters so React catches the change instantly
      setUser({
        ...user,
        displayName: username.trim()
      });

      return { success: true };
    } catch (error) {
      console.error("Registration sub-routine failed:", error);
      return { success: false, error: error.code };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
