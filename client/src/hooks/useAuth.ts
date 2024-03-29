import { AuthInput } from "@/app/auth/page";
import { useGlobalErrorContext } from "@/context/Error/state";
import { useUserContext } from "@/context/User/state";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RegisterResponse {
  register: {
    id?: string;
    email?: string;
  };
}

interface LoginResponse {
  login: {
    id?: string;
    email?: string;
  };
}

const loginQuery = gql`
  mutation ($input: AuthInput!) {
    login(input: $input) {
      id
      email
    }
  }
`;

const registerQuery = gql`
  mutation ($input: AuthInput!) {
    register(input: $input) {
      id
      email
    }
  }
`;

const useAuth = () => {
  const { setUser } = useUserContext();
  const { addError } = useGlobalErrorContext();
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

  useEffect(() => {
    if (LError) {
      addError([LError]);
    }
  }, [LError]);

  useEffect(() => {
    if (RError) {
      addError([RError]);
    }
  }, [RError]);

  return [authFn] as const;
};

export default useAuth;
