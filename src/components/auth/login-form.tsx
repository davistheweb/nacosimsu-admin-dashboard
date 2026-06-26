"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import { loginSchema, type LoginFormData } from "@/lib/validators";
import { authService } from "@/services/authService";
import { setCookie } from "@/lib/cookies";
import { ROUTES } from "@/lib/constants";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      // Set the token in httpOnly cookie via API response
      // The API should set the cookie header
      toast.success("Login successful!");
      setCookie(response.token);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("nacosimsu.user_name", response.user.name);
      }
      router.push(ROUTES.DASHBOARD);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-5"
    >
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-slate-900">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="text-black! bg-white!"
          disabled={isLoading}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label
          htmlFor="password"
          className="text-sm font-medium text-slate-900"
        >
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          className="text-black! bg-white!"
          disabled={isLoading}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-end">
        <Link
          href={ROUTES.FORGOT_PASSWORD}
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        className="block w-full h-14 rounded-full bg-emerald-500 text-lg font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 transition-all duration-300 ease-in-out"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-[3px] border-white/30 border-t-white" />
          </div>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
}
