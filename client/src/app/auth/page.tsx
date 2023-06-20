"use client";

import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";

export interface AuthInput {
  password: string;
  email: string;
  type: "LOGIN" | "REGISTER";
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [authFn] = useAuth();

  // ERROR HANDLING, React.createPortal

  return (
    <div className="flex md:flex-col flex-row items-center">
      <div className="flex flex-col space-y-7 justify-center items-center bg-white min-w-content rounded-xl md:p-20 p-7 shadow-md">
        {isLogin ? (
          <LoginForm authFn={authFn} />
        ) : (
          <RegisterForm authFn={authFn} />
        )}
        <div className="min-w-[100px] border-2 rounded-md"></div>
        <div>
          <button
            className="min-w-[200px] min-h-[30px] select-none text-white bg-slate-400 border-0
              shadow-md p-2 rounded-md hover:bg-slate-100 hover:text-slate-400 transition"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Switch to Register" : "Switch to Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
