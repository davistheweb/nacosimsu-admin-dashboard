import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata = {
  title: "Forgot Password | NacosImsu Admin",
  description: "Reset your NacosImsu admin password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthWrapper
      formTitle="Forgot Password"
      formSubtitle="Enter your corporate email to receive a verification code."
    >
      <ForgotPasswordForm />
    </AuthWrapper>
  );
}
