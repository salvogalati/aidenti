import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { View } from 'react-native';
import { UserContext } from './context/UserContext';
import { IUser } from './context/types/user';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [user, setUser] = useState<IUser | null>({ id: '345', name: 'Nicolaaa' });

    useEffect(() => {
        SplashScreen.hideAsync();
    }, []);

    return (
        <UserContext.Provider value={{user, setUser}}>
            <View className='w-full h-full bg-white'>
                <Slot />
            </View>
        </UserContext.Provider>
    );
}
