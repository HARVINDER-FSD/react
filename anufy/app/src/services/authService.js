import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "./firebase"

// Register new user
export const registerUser = async ({ email, password, username }) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update user profile with username
    await updateProfile(user, {
      displayName: username,
    })

    // Save additional user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      username: username,
      email: email,
      createdAt: new Date().toISOString(),
      profilePicture: null,
    })

    return {
      uid: user.uid,
      email: user.email,
      username: username,
    }
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error.code))
  }
}

// Login user
export const loginUser = async ({ email, password }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Get additional user data from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid))
    const userData = userDoc.exists() ? userDoc.data() : {}

    return {
      uid: user.uid,
      email: user.email,
      username: user.displayName || userData.username,
      ...userData,
    }
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error.code))
  }
}

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    throw new Error("Failed to logout")
  }
}

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error.code))
  }
}

// Google Sign In
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    const user = userCredential.user

    // Check if user exists in Firestore, if not create profile
    const userDoc = await getDoc(doc(db, "users", user.uid))

    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: user.displayName,
        email: user.email,
        createdAt: new Date().toISOString(),
        profilePicture: user.photoURL,
      })
    }

    return {
      uid: user.uid,
      email: user.email,
      username: user.displayName,
      profilePicture: user.photoURL,
    }
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error.code))
  }
}

// Helper function to convert Firebase error codes to user-friendly messages
const getFirebaseErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/user-not-found":
      return "No account found with this email address"
    case "auth/wrong-password":
      return "Incorrect password"
    case "auth/email-already-in-use":
      return "An account with this email already exists"
    case "auth/weak-password":
      return "Password should be at least 6 characters"
    case "auth/invalid-email":
      return "Invalid email address"
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later"
    case "auth/network-request-failed":
      return "Network error. Please check your connection"
    default:
      return "An error occurred. Please try again"
  }
}
