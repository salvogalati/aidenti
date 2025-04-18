import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import '../global.css'
import { GluestackUIProvider } from './components/ui/gluestack-ui-provider';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GluestackUIProvider>
      <Slot />
    </GluestackUIProvider>
  );
}
