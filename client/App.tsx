import { StatusBar } from 'expo-status-bar';

import './global.css';
import { ScreenSelector } from 'components/screens/ScreenSelector';

export default function App() {
  return (
    <>
      <ScreenSelector />
      <StatusBar style="auto" />
    </>
  );
}
