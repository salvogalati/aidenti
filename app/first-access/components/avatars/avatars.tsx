import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { HStack } from "@/components/ui/hstack";
import IUsername from "@/first-access/types/username";

const avatars = [
	{ id: '1', src: require('../../../../backend/avatars/Avatar1.png') },
	{ id: '2', src: require('../../../../backend/avatars/Avatar2.png') },
	{ id: '3', src: require('../../../../backend/avatars/Avatar3.png') },
	{ id: '4', src: require('../../../../backend/avatars/Avatar4.png') },
	{ id: '5', src: require('../../../../backend/avatars/Avatar5.png') },
	{ id: '6', src: require('../../../../backend/avatars/Avatar6.png') },
	{ id: '7', src: require('../../../../backend/avatars/Avatar7.png') },
	{ id: '8', src: require('../../../../backend/avatars/Avatar8.png') },
	{ id: '9', src: require('../../../../backend/avatars/Avatar9.png') },
];

export default function Avatars({ payload, setPayload }: IUsername) {
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
						<Image style={{ width: '100%', height: '100%' }} source={avatar.src} />
					</Pressable>
				))}
			</HStack>
		</View>
	);
}
