import { StatusBar } from 'expo-status-bar';

import './global.css';
import { ScreenSelector } from 'components/screens/ScreenSelector';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "./firebaseConfig";
import SignupScreen from 'components/screens/SignUpScreen';
import LoginScreen from 'components/screens/LoginScreen';
import { Button, View } from 'react-native';

export default function App() {

  const [user, setUser] = useState<User | null>(null);
  const [isSignup, setIsSignup] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!user) {
    return isSignup ? (
      <SignupScreen onSignup={() => setIsSignup(false)} />
    ) : (
      <View>
        <LoginScreen onLogin={() => setUser(auth.currentUser)} />
        <Button title="Go to Signup" onPress={() => setIsSignup(true)} />
      </View>
    );
  }

  return (
    <>
      <ScreenSelector />
      <StatusBar style="auto" />
    </>
  );
}
