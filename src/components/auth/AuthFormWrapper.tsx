"use client";

import React from "react";

export const AuthFormWrapper: React.FC<{
  children: React.ReactNode;
  formTitle: string;
  formSubtitle: string;
}> = ({ children, formTitle, formSubtitle }) => (
  <div className="flex max-h-fit w-full flex-col items-center justify-center space-y-6 rounded-[1.75rem] bg-white p-8 shadow-2xl shadow-black/20max-sm:w-[480px] sm:w-[480px] md:w-[550px] lg:p-10">
    <div className="gap-2 text-center select-none">
      <h1 className="text-3xl font-semibold text-slate-900">{formTitle}</h1>
      <p
        className="text-sm leading-6 text-slate-600"
        dangerouslySetInnerHTML={{ __html: formSubtitle }}
      />
    </div>
    {children}
  </div>
);
