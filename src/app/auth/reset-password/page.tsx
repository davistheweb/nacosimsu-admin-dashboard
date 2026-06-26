import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata = {
  title: "Reset Password | NacosImsu Admin",
  description: "Reset your NacosImsu admin password",
};

export default function ResetPasswordPage() {
  return (
    <AuthWrapper
      formTitle="Reset Password"
      formSubtitle="Choose a secure password to restore account access."
    >
      <ResetPasswordForm />
    </AuthWrapper>
  );
}
