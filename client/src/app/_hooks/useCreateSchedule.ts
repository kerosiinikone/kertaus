import { ApolloError, gql, useMutation } from "@apollo/client";
import { CodeType, Intensities, PromptInput } from "../../../../shared";
import { BAD_INPUT, getValidatedInput } from "@/lib/util/validator";
import { useEffect } from "react";

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

export const useCreateSchedule = (
  addError: (error: (ApolloError | Error | undefined)[]) => void
) => {
  const [
    newRequest,
    { loading: loadingSchedule, data: scheduleData, error: scheduleError },
  ] = useMutation<ScheduleMutation>(scheduleRequestMutation, {
    fetchPolicy: "no-cache",
  });

  const requestSchedule = (input: Input) => {
    try {
      const traversionResult = getValidatedInput(input);

      const promptInput: PromptInput = {
        ...input,
        courses: traversionResult.result.courses,
        subjectType: traversionResult.result.subjectType as CodeType,
        subject: traversionResult.result.subject ?? input.subject,
      };

      newRequest({ variables: { ...promptInput } });
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

  return [requestSchedule, loadingSchedule, scheduleData] as const;
};
