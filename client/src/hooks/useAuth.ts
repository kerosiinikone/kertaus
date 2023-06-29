import { AuthInput } from "@/app/auth/page";
import { useUserContext } from "@/context/User";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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

const useAuth = () => {
  const { setUser } = useUserContext();
  const router = useRouter();
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

  return [authFn] as const;
};

export default useAuth;
