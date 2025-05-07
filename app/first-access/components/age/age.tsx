import { Input, InputField } from "@/components/ui/input";
import IFirstAccess from "@/first-access/types/firstAccess";
import IUsername from "@/first-access/types/username";
import { View, Text } from "react-native";

export default function Age({ payload, setPayload }: IUsername) {

    const agePattern = /^[0-9]{0,2}$/;

    return (
        <View>
            <Text style={{ fontFamily: 'IndieFlower_400Regular' }} className="text-lg font-semibold">
                Age
            </Text>
            <Input className="my-1">
                <InputField
                    type="text"
                    placeholder="Age"
                    className="bg-white"
                    value={payload.age}
                    onChangeText={(text: string) => {
                        if (!agePattern.test(text)) return;
                        setPayload((prev: IFirstAccess) => ({
                            ...prev,
                            age: text,
                        }))
                    }}
                />
            </Input>
            {payload.age !== '' && Number(payload.age) < 18 && (
                <Text className="text-red-500 text-[10px] mt-1">
                    Your age must be above 18 years
                </Text>
            )}
        </View>
    );
}
