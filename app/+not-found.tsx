import { Link } from 'expo-router';
import {View, Text} from 'react-native';

export default function NotFoundScreen() {
  return (
    <View className='w-full h-full flex justify-center items-center gap-2'>
      <Text>
        Not Found
      </Text>
      <Link href={'/'}>
        Go Back
      </Link>
    </View>
  );
}
