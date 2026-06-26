"use client";

import React from "react";

export function AuthFormWrapper({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex w-full max-w-xl flex-col items-center justify-center gap-6 rounded-[1.5rem] bg-white p-8 shadow-2xl shadow-slate-950/10">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-slate-950">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
