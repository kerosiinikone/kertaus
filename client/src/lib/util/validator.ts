import { getDetails } from "./traverse";

export const BAD_INPUT = "Väärä aine tai kurssi";

export const getValidatedInput = (input: { subject: string }) => {
  const i = input.subject.toLowerCase();
  const result = getDetails(i);

  if (!result.contains) throw new Error(BAD_INPUT);

  return { success: true, result };
};
