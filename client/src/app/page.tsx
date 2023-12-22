"use client";

import AIWrapper from "@/app/AIWrapper";
import {
  CodeType,
  Intensities,
  Periods,
  PromptInput,
} from "../../../shared/index";
import { gql, useMutation } from "@apollo/client";
import { BAD_INPUT, getValidatedInput } from "@/lib/util/validator";
import { createPortal } from "react-dom";
import ModalLoader from "@/components/ui/ModalLoader";
import ScheduleWrapper from "@/app/schedules/_components/ScheduleWrapper";
import ErrorMsg from "@/components/ui/ErrorMsg";
import { useEffect } from "react";
import { useGlobalErrorContext } from "@/context/Error/state";

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
];

interface ScheduleMutation {
  createSchedule: {
    name: string;
    content: {
      aikataulu: {
        aiheet: string[];
        teoriat: string;
        tehtavananto: number;
        kesto: number;
      }[];
    };
  };
}

type Input = {
  subject: string;
  intensity: Intensities;
  timePeriod: string;
};

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
      name
      content {
        aikataulu {
          aiheet
          teoriat
          tehtavananto
          kesto
        }
      }
    }
  }
`;

export default function AILandingPage() {
  const [
    requestSchedule,
    { loading: loadingSchedule, data: scheduleData, error: scheduleError },
  ] = useMutation<ScheduleMutation>(scheduleRequestMutation, {
    fetchPolicy: "no-cache",
  });
  const { globalError, addError } = useGlobalErrorContext();

  const MOCKUP_SUBMIT = (input: Input) => {
    try {
      const traversionResult = getValidatedInput(input);

      const promptInput: PromptInput = {
        ...input,
        courses: traversionResult.result.courses,
        subjectType: traversionResult.result.subjectType as CodeType,
        subject: traversionResult.result.subject ?? input.subject,
      };

      requestSchedule({ variables: { ...promptInput } });
    } catch (error) {
      const e = new Error(BAD_INPUT);
      addError([e]);
    }
  };

  useEffect(() => {
    if (scheduleError) {
      addError([scheduleError]);
    }
  }, [scheduleError]);

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
            submit={MOCKUP_SUBMIT}
            periods={REVISION_PERIOD}
            subjectList={MOCKUP_LIST}
          />
        )}
      </div>
      {loadingSchedule && createPortal(<ModalLoader />, document.body)}
      {globalError.length >= 1 &&
        createPortal(<ErrorMsg error={globalError} />, document.body)}
    </>
  );
}
