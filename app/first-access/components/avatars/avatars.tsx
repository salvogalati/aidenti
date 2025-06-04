import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { HStack } from "@/components/ui/hstack";
import IUsername from "@/first-access/types/username";
import { useEffect, useState } from "react";
import Loader from "@/components/loader/loader";
import { VStack } from "@/components/ui/vstack";
import { IAvatar } from "@/first-access/types/avatar";
import { getAvatars } from "@/first-access/utils/functionsFirstAccess";

export default function Avatars({ payload, setPayload, isFirstAccessPage = true }: IUsername) {
	const [avatars, setAvatars] = useState<IAvatar[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		getAvatars(setIsLoading, setAvatars);
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
						onPress={isFirstAccessPage ? () => setPayload({ ...payload, avatar_id: avatar.id }) : () => setPayload({ ...payload, avatar_id: avatar.src })}
						className={`w-20 h-20 rounded-full overflow-hidden ${payload.avatar_id === avatar.id || payload.avatar_id === avatar.src && 'border-2'}`}
					>
						<Image style={{ width: '100%', height: '100%' }} source={{uri: avatar.src}} />
					</Pressable>
				))}
			</HStack>
		</View>
	);
}
