"use client";

import AIWrapper from "@/app/AIWrapper";
import { Periods } from "../../../shared/index";
import { createPortal } from "react-dom";
import ModalLoader from "@/components/ui/ModalLoader";
import ScheduleWrapper from "@/app/schedules/_components/ScheduleWrapper";
import ErrorMsg from "@/components/ui/ErrorMsg";
import { useEffect } from "react";
import { useGlobalErrorContext } from "@/context/Error/state";
import { useCreateSchedule } from "./_hooks/useCreateSchedule";

export interface Subject {
  name: string;
  shorthand: string;
}

const EXAMPLE_SUBJECT_LIST: Subject[] = [
  { name: "Pitkä Matematiikka", shorthand: "MAA" },
  { name: "Lyhyt Matematiikka", shorthand: "MAB" },
  { name: "Fysiikka", shorthand: "FY" },
  { name: "Kemia", shorthand: "KE" },
  { name: "Äidinkieli ja kirjallisuus", shorthand: "ÄI" },
  { name: "Omavalintainen aine", shorthand: "Muu" },
];

const REVISION_PERIOD: Periods[] = [
  Periods.FIVE,
  Periods.WEEK,
  Periods.TWOWEEKS,
];

export default function AILandingPage() {
  const { globalError, addError } = useGlobalErrorContext();
  const [newRequest, loadingSchedule, scheduleData] =
    useCreateSchedule(addError);

  return (
    <>
      <div className="flex md:flex-col flex-row items-center">
        {scheduleData?.createSchedule?.content ? (
          <ScheduleWrapper
            content={scheduleData?.createSchedule.content.aikataulu}
            name={scheduleData?.createSchedule.name}
          />
        ) : (
          <AIWrapper
            submit={newRequest}
            periods={REVISION_PERIOD}
            subjectList={EXAMPLE_SUBJECT_LIST}
          />
        )}
      </div>
      {loadingSchedule && createPortal(<ModalLoader />, document.body)}
      {globalError.length >= 1 &&
        createPortal(<ErrorMsg error={globalError} />, document.body)}
    </>
  );
}
