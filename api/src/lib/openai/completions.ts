import { PromptInput } from "../../../../shared/index.js";
import { openai } from "./index.js";
import { generatePrompt, parseRequestJSON } from "./helpers.js";
import { PRE_PROMPT } from "./prompts.js";
import OpenAI from "openai";
import { ChatCompletionCreateParams } from "openai/src/resources/chat/completions.js";

export const RES_TYPE: ChatCompletionCreateParams.ResponseFormat = {
  type: "json_object",
};
export const DEFAULT_MODEL = process.env.AI_MODEL || "gpt-4-1106-preview";

let RETRY_COUNT = 0;
const MAX_RETRY_COUNT = 2;

export const requestSchedule = async (input: PromptInput) => {
  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [
      { role: "system", content: PRE_PROMPT, name: "setup" },
      { role: "user", content: generatePrompt(input), name: "schedule" },
    ],
    model: DEFAULT_MODEL,
    response_format: RES_TYPE,
    temperature: 0.7,
    max_tokens: 2048,
    top_p: 1,
  };

  try {
    const completeData = await openai.chat.completions.create(params);
    const final = completeData.choices[0].message.content;
    const jsonResponse = parseRequestJSON(final, input);

    return jsonResponse;
  } catch (error) {
    if (RETRY_COUNT < MAX_RETRY_COUNT) {
      RETRY_COUNT++;
      return requestSchedule(input);
    } else {
      return Promise.reject(new Error("Maximum Retries"));
    }
  }
};
