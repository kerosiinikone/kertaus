"use client";

import ScheduleWrapper from "@/app/schedules/_components/ScheduleWrapper";
import LoadingComponent from "@/components/ui/LoadingComponent";
import { useFetchSingleSchedule } from "../_hooks/useFetchSingleSchedule";

export default function SchedulePage({ params }: { params: { sid: string } }) {
  const [data] = useFetchSingleSchedule(params.sid);

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
