"use client";

import User from "@/components/User";
import { useUserContext } from "@/context/UserContext";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MeQuery = gql`
  query {
    me {
      email
      id
    }
  }
`;

const logoutQuery = gql`
  mutation {
    logout
  }
`;

export interface UserQueryResponse {
  me: {
    id?: string;
    email?: string;
  };
}

export default function UserPage() {
  const { data, refetch } = useQuery<UserQueryResponse>(MeQuery);
  const [logoutMutation] = useMutation(logoutQuery);
  const { setUser, user } = useUserContext();
  const router = useRouter();

  const logout = () => {
    setUser(null);
    logoutMutation();
    router.push("/auth");
  };

  useEffect(() => {
    if (!data) {
      try {
        fetch("http://localhost:4000/refresh", { credentials: "include" })
          .then(() => {
            refetch()
              .then(({ data }) => {
                if (!data) router.push("/auth");
              })
              .catch(() => {
                logout();
              });
          })
          .catch(() => {
            router.push("/auth");
          });
      } catch (error) {
        throw error;
      }
    } else {
      setUser(data.me);
    }
  }, [data, router]);

  return (
    <div className="flex md:flex-col flex-row items-center">
      <div className="bg-white min-w-content rounded-xl md:p-20 p-7 shadow-md">
        {user ? <User logout={logout} /> : <h1>Loading</h1>}
      </div>
    </div>
  );
}
