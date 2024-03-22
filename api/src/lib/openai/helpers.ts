import { openai } from "./index.js";
import { CodeType, PromptInput } from "../../../../shared/index.js";
import { DEFAULT_MODEL, RES_TYPE } from "./completions.js";
import { PRE_PROMPT } from "./prompts.js";
import OpenAI from "openai";

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

export const parseRequestJSON = (message: string, input: PromptInput) => {
  try {
    const jsonResponse = JSON.parse(message);
    return jsonResponse;
  } catch (parseError) {
    const fullResponseRequest = requestFullCompletion(message, input);
    return fullResponseRequest;
  }
};

export const requestFullCompletion = async (
  partialRes: string,
  input: PromptInput
) => {
  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [
      { role: "system", content: partialRes, name: "setup" },
      { role: "assistant", content: partialRes, name: "continue" },
      {
        role: "user",
        content:
          "Tee antamasi vastaus loppuun annettujen tietojen perusteella.",
        name: "",
      },
    ],
    model: DEFAULT_MODEL,
    response_format: RES_TYPE,
    temperature: 1,
    max_tokens: 2048,
    top_p: 1,
  };
  const completeData = await openai.chat.completions.create(params);
  const final = completeData.choices[0].message.content;

  const jsonResponse = parseRequestJSON(final, input);

  return jsonResponse;
};
