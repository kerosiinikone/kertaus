import { gql, useQuery } from "@apollo/client";
import { ScheduleModelSchema } from "../../../../../shared";

export interface UserQueryResponse {
  me: {
    id?: string;
    email?: string;
    schedules?: ScheduleModelSchema[];
  };
}

const meQuery = gql`
  query {
    me {
      email
      id
    }
  }
`;

export const useUserQuery = () => {
  const {
    data,
    refetch,
    error: userError,
  } = useQuery<UserQueryResponse>(meQuery, {
    fetchPolicy: "no-cache",
  });
  return [data, refetch, userError] as const;
};
