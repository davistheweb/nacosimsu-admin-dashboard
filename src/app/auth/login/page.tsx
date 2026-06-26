import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Login | NacosImsu Admin",
  description: "Sign in to your NacosImsu admin account",
};

export default function LoginPage() {
  return (
    <AuthWrapper
      formTitle="Login"
      formSubtitle="Access your admin dashboard securely."
    >
      <LoginForm />
    </AuthWrapper>
  );
}
