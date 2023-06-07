import { ChatCompletionRequestMessage } from "openai";
import { CodeType, PromptInput } from "../../../../shared/index.ts";
import { openai } from "./index.ts";
import { PRE_PROMPT } from "./prompts.ts";

const DEFAULT_MODEL = "gpt-3.5-turbo";

export const requestSchedule = async (input: PromptInput) => {
  const initialPrompt: ChatCompletionRequestMessage[] = [
    { role: "system", content: PRE_PROMPT },
    { role: "user", content: generatePrompt(input) },
    {
      role: "user",
      content:
        "Jätä vastauksesta pois kaikki muu kuin JSON-formaatissa annettu aikataulu.",
    },
  ];

  try {
    const response = await openai.createChatCompletion({
      model: DEFAULT_MODEL,
      messages: initialPrompt,
      temperature: 0.4,
    });
    console.log(response.data.choices[0].message.content);
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
      prompt.push(
        `Anna minulle kertausaikataulu aineesta ${input.subject.toLowerCase()}, jossa käsittelet seuraavia aiheita: ${topics}.`
      );
      break;
    case CodeType.COURSE:
      prompt.push(
        `Anna minulle kertausaikataulu aiheesta ${input.subject.toLowerCase()}.`
      );
      break;
  }

  prompt.push(
    `Aikataulun pituuden on oltava tasan ${input.timePeriod.toLowerCase()}.`
  );

  // prompt.push(
  //   `Aikataulun intensiteetin on vastattava tasoa ${input.intensity}.`
  // );

  if (process.env.ENVIRONMENT === "DEVELOPMENT") console.log(prompt.join(" "));

  return prompt.join(" ");
};
