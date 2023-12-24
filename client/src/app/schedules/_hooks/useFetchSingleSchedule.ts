import { gql, useQuery } from "@apollo/client";
import { ScheduleSchema } from "../../../../../shared";

interface SingleScheduleResponse {
  schedule: {
    name: string;
    content: ScheduleSchema;
  };
}

const scheduleQuery = gql`
  query ($sid: String!) {
    schedule(sid: $sid) {
      name
      content {
        aikataulu {
          aiheet
          kesto
          tehtavananto
          teoriat
        }
      }
    }
  }
`;

export const useFetchSingleSchedule = (sid: string) => {
  const { data } = useQuery<SingleScheduleResponse>(scheduleQuery, {
    variables: {
      sid,
    },
  });
  return [data] as const;
};
