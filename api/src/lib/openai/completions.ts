import { CodeType, PromptInput } from "../../../../shared/index.ts";
import { openai } from "./index.ts";

const DEFAULT_MODEL = "gpt-3.5-turbo";

const PRE_PROMPT = `Tee minulle kertausaikataulu `;

const JSON_FORMAT_RESPONSE = JSON.stringify({
  aiheet: "[aihe tai lista käsiteltävistä aiheista]",
  teoriat: "[aiheen teoria tai lista aiheiden teorioista]",
  tehtavananto: "tehtävänanto lyhyesti",
  kesto: "päivittäisen kertausajan kesto tunteina",
});

export const requestSchedule = async (input: PromptInput) => {
  try {
    const response = await openai.createChatCompletion({
      model: DEFAULT_MODEL,
      messages: [{ role: "user", content: generatePrompt(input) }],
      temperature: 0.2,
    });
    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    throw error;
  }
};

const generatePrompt = (input: PromptInput) => {
  let prompt: Array<string> = [];

  switch (input.subjectType) {
    case CodeType.SUBJECT:
      const listOfTopics = input.courses.map((course) => course.name);
      let topics = listOfTopics.join(", ");
      prompt.push(
        `lukion aineesta ${input.subject.toLowerCase()}, jossa käsittelet seuraavia aiheita: ${topics}.`
      );
      break;
    case CodeType.COURSE:
      prompt.push(
        `lukion oppimäärän mukaisesti aiheesta ${input.subject.toLowerCase()}.`
      );
      break;
  }

  prompt.push(
    `Aikataulun keston on oltava tasan ${input.timePeriod.toLowerCase()}.`
  );
  prompt.push(
    `Aikataulun intensiteetin on vastattava tasoa ${input.intensity}.`
  );
  prompt.push(
    "Jos aiheita on enemmän kuin päiviä, yhdessä päivässä on oltava useampi aihe. Pysy annetun päivämäärän sisällä."
  );
  prompt.push(
    "Anna vastaus JSON-formaatissa yhtenä listana siten, että jokaiselta päivältä on yksi olio, ja jossa päivillä ei ole nimiä seuraavan kaavan mukaan:"
  );
  prompt.push(JSON_FORMAT_RESPONSE);

  return PRE_PROMPT + prompt.join(" ");
};
