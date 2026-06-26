"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import { verifyOTPSchema, type VerifyOTPFormData } from "@/lib/validators";
import { authService } from "@/services/authService";
import { ROUTES } from "@/lib/constants";

export function VerifyOTPForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyOTPFormData>({
    resolver: zodResolver(verifyOTPSchema),
  });

  const onSubmit = async (data: VerifyOTPFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.verifyOTP(data);
      toast.success("OTP verified!");
      // Store the temporary token for password reset
      sessionStorage.setItem("resetToken", response.token);
      router.push(ROUTES.RESET_PASSWORD);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Verification failed. Please try again.";
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
        <label htmlFor="otp" className="text-sm font-medium text-slate-900">
          OTP
        </label>
        <Input
          id="otp"
          type="text"
          placeholder="000000"
          className="text-black! bg-white!"
          maxLength={6}
          disabled={isLoading}
          {...register("otp")}
        />
        {errors.otp && (
          <p className="text-sm text-destructive">{errors.otp.message}</p>
        )}
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
          "Verify OTP"
        )}
      </Button>

      <div className="flex items-center justify-center">
        <Link
          href={ROUTES.FORGOT_PASSWORD}
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          Didn&apos;t receive OTP?
        </Link>
      </div>
    </form>
  );
}
