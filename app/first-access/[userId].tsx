import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { IndieFlower_400Regular, useFonts } from '@expo-google-fonts/indie-flower';
import { Button, ButtonGroup, ButtonIcon, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import Username from "./components/username/username";
import Age from "./components/age/age";
import Sex from "./components/sex/sex";
import Monster from "./components/monster/monster";
import Avatars from "./components/avatars/avatars";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { firstAccess } from "./utils/functionsFirstAccess";
import { Text, View } from "react-native";
import colors from "tailwindcss/colors";
import { checkToken } from "@/utils/functionsAuth";
import { Image } from "react-native";

export default function FirstAccessPage() {
	const [fontsLoaded] = useFonts({
		IndieFlower_400Regular,
	});
	const [payload, setPayload] = useState({ id: '', username: '', date_of_birth: '', gender: '', avatar_id: '' });
	const [avatarLayout, setAvatarLayout] = useState(false);
	const { userId } = useLocalSearchParams();
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState('');
	const [isSending, setIsSending] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, [])

	useEffect(() => {
		if (!isMounted) return;

		// checkToken(router);
	}, [isMounted])

	const canSubmit =
		(payload.username.length > 0 && payload.username.length <= 15) &&
		Number(payload.date_of_birth) >= 18 &&
		payload.gender;

	useEffect(() => {
		if (typeof userId === 'string') {
			setPayload({ ...payload, id: userId });
		}
	}, [userId]);

	if (!fontsLoaded) {
		return null;
	}

	return (
		<VStack className="w-full h-full justify-center items-center relative">
			<View className="absolute w-full h-full top-0 left-0">
				<Image blurRadius={5} className="object-cover" style={{ width: '100%', height: '100%' }} source={require('./assets/bgForm.png')} />
			</View>
			<Box className="rounded-md bg-white border border-background-200 p-4 flex gap-1 relative w-[300px]">
				<Monster classMonster={`absolute -top-20 left-0 max-w-52 max-h-52`} />
				{
					!avatarLayout ?
						<>
							<Username payload={payload} setPayload={setPayload} />

							<Age payload={payload} setPayload={setPayload} />

							<Sex payload={payload} setPayload={setPayload} />
						</>
						:
						<Avatars payload={payload} setPayload={setPayload} />
				}
				{
					errorMessage &&
					<Text className="text-end">{errorMessage}</Text>
				}
				<HStack className="justify-end items-center gap-2 mt-4">
					<ButtonGroup>
						<Button
							disabled={!canSubmit}
							className={`${!canSubmit && 'opacity-50'}`}
							onPress={() => setAvatarLayout(!avatarLayout)}
						>
							{
								avatarLayout && <ButtonIcon as={ArrowLeftIcon} />
							}
							<ButtonText>
								{
									!avatarLayout ?
										'Next'
										:
										'Go Back'
								}
							</ButtonText>
							{
								!avatarLayout && <ButtonIcon as={ArrowRightIcon} />
							}
						</Button>
					</ButtonGroup>
					{
						avatarLayout &&
						<ButtonGroup>
							<Button
								disabled={!(canSubmit && payload.avatar_id) || isSending}
								className={`${!(canSubmit && payload.avatar_id) || isSending ? 'opacity-50' : ''}`}
								onPress={() => firstAccess(payload, router, setErrorMessage, setIsSending)}
							>
								{
									isSending &&
									<ButtonSpinner color={colors.gray[400]} />
								}
								<ButtonText>
									Send
								</ButtonText>
							</Button>
						</ButtonGroup>
					}
				</HStack>
			</Box>
		</VStack>
	);
}
