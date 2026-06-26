"use client";

import Image from "next/image";
import React from "react";
import { Toaster } from "sonner";
import { AuthFormWrapper } from "./AuthFormWrapper";
import logo from "@/assets/nacos-imsu_logo.png";

export const AuthWrapper: React.FC<{
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  formTitle: string;
  formSubtitle: string;
}> = ({
  children,
  title = "Welcome Back, Administrator",
  subtitle = "Manage events, registrations, and staff access with confidence. <br/> Your operational control center for keeping NacosIMSU running smoothly.",
  formTitle,
  formSubtitle,
}) => (
  <div className="min-h-screen bg-slate-950 text-slate-100">
    <section className="flex h-screen w-full max-w-500 flex-col justify-center gap-4 bg-slate-950/95 p-4 lg:min-h-screen lg:flex-row lg:items-start lg:justify-around lg:p-10">
      <aside className="mt-10 hidden flex-col justify-start gap-10 text-white lg:flex">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-semibold leading-tight lg:text-5xl">
            {title}
          </h1>
          <p
            className="max-w-xl text-sm leading-8 text-slate-300"
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />
        </div>
        <div className="">
          <Image
            src={logo}
            alt="Nacos IMSU logo"
            width={300}
            height={300}
            // className="object-contain"
            draggable={false}
            priority
          />
        </div>
      </aside>

      <main className="-mt-20 flex h-full items-center justify-center md:mt-5 lg:items-start lg:justify-start">
        <div className="flex w-full items-center justify-center max-sm:max-w-md">
          {/* <Toaster richColors position="top-right" /> */}
          <AuthFormWrapper formTitle={formTitle} formSubtitle={formSubtitle}>
            {children}
          </AuthFormWrapper>
        </div>
      </main>
    </section>
  </div>
);
