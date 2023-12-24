import { gql, useMutation } from "@apollo/client";
import { User } from "../../../shared";
import { Dispatch, SetStateAction, useEffect } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const logoutQuery = gql`
  mutation {
    logout {
      success
    }
  }
`;

export interface LogoutResponse {
  logout: {
    success: boolean;
  };
}

interface LogoutQueryParams {
  setUser: Dispatch<SetStateAction<User | null>>;
  router: AppRouterInstance;
}

export const useLogoutQuery = ({ setUser, router }: LogoutQueryParams) => {
  const [logoutMutation, { data: logoutData, error: logoutError }] =
    useMutation<LogoutResponse>(logoutQuery);

  const logout = () => {
    setUser(null);
    logoutMutation();
  };

  useEffect(() => {
    if (logoutData?.logout.success) {
      router.push("/auth");
    }
  }, [logoutData]);

  return [logout, logoutError] as const;
};
