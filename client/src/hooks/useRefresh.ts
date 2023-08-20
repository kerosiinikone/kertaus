import { UserQueryResponse } from "@/app/me/page";
import { ApolloQueryResult } from "@apollo/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

interface useRefreshArgs {
  refetch: () => Promise<ApolloQueryResult<UserQueryResponse>>;
  logout: () => void;
  router: AppRouterInstance;
}

const useRefresh = ({ refetch, logout, router }: useRefreshArgs) => {
  const refresh = () => {
    try {
      fetch(`${process.env.SERVER_URL!}/refresh`, { credentials: "include" })
        .then(() => {
          refetch().then(({ data }) => {
            if (!data.me) {
              router.push("/auth");
            }
          });
        })
        .catch(() => {
          router.push("/auth");
        });
    } catch (error) {
      logout();
    }
  };

  return [refresh] as const;
};

export default useRefresh;
