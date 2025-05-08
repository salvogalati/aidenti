import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import '../global.css'
import { GluestackUIProvider } from './components/ui/gluestack-ui-provider';
import { View } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GluestackUIProvider>
      <View className='w-full h-full bg-white'>
        <Slot />
      </View>
    </GluestackUIProvider>
  );
}
