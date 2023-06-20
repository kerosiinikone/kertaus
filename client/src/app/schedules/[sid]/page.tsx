"use client";

import ScheduleWrapper from "@/components/ScheduleWrapper";
import { gql, useQuery } from "@apollo/client";
import { ScheduleSchema } from "../../../../../shared";
import LoadingComponent from "@/components/LoadingComponent";

interface SingleScheduleResponse {
  schedule: {
    name: string;
    content: ScheduleSchema[];
  };
}

const ScheduleQuery = gql`
  query ($sid: String!) {
    schedule(sid: $sid) {
      name
      content {
        aiheet
        kesto
        tehtavananto
        teoriat
      }
    }
  }
`;

export default function SchedulePage({ params }: { params: { sid: string } }) {
  const { data } = useQuery<SingleScheduleResponse>(ScheduleQuery, {
    variables: {
      sid: params.sid,
    },
  });
  return (
    <>
      <div className="flex md:flex-col flex-row items-center">
        {data?.schedule ? (
          <ScheduleWrapper
            content={data.schedule.content}
            name={data.schedule.name}
          />
        ) : (
          <LoadingComponent />
        )}
      </div>
    </>
  );
}
