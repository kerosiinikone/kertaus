import { gql, useLazyQuery } from "@apollo/client";
import { ScheduleModelSchema } from "../../../../../shared";
import { useEffect, useState } from "react";

export interface ScheduleQueryResponse {
  schedules: ScheduleModelSchema[];
}

export interface FetchQueryVars {
  take: number;
  offset: number;
}

const userSchedulesQuery = gql`
  query ($take: Float!, $offset: Float!) {
    schedules(take: $take, offset: $offset) {
      id
      name
    }
  }
`;

export const useFetchSchedules = ({
  defaultAmount,
}: {
  defaultAmount: number;
}) => {
  const [offset, setOffset] = useState<number>(0);
  const [fetchSchedules, { data: schedulesData, error: scheduleError }] =
    useLazyQuery<ScheduleQueryResponse, FetchQueryVars>(userSchedulesQuery, {
      fetchPolicy: "no-cache",
    });

  const nextPage = () => {
    setOffset(offset + 1);
    fetchSchedules({
      variables: {
        take: defaultAmount,
        offset: (offset + 1) * defaultAmount,
      },
    });
  };

  const previousPage = () => {
    setOffset(offset - 1);
    fetchSchedules({
      variables: {
        take: defaultAmount + 1,
        offset: (offset - 1) * defaultAmount,
      },
    });
  };

  useEffect(() => {
    if (offset !== 0 && schedulesData?.schedules.length === 0) {
      setOffset(0);
      fetchSchedules({
        variables: {
          take: defaultAmount * 2,
          offset: 0,
        },
      });
    }
  }, [schedulesData]);
  return [
    fetchSchedules,
    schedulesData,
    scheduleError,
    nextPage,
    previousPage,
    offset,
  ] as const;
};
