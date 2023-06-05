"use client";

import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { useUserContext } from "@/context/UserContext";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface AuthInput {
  password: string;
  email: string;
  type: "LOGIN" | "REGISTER";
}

export interface RegisterResponse {
  register: {
    id?: string;
    email?: string;
  };
}

export interface LoginResponse {
  login: {
    id?: string;
    email?: string;
  };
}

export const loginQuery = gql`
  mutation ($input: AuthInput!) {
    login(input: $input) {
      id
      email
    }
  }
`;

export const registerQuery = gql`
  mutation ($input: AuthInput!) {
    register(input: $input) {
      id
      email
    }
  }
`;

export default function AuthPage() {
  const { setUser } = useUserContext();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [login, { data: LData, error: LError }] =
    useMutation<LoginResponse>(loginQuery);
  const [register, { data: RData, error: RError }] =
    useMutation<RegisterResponse>(registerQuery);

  const authFn = async ({ password, email, type }: AuthInput) => {
    const input = { password, email };
    switch (type) {
      case "LOGIN":
        login({ variables: { input } });
        break;
      case "REGISTER":
        register({ variables: { input } });
        break;
    }
  };

  useEffect(() => {
    if (LData?.login && !LError) {
      setUser({ email: LData.login.email, id: LData.login.id });
      router.push("/");
    }
  }, [LData]);
  useEffect(() => {
    if (RData?.register && !RError) {
      setUser({ email: RData.register.email, id: RData.register.id });
      router.push("/");
    }
  }, [RData]);

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
