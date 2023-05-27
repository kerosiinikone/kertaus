import { CodeType, PromptInput } from "../../../../shared/index.ts";
import { openai } from "./index.ts";

const DEFAULT_MODEL = "gpt-3.5-turbo";

const PRE_PROMPT = `Tee minulle kertausaikataulu `;

const JSON_FORMAT_RESPONSE = JSON.stringify({
  aihe: "aihe lyhyesti",
  teoria: "teoria lyhyesti",
  tehtavat: "tehtävien lukumäärä",
  kesto: "päivittäisen kertausajan kesto tunteina",
});

export const requestSchedule = async (input: PromptInput) => {
  try {
    const response = await openai.createChatCompletion({
      model: DEFAULT_MODEL,
      messages: [{ role: "user", content: generatePrompt(input) }],
      temperature: 0.8,
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    throw error;
  }
};

const generatePrompt = (input: PromptInput) => {
  let prompt: string = "";

  switch (input.subjectType) {
    case CodeType.SUBJECT:
      const listOfTopics = input.courses.map((course) => course.name);
      let topics = listOfTopics.join(", ");
      prompt += `lukion aineesta ${input.subject.toLowerCase()}, jossa käsittelet ainakin seuraavia aiheita: ${topics}`;
      break;
    case CodeType.COURSE:
      prompt += `lukion oppimäärän mukaisesti aiheesta ${input.subject.toLowerCase()}`;
      break;
    default:
      break;
  }

  prompt += `, ja jonka kesto on ${input.timePeriod.toLowerCase()}.`;
  prompt +=
    " " + `Aikataulun intensiteetin on vastattava tasoa ${input.intensity}`;
  prompt +=
    " " +
    "Anna vastaus pelkkänä JSON-formaattina jokaiselta päivältä listana, jossa päivillä ei ole nimiä seuraavan kaavan mukaan: " +
    JSON_FORMAT_RESPONSE;

  return PRE_PROMPT + prompt;
};
