"use client";

import AIWrapper from "@/components/AIWrapper";
import {
  CodeType,
  Intensities,
  Periods,
  PromptInput,
} from "../../../shared/index";
import { gql, useMutation } from "@apollo/client";
import { getValidatedInput } from "@/lib/util/validator";
import { createPortal } from "react-dom";
import ModalLoader from "@/components/ModalLoader";
import ScheduleWrapper from "@/components/ScheduleWrapper";

export interface Subject {
  name: string;
  shorthand: string;
}

const MOCKUP_LIST: Subject[] = [
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
  Periods.OTHER,
];

export interface ScheduleMutation {
  createSchedule: {
    content: {
      aiheet: string[];
      teoriat: string;
      tehtavananto: number;
      kesto: number;
    }[];
  };
}

const scheduleRequestMutation = gql`
  mutation (
    $subject: String!
    $timePeriod: String!
    $intensity: Intensities!
    $subjectType: CodeType!
    $courses: [String!]
  ) {
    createSchedule(
      subject: $subject
      timePeriod: $timePeriod
      intensity: $intensity
      subjectType: $subjectType
      courses: $courses
    ) {
      content {
        aiheet
        teoriat
        tehtavananto
        kesto
      }
    }
  }
`;

export default function AILandingPage() {
  const [requestSchedule, { loading: loadingSchedule, data: scheduleData }] =
    useMutation<ScheduleMutation>(scheduleRequestMutation, {
      fetchPolicy: "no-cache",
    });

  const MOCKUP_SUBMIT = (input: {
    subject: string;
    intensity: Intensities;
    timePeriod: string;
  }) => {
    const traversionResult = getValidatedInput(input);
    const promptInput: PromptInput = {
      ...input,
      courses: traversionResult.result.courses,
      subjectType: traversionResult.result.subjectType as CodeType,
    };

    requestSchedule({ variables: { ...promptInput } });
  };

  return (
    <>
      <div className="flex md:flex-col flex-row items-center">
        {scheduleData?.createSchedule?.content ? (
          <ScheduleWrapper content={scheduleData?.createSchedule?.content} />
        ) : (
          <AIWrapper
            submit={MOCKUP_SUBMIT}
            periods={REVISION_PERIOD}
            subjectList={MOCKUP_LIST}
          />
        )}
      </div>
      {loadingSchedule && createPortal(<ModalLoader />, document.body)}
    </>
  );
}
