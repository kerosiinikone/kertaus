"use client";

import User from "@/components/User";
import UserScheduleList from "@/components/UserScheduleList";
import { useUserContext } from "@/context/UserContext";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ScheduleModelSchema } from "../../../../shared";
import useRefresh from "@/hooks/useRefresh";

const DEFAULT_SCHEDULE_AMOUNT = 5;

const MeQuery = gql`
  query {
    me {
      email
      id
    }
  }
`;

const UserSchedulesQuery = gql`
  query ($take: Float!, $offset: Float!) {
    schedules(take: $take, offset: $offset) {
      id
      name
    }
  }
`;

const logoutQuery = gql`
  mutation {
    logout
  }
`;

export interface ScheduleQueryResponse {
  schedules: ScheduleModelSchema[];
}

export interface UserQueryResponse {
  me: {
    id?: string;
    email?: string;
    schedules?: ScheduleModelSchema[];
  };
}

export default function UserPage() {
  const { data, refetch } = useQuery<UserQueryResponse>(MeQuery, {
    fetchPolicy: "no-cache",
  });
  const [fetchSchedules, { data: schedulesData }] =
    useLazyQuery<ScheduleQueryResponse>(UserSchedulesQuery, {
      fetchPolicy: "no-cache",
    });
  const [offset, setOffset] = useState<number>(0);
  const [logoutMutation] = useMutation(logoutQuery);
  const { setUser, user } = useUserContext();
  const router = useRouter();

  const logout = () => {
    setUser(null);
    logoutMutation();
    router.push("/auth");
  };

  const [refresh] = useRefresh({
    refetch,
    logout,
    router,
  });

  useEffect(() => {
    if (!data) {
      refresh();
    } else {
      fetchSchedules({
        variables: {
          take: DEFAULT_SCHEDULE_AMOUNT * 2,
          offset: offset * DEFAULT_SCHEDULE_AMOUNT,
        },
      });
      setUser(data.me);
    }
  }, [data, router]);

  return (
    <div className="flex flex-col space-y-4 items-center">
      <div className="bg-white min-w-content rounded-xl md:p-20 p-4 shadow-md">
        {user ? <User logout={logout} /> : <h1>Loading</h1>}
      </div>
      {user && schedulesData?.schedules && (
        <>
          <div className="flex flex-col justify-center space-y-4 bg-white min-w-content rounded-xl md:p-10 p-5 shadow-md">
            <UserScheduleList
              userSchedules={schedulesData?.schedules.slice(0, 5)}
            />
            <div className="flex justify-between m-4">
              {(schedulesData.schedules.length === DEFAULT_SCHEDULE_AMOUNT ||
                schedulesData.schedules.length >=
                  DEFAULT_SCHEDULE_AMOUNT + 1) && (
                <button
                  onClick={() => {
                    setOffset(offset + 1);
                    fetchSchedules({
                      variables: {
                        take: DEFAULT_SCHEDULE_AMOUNT,
                        offset: (offset + 1) * DEFAULT_SCHEDULE_AMOUNT,
                      },
                    });
                  }}
                  className="text-slate-400"
                >
                  Next page
                </button>
              )}
              {offset !== 0 && (
                <button
                  onClick={() => {
                    setOffset(offset - 1);
                    fetchSchedules({
                      variables: {
                        take: DEFAULT_SCHEDULE_AMOUNT,
                        offset: (offset - 1) * DEFAULT_SCHEDULE_AMOUNT,
                      },
                    });
                  }}
                  className="text-slate-400"
                >
                  Previous page
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
