"use client"

import { StatusBar } from "expo-status-bar"
import "./global.css"
import { ScreenSelector } from "components/screens/ScreenSelector"
import { useEffect, useState } from "react"
import { onAuthStateChanged, signOut, type User } from "firebase/auth"
import { auth } from "./firebaseConfig"
import SignupScreen from "components/screens/SignUpScreen"
import LoginScreen from "components/screens/LoginScreen"
import OnBoardingScreen from "components/screens/OnBoardingScreen"
import { View } from "react-native"

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [currentScreen, setCurrentScreen] = useState<"onboarding" | "login" | "signup">("onboarding")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
  }

  // If user is authenticated, show the main app
  if (user) {
    return (
      <>
        <ScreenSelector />
        <StatusBar style="auto" />
      </>
    )
  }

  // If user is not authenticated, show authentication flow
  return (
    <View style={{ flex: 1 }}>
      {currentScreen === "onboarding" && <OnBoardingScreen onGetStarted={() => setCurrentScreen("login")} />}

      {currentScreen === "login" && (
        <LoginScreen onLogin={() => setUser(auth.currentUser)} onNavigateToSignup={() => setCurrentScreen("signup")} />
      )}

      {currentScreen === "signup" && (
        <SignupScreen onSignup={() => setUser(auth.currentUser)} onNavigateToLogin={() => setCurrentScreen("login")} />
      )}

      <StatusBar style="auto" />
    </View>
  )
}

