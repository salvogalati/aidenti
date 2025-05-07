import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Text, View } from "react-native";
import { IndieFlower_400Regular, useFonts } from '@expo-google-fonts/indie-flower';
import { Button, ButtonGroup, ButtonIcon, ButtonText } from "@/components/ui/button";
import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import Username from "./components/username/username";
import Age from "./components/age/age";
import Sex from "./components/sex/sex";
import Monster from "./components/monster/monster";

export default function FirstAccessPage() {
	const [fontsLoaded] = useFonts({
		IndieFlower_400Regular,
	});
	const [payload, setPayload] = useState({ username: '', age: '', sex: '', avatar: '' });
	const [avatarLayout, setAvatarLayout] = useState(false);

	const canSubmit =
		(payload.username.length > 0 && payload.username.length <= 15) &&
		Number(payload.age) >= 18 &&
		payload.sex;

	if (!fontsLoaded) {
		return null;
	}

	return (
		<VStack className="w-full h-full justify-center items-center">
			<Box className="rounded-md border border-background-200 p-4 flex gap-1 relative">
				<Monster classMonster={`absolute -top-24 left-0 max-w-52 max-h-52`} />
				{
					!avatarLayout ?
						<>
							<Username payload={payload} setPayload={setPayload} />

							<Age payload={payload} setPayload={setPayload} />

							<Sex payload={payload} setPayload={setPayload} />
						</>
						:
						<View>
							<Text style={{ fontFamily: 'IndieFlower_400Regular' }} className="text-lg font-semibold">
								Avatar
							</Text>
						</View>
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
								disabled={!(canSubmit && payload.avatar)}
								className={`${!(canSubmit && payload.avatar) ? 'opacity-50' : ''}`}
							>
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
