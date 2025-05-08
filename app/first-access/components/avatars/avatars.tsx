import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { HStack } from "@/components/ui/hstack";
import IUsername from "@/first-access/types/username";
import { useEffect, useState } from "react";
import Loader from "@/components/loader/loader";
import { VStack } from "@/components/ui/vstack";

interface IAvatar {
	id: string;
	src: string;
}

export default function Avatars({ payload, setPayload }: IUsername) {
	const [avatars, setAvatars] = useState<IAvatar[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const getAvatars = async () => {
			try {
				setIsLoading(true);
				const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/avatar_images`);
				const data = await res.json();
				setAvatars(data);
			} catch (e) {
				console.error(e);
			} finally {
				setIsLoading(false);
			}
		}
		getAvatars();
	}, [])

	if (isLoading) return (
		<VStack className="justify-center items-center min-w-[266px] min-h-[285px]">
			<Loader />
		</VStack>
	)

	return (
		<View>
			<Text style={{ fontFamily: 'IndieFlower_400Regular' }} className="text-lg font-semibold">
				Avatar
			</Text>
			<HStack className="flex-wrap justify-between gap-2">
				{avatars.map((avatar) => (
					<Pressable
						key={avatar.id}
						onPress={() => setPayload({ ...payload, avatar: avatar.id })}
						className={`w-20 h-20 rounded-full overflow-hidden ${payload.avatar === avatar.id && 'border-2'}`}
					>
						<Image style={{ width: '100%', height: '100%' }} source={{uri: avatar.src}} />
					</Pressable>
				))}
			</HStack>
		</View>
	);
}
