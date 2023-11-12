import { FetchQueryVars, ScheduleQueryResponse } from "@/app/me/page";
import { LazyQueryExecFunction, gql, useMutation } from "@apollo/client";
import { useEffect } from "react";

const deleteScheduleMutation = gql`
  mutation ($sid: String!) {
    deleteSchedule(sid: $sid) {
      id
    }
  }
`;

const DEFAULT_SCHEDULE_AMOUNT = 5;

interface DeleteScheduleResponse {
  deleteSchedule: {
    id?: string;
  };
}

interface useDeleteArgs {
  fetchSchedules: LazyQueryExecFunction<ScheduleQueryResponse, FetchQueryVars>;
  offset: number;
}

const useDelete = ({ fetchSchedules, offset }: useDeleteArgs) => {
  const [deleteBySid, { data: deletedData }] =
    useMutation<DeleteScheduleResponse>(deleteScheduleMutation);

  const deleteSchedule = (sid: string) => {
    deleteBySid({
      variables: {
        sid,
      },
    });
  };

  useEffect(() => {
    if (deletedData?.deleteSchedule.id)
      fetchSchedules({
        variables: {
          take: DEFAULT_SCHEDULE_AMOUNT * 2,
          offset: offset * DEFAULT_SCHEDULE_AMOUNT,
        },
      });
  }, [deletedData]);

  return [deleteSchedule] as const;
};

export default useDelete;
