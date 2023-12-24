"use client";

import User from "@/app/me/_components/User";
import UserScheduleList from "@/app/me/_components/UserScheduleList";
import { ApolloError } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useRefresh from "@/hooks/useRefresh";
import LoadingComponent from "@/components/ui/LoadingComponent";
import { createPortal } from "react-dom";
import useDelete from "@/hooks/useDelete";
import { useUserContext } from "@/context/User/state";
import ErrorMsg from "@/components/ui/ErrorMsg";
import { useGlobalErrorContext } from "@/context/Error/state";
import DeleteModal from "@/components/ui/DeleteModal";
import { useFetchSchedules } from "./_hooks/useFetchSchedules";
import { useUserQuery } from "./_hooks/useUserQuery";
import { useLogoutQuery } from "@/hooks/useLogout";
import { useErrorStack } from "./_hooks/useErrorStack";

const DEFAULT_SCHEDULE_AMOUNT = 5;

export default function UserPage() {
  const { setUser, user } = useUserContext();
  const router = useRouter();
  const [
    initialFetch,
    schedulesData,
    scheduleError,
    nextPage,
    previousPage,
    offset,
  ] = useFetchSchedules({
    defaultAmount: DEFAULT_SCHEDULE_AMOUNT,
  });
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [higlightSchedule, setHighlightSchedule] = useState<string>("");
  const [errorMsg] = useState<Array<ApolloError | undefined>>([]);
  const { globalError, addError } = useGlobalErrorContext();
  const [data, refetch, userError] = useUserQuery();
  const [logout, logoutError] = useLogoutQuery({ setUser, router });
  const [deleteSchedule] = useDelete({
    fetchSchedules: initialFetch,
    offset,
  });
  const [refresh] = useRefresh({
    refetch,
    logout,
    router,
  });
  useErrorStack({ addError, userError, logoutError, scheduleError });

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
    if (!data?.me) {
      refresh();
    } else {
      initialFetch({
        variables: {
          take: DEFAULT_SCHEDULE_AMOUNT * 2,
          offset: offset * DEFAULT_SCHEDULE_AMOUNT,
        },
      });
      setUser(data.me);
    }
  }, [data]);

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
                  <button onClick={nextPage} className="text-slate-400">
                    Next page
                  </button>
                )}
                {offset !== 0 && (
                  <button onClick={previousPage} className="text-slate-400">
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
