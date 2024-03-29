import { CodeType, PromptInput } from "../../../../shared/index.js";
import { requestSchedule } from "./completions.js";
import { PRE_PROMPT } from "./prompts.js";

export const generatePrompt = (input: PromptInput) => {
  let topics: string;
  if (input.courses && input.courses.length) {
    topics = input.courses.join(", ");
  }

  switch (input.subjectType) {
    case CodeType.SUBJECT:
      return `Aiheet: ${topics}. Aikataulun pituus: ${input.timePeriod.toLowerCase()}. Suhteellinen tehtävien määrä: ${input.intensity.toLowerCase()}.`;
    case CodeType.COURSE:
      return `Aihe: ${input.subject.toLowerCase()}. Aikataulun pituus: ${input.timePeriod.toLowerCase()}. Suhteellinen tehtävien määrä: ${input.intensity.toLowerCase()}.`;
  }
};

export const generateInitialPrompt = (input: PromptInput) => {
  return [
    { role: "system", content: PRE_PROMPT, name: "setup" },
    { role: "user", content: generatePrompt(input), name: "schedule" },
  ];
};

export const parseRequestJSON = (message: string) => {
  try {
    const jsonResponse = JSON.parse(message);
    return jsonResponse;
  } catch (parseError) {
    const fullResponseRequest = requestSchedule(null, message);
    return fullResponseRequest;
  }
};
