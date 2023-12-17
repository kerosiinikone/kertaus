"use client";

import ScheduleWrapper from "@/app/schedules/_components/ScheduleWrapper";
import { gql, useQuery } from "@apollo/client";
import { ScheduleSchema } from "../../../../../shared";
import LoadingComponent from "@/components/ui/LoadingComponent";

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

export default function SchedulePage({ params }: { params: { sid: string } }) {
  const { data } = useQuery<SingleScheduleResponse>(scheduleQuery, {
    variables: {
      sid: params.sid,
    },
  });
  return (
    <>
      <div className="flex md:flex-col flex-row items-center">
        {data?.schedule ? (
          <ScheduleWrapper
            content={data.schedule.content.aikataulu}
            name={data.schedule.name}
          />
        ) : (
          <LoadingComponent />
        )}
      </div>
    </>
  );
}
