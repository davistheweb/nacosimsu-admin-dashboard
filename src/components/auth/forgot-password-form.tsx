"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/validators";
import { authService } from "@/services/authService";
import { ROUTES } from "@/lib/constants";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data);
      toast.success("Check your email for OTP");
      router.push(ROUTES.VERIFY_OTP);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Request failed. Please try again.";
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
          "Send OTP"
        )}
      </Button>

      <div className="flex items-center justify-center">
        <Link
          href={ROUTES.LOGIN}
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          Back to login
        </Link>
      </div>
    </form>
  );
}
