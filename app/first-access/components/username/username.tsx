import { Input, InputField } from "@/components/ui/input";
import IFirstAccess from "@/first-access/types/firstAccess";
import IUsername from "@/first-access/types/username";
import { View, Text } from "react-native";

export default function Username({ payload, setPayload }: IUsername) {
    return (
        <View>
            <Text style={{ fontFamily: 'IndieFlower_400Regular' }} className="text-lg font-semibold">
                Username
            </Text>
            <Input className="my-1">
                <InputField
                    type="text"
                    placeholder="Username"
                    className="bg-white"
                    maxLength={16}
                    value={payload.username}
                    onChangeText={(text: string) =>
                        setPayload((prev: IFirstAccess) => ({
                            ...prev,
                            username: text,
                        }))
                    }
                />
            </Input>
            {payload.username.length > 15 && (
                <Text className="text-red-500 text-[10px]">
                    You cannot enter more than 15 characters
                </Text>
            )}
        </View>
    );
}
