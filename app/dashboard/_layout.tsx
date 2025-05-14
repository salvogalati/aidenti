import { Slot, useLocalSearchParams, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { UserContext } from './context/UserContext';
import { IUser } from './context/types/user';
import { getUserData } from './context/utils/functionsUser';
import Loader from '@/components/loader/loader';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const { userId } = useLocalSearchParams();
    const [user, setUser] = useState<IUser | null>(null);
    const router = useRouter();

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

    return (
        <UserContext.Provider value={{user, setUser}}>
            <View className='w-full h-full bg-white'>
                <Slot />
            </View>
        </UserContext.Provider>
    );
}
