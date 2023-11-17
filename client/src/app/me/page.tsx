"use client";

import User from "@/components/User";
import UserScheduleList from "@/components/UserScheduleList";
import {
  ApolloError,
  gql,
  useLazyQuery,
  useMutation,
  useQuery,
} from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ScheduleModelSchema } from "../../../../shared";
import useRefresh from "@/hooks/useRefresh";
import LoadingComponent from "@/components/LoadingComponent";
import { createPortal } from "react-dom";
import DeleteModal from "@/components/DeleteModal";
import useDelete from "@/hooks/useDelete";
import { useUserContext } from "@/context/User/state";
import ErrorMsg from "@/components/error/ErrorMsg";
import { useGlobalErrorContext } from "@/context/Error/state";

const DEFAULT_SCHEDULE_AMOUNT = 5;

const meQuery = gql`
  query {
    me {
      email
      id
    }
  }
`;

const userSchedulesQuery = gql`
  query ($take: Float!, $offset: Float!) {
    schedules(take: $take, offset: $offset) {
      id
      name
    }
  }
`;

const logoutQuery = gql`
  mutation {
    logout {
      success
    }
  }
`;

export interface ScheduleQueryResponse {
  schedules: ScheduleModelSchema[];
}

export interface LogoutResponse {
  logout: {
    success: boolean;
  };
}

export interface FetchQueryVars {
  take: number;
  offset: number;
}

export interface UserQueryResponse {
  me: {
    id?: string;
    email?: string;
    schedules?: ScheduleModelSchema[];
  };
}

export default function UserPage() {
  const { setUser, user } = useUserContext();
  const router = useRouter();
  const [offset, setOffset] = useState<number>(0);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [higlightSchedule, setHighlightSchedule] = useState<string>("");
  const [errorMsg] = useState<Array<ApolloError | undefined>>([]);
  const { globalError, addError } = useGlobalErrorContext();
  const [fetchSchedules, { data: schedulesData, error: scheduleError }] =
    useLazyQuery<ScheduleQueryResponse, FetchQueryVars>(userSchedulesQuery, {
      fetchPolicy: "no-cache",
    });
  const {
    data,
    refetch,
    error: userError,
  } = useQuery<UserQueryResponse>(meQuery, {
    fetchPolicy: "no-cache",
  });
  const [logoutMutation, { data: logoutData, error: logoutError }] =
    useMutation<LogoutResponse>(logoutQuery);

  const [deleteSchedule] = useDelete({
    fetchSchedules,
    offset,
  });

  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    logoutMutation();
  };

  const [refresh] = useRefresh({
    refetch,
    logout,
    router,
  });

  const deleteModal = () => {
    deleteSchedule(higlightSchedule);
    setOpenDeleteModal(false);
    setHighlightSchedule("");
  };

  const openModal = (sid: string) => {
    setHighlightSchedule(sid);
    setOpenDeleteModal(true);
  };

  useEffect(() => {
    if (offset !== 0 && schedulesData?.schedules.length === 0) {
      setOffset(0);
      fetchSchedules({
        variables: {
          take: DEFAULT_SCHEDULE_AMOUNT * 2,
          offset: 0,
        },
      });
    }
  }, [schedulesData]);

  // Cookie issues -> check the order of requests

  useEffect(() => {
    if (!data?.me) {
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
  }, [data]);

  // Refactor and abstract

  useEffect(() => {
    let errorStack: Array<ApolloError | undefined> = [];
    if (logoutError) errorStack.push(logoutError);
    if (scheduleError) errorStack.push(scheduleError);
    if (userError) errorStack.push(userError);
    addError(errorStack);
  }, [logoutError, scheduleError, userError]);

  useEffect(() => {
    if (logoutData?.logout.success) {
      router.push("/auth");
    }
  }, [logoutData]);

  return (
    <>
      <div className="flex flex-col space-y-4 items-center">
        <div className="bg-white min-w-content rounded-xl md:p-20 p-4 shadow-md">
          {user ? <User logout={logout} /> : <LoadingComponent />}
        </div>
        {user && schedulesData?.schedules && (
          <>
            <div className="flex flex-col justify-center space-y-4 bg-white min-w-content rounded-xl md:p-10 p-5 shadow-md">
              <UserScheduleList
                userSchedules={schedulesData?.schedules.slice(0, 5)}
                deleteSchedule={openModal}
              />
              <div className="flex justify-between m-4">
                {schedulesData.schedules.length >=
                  DEFAULT_SCHEDULE_AMOUNT + 1 && (
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
                          take: DEFAULT_SCHEDULE_AMOUNT + 1,
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
      {openDeleteModal &&
        createPortal(
          <DeleteModal
            setOpenDeleteModal={setOpenDeleteModal}
            deleteModal={deleteModal}
          />,
          document.body
        )}
      {globalError.length >= 1 &&
        createPortal(<ErrorMsg error={errorMsg} />, document.body)}
    </>
  );
}
