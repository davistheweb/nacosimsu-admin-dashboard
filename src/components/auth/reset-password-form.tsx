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
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/validators";
import { authService } from "@/services/authService";
import { ROUTES } from "@/lib/constants";

export function ResetPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("resetToken");
      if (!token) {
        throw new Error("Invalid session");
      }

      await authService.resetPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      sessionStorage.removeItem("resetToken");
      toast.success("Password reset successfully!");
      router.push(ROUTES.LOGIN);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Password reset failed. Please try again.";
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
        <label
          htmlFor="password"
          className="text-sm font-medium text-slate-900"
        >
          New Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Enter new password"
          className="text-black! bg-white!"
          disabled={isLoading}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-slate-900"
        >
          Confirm Password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          className="text-black! bg-white!"
          disabled={isLoading}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
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
          "Reset Password"
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
