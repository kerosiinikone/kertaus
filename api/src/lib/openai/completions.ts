import { ChatCompletionRequestMessage } from "openai";
import { CodeType, PromptInput } from "../../../../shared/index.ts";
import { openai } from "./index.ts";
import { PRE_PROMPT } from "./prompts.ts";

const DEFAULT_MODEL = process.env.AI_MODEL || "gpt-4-1106-preview";

export const requestSchedule = async (input: PromptInput) => {
  const initialPrompt: ChatCompletionRequestMessage[] = [
    { role: "system", content: PRE_PROMPT },
    { role: "user", content: generatePrompt(input) },
  ];

  const options = {
    model: DEFAULT_MODEL,
    messages: initialPrompt,
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 2048,
    top_p: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
  };

  try {
    const response = await openai.createChatCompletion(options);
    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    throw error;
  }
};

const generatePrompt = (input: PromptInput) => {
  let prompt: Array<string> = [];

  switch (input.subjectType) {
    case CodeType.SUBJECT:
      let topics = input.courses.join(", ");
      prompt.push(`Aiheet: ${topics}.`);
      break;
    case CodeType.COURSE:
      prompt.push(`Aihe: ${input.subject.toLowerCase()}.`);
      break;
  }

  prompt.push(`Aikataulun pituus: ${input.timePeriod.toLowerCase()}.`);

  prompt.push(
    `Suhteellinen tehtävien määrä: ${input.intensity.toLowerCase()}.`
  );

  if (process.env.ENVIRONMENT === "DEVELOPMENT") console.log(prompt.join(" "));

  return prompt.join(" ");
};
