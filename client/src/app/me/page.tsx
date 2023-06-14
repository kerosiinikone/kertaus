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
  query ($take: Float!, $cursor: String) {
    schedules(take: $take, cursor: $cursor) {
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
  const [cursorItem, setCursorItem] = useState<ScheduleModelSchema | null>(
    null
  );
  const [fetchSchedules, { data: schedulesData, fetchMore: __ }] =
    useLazyQuery<ScheduleQueryResponse>(UserSchedulesQuery, {
      fetchPolicy: "network-only",
    });
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
          take: DEFAULT_SCHEDULE_AMOUNT,
          cursor: cursorItem?.id ?? null,
        },
      });
      setUser(data.me);
    }
  }, [data, router]);

  useEffect(() => {
    if (schedulesData?.schedules) {
      setCursorItem(
        schedulesData.schedules[schedulesData.schedules.length - 1]
      );
    }
  }, [schedulesData]);

  return (
    <div className="flex flex-col space-y-4 items-center">
      <div className="bg-white min-w-content rounded-xl md:p-20 p-4 shadow-md">
        {user ? <User logout={logout} /> : <h1>Loading</h1>}
      </div>
      {user && schedulesData?.schedules && (
        <div className="bg-white min-w-content rounded-xl md:p-10 p-5 shadow-md">
          <UserScheduleList userSchedules={schedulesData?.schedules} />
        </div>
      )}
    </div>
  );
}
