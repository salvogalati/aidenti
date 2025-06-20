import { Router } from "expo-router";
import { SetStateAction } from "react";

export const verifyOTP = async (email: string, otp: string, setMessage: React.Dispatch<SetStateAction<string>>, setIsSending: React.Dispatch<SetStateAction<boolean>>, router: Router, setViewOTP: React.Dispatch<SetStateAction<boolean>>) => {
    try {

        setIsSending(true);
        const verifyOTPData = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/verify-email`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ email, otp }),
        });

        const data = await verifyOTPData.json();

        if (!verifyOTPData.ok) {
            throw new Error(data.message || 'OTP problems');
        }

        setMessage(data.message)

        setViewOTP(false);

        const timer = setTimeout(() => {
            router.push('/')
        }, 3000);
        return () => clearTimeout(timer);

    } catch (error) {
        if (error instanceof Error) {
            setMessage(error.message)
        } else {
            console.error('Unknown error during OTP:', error);
        }
    } finally {
        setIsSending(false);
    }
}
