import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { VerifyOTPForm } from "@/components/auth/verify-otp-form";

export const metadata = {
  title: "Verify OTP | NacosImsu Admin",
  description: "Verify your OTP to reset password",
};

export default function VerifyOTPPage() {
  return (
    <AuthWrapper
      formTitle="Verify OTP"
      formSubtitle="Enter the verification code delivered to your inbox."
    >
      <VerifyOTPForm />
    </AuthWrapper>
  );
}
