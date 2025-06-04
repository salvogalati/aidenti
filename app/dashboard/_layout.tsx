import { Slot, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { UserContext } from './context/UserContext';
import { IUser } from './context/types/user';
import { getUserData } from './context/utils/functionsUser';
import Loader from '@/components/loader/loader';
import { checkToken } from '@/utils/functionsAuth';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const { userId } = useLocalSearchParams();
    const [user, setUser] = useState<IUser | null>(null);
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    useEffect(() => {
        if (!isMounted) return;

        checkToken(router);
    }, [isMounted])

    useEffect(() => {
        SplashScreen.hideAsync();
    }, []);

    useEffect(() => {
        if (typeof userId === 'string') {
            getUserData(userId, ['id', 'username', 'avatar_src'], setUser, router);
        }
    }, [userId]);

    if (!user) {
        return (
            <View className="w-full h-full flex flex-row justify-center items-center">
                <Loader />
            </View>
        );
    }

    if (Platform.OS === 'web') {
        return (
            <UserContext.Provider value={{ user, setUser }}>
                <View className='w-full h-full bg-white'>
                    <Slot />
                </View>
            </UserContext.Provider>
        );
    }

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <View className='w-full h-full bg-white'>
                <Stack>
                    <Stack.Screen name='(tabs)' options={{headerShown: false}} />
                </Stack>
            </View>
        </UserContext.Provider>
    );
}
